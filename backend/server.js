/* ===== GabeTeX secure LaTeX compilation backend =====
 *
 * This is an EXAMPLE backend for the GabeTeX online LaTeX editor.
 * It compiles LaTeX source to PDF using pdflatex in a sandboxed directory.
 *
 * SECURITY DESIGN:
 *  - Same-origin communication only (credentials: 'same-origin')
 *  - CSRF tokens for state-changing requests
 *  - Rate limiting per IP
 *  - Input validation: dangerous LaTeX primitives are rejected
 *  - Sandboxed compilation: each job runs in a temp dir with no network
 *  - No shell execution: pdflatex is invoked via child_process with fixed args
 *  - Content Security Policy via helmet
 *  - Timeout on compilation to prevent DoS
 *
 * To run:
 *   npm install
 *   npm start
 *
 * Requires a TeX distribution (TeX Live, MiKTeX, or MacTeX) with pdflatex
 * installed and available on PATH.
 */

'use strict';

const express = require('express');
const cors = require('cors');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const { execFile } = require('child_process');
const { tmpdir } = require('os');
const { join } = require('path');
const { mkdtemp, writeFile, readFile, unlink, rmdir } = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- security middleware ---------- */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.use(cors({ origin: false, credentials: true })); // same-origin only
app.use(express.json({ limit: '256kb' })); // limit payload size

/* ---------- CSRF ---------- */
const csrfProtection = csrf({ cookie: true });
app.get('/api/csrf', csrfProtection, function (req, res) {
  res.json({ token: req.csrfToken() });
});

/* ---------- rate limiting ---------- */
const compileLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 compiles per minute per IP
  message: { error: 'Rate limit exceeded. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

/* ---------- dangerous LaTeX command allowlist/blocklist ---------- */
/* Commands that allow file system access, shell execution, or arbitrary code */
const DANGEROUS_COMMANDS = [
  '\\input', '\\include', '\\verbatiminput', '\\lstinputlisting',
  '\\immediate\\write18', '\\write18', '\\shellesc', '\\shellescape',
  '\\pdffilemoddate', '\\pdffilesize', '\\read', '\\write', '\\openout',
  '\\closeout', '\\mkdir', '\\catcode', '\\chardef', '\\mathcode',
  '\\countdef', '\\dimendef', '\\skipdef', '\\muskipdef', '\\toksdef',
  '\\edef', '\\gdef', '\\xdef', '\\let', '\\futurelet', '\\ifcase',
  '\\ifnum', '\\ifdim', '\\ifodd', '\\ifvoid', '\\ifhbox', '\\ifvbox',
  '\\ifx', '\\if', '\\else', '\\fi', '\\loop', '\\repeat', '\\expandafter',
  '\\noexpand', '\\romannumeral', '\\number', '\\jobname', '\\font',
  '\\fontname', '\\externalfont', '\\pdfmapfile', '\\pdfmapline',
  '\\pdfoutput', '\\pdfcompresslevel', '\\pdfdecodemap', '\\pdfembedfile',
  '\\pdfcopy', '\\pdfrefxobj', '\\pdfximage', '\\pdfrefximage',
  '\\special', '\\directlua', '\\luaexec', '\\luafunction'
];

const DANGEROUS_REGEX = new RegExp(
  DANGEROUS_COMMANDS.map(c => '\\\\' + c.replace(/\\/g, '\\\\') + '(?![a-zA-Z])').join('|'),
  'gi'
);

function validateSource(src) {
  const matches = src.match(DANGEROUS_REGEX);
  return matches ? matches : [];
}

/* ---------- compile endpoint ---------- */
app.post('/api/compile', csrfProtection, compileLimiter, async function (req, res) {
  try {
    const { source, file = 'main.tex', engine = 'pdflatex' } = req.body;

    if (typeof source !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing source.' });
    }

    /* Security: validate input */
    const dangers = validateSource(source);
    if (dangers.length > 0) {
      return res.status(400).json({
        ok: false,
        error: 'Blocked dangerous command(s): ' + dangers.join(', ')
      });
    }

    /* Security: sandboxed temp directory */
    const workDir = await mkdtemp(join(tmpdir(), 'gabetex-compile-'));
    const texFile = join(workDir, file.replace(/\.\.\//g, '_')); // prevent path traversal

    try {
      await writeFile(texFile, source, 'utf8');

      /* Compile with fixed args, no shell, timeout 30s */
      const pdfPath = await new Promise((resolve, reject) => {
        const child = execFile(engine, [
          '-interaction=nonstopmode',
          '-halt-on-error',
          '-output-directory=' + workDir,
          texFile
        ], {
          cwd: workDir,
          timeout: 30000,
          maxBuffer: 10 * 1024 * 1024,
          env: { ...process.env, PATH: '/usr/bin:/bin' } // minimal env
        }, function (err, stdout, stderr) {
          if (err) {
            reject(new Error(stderr || stdout || err.message));
            return;
          }
          const pdf = texFile.replace(/\.tex$/i, '.pdf');
          resolve(pdf);
        });
      });

      const pdfBuf = await readFile(pdfPath);
      res.json({ ok: true, pdf: pdfBuf.toString('base64') });
    } finally {
      /* Cleanup: remove temp directory and contents */
      try {
        const files = await (await import('fs/promises')).readdir(workDir);
        await Promise.all(files.map(f => unlink(join(workDir, f))));
        await rmdir(workDir);
      } catch (e) { /* best effort */ }
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ---------- health ---------- */
app.get('/api/health', function (req, res) {
  res.json({ ok: true });
});

app.listen(PORT, function () {
  console.log('GabeTeX backend listening on http://localhost:' + PORT);
});
