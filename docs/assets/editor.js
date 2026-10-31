/* ===== GabeTeX online LaTeX editor ===== */

(function () {
  'use strict';

  /* ---------- elements ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var source = document.getElementById('source');
  var previewFrame = document.getElementById('preview-frame');
  var previewEmpty = document.getElementById('preview-empty');
  var previewStatus = document.getElementById('preview-status');
  var compilePanel = document.getElementById('compile-panel');
  var compileOutput = document.getElementById('compile-output');
  var btnCompile = document.getElementById('btn-compile');
  var btnDownload = document.getElementById('btn-download');
  var btnNew = document.getElementById('btn-new');
  var btnAddFile = document.getElementById('btn-add-file');
  var btnHidePanel = document.getElementById('btn-hide-panel');
  var fileList = document.getElementById('file-list');

  /* ---------- state ---------- */
  var state = {
    files: { 'main.tex': '\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\begin{document}\nHello, world!\n\\end{document}\n' },
    activeFile: 'main.tex',
    compiling: false,
    lastCompile: 0,
    pdfBlobUrl: null,
    csrfToken: null,
    rateLimitRemaining: 10,
    rateLimitReset: 0
  };

  /* ---------- theme ---------- */
  function applyTheme() {
    var isDark = root.classList.contains('dark');
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }
  themeToggle.addEventListener('click', function () {
    var isDark = root.classList.toggle('dark');
    try { localStorage.setItem('gabetex.editor.theme', isDark ? 'dark' : 'light'); } catch (e) {}
    applyTheme();
  });
  applyTheme();

  /* ---------- KaTeX auto-render (client-side math preview) ---------- */
  function renderMath(text) {
    /* Replace inline math $...$ and display math $$...$$ with KaTeX spans.
       This is a client-side-only preview; the backend does the real PDF compile. */
    return text
      .replace(/\$\$([\s\S]*?)\$\$/g, function (_, m) {
        return '<span class="katex-display" aria-label="Display math">' + escapeHtml(m) + '</span>';
      })
      .replace(/\$([^$\n]+?)\$/g, function (_, m) {
        return '<span class="katex-inline" aria-label="Inline math">' + escapeHtml(m) + '</span>';
      });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- file management ---------- */
  function renderFileList() {
    fileList.innerHTML = '';
    Object.keys(state.files).forEach(function (name) {
      var li = document.createElement('li');
      li.className = 'file-item' + (name === state.activeFile ? ' active' : '');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', name === state.activeFile ? 'true' : 'false');
      li.setAttribute('data-file', name);
      li.textContent = name;
      li.addEventListener('click', function () { setActiveFile(name); });
      fileList.appendChild(li);
    });
  }
  function setActiveFile(name) {
    state.activeFile = name;
    source.value = state.files[name];
    source.setAttribute('aria-label', 'LaTeX source — ' + name);
    renderFileList();
    updateStatus('Opened ' + name);
  }
  btnAddFile.addEventListener('click', function () {
    var name = prompt('File name (e.g. chapter.tex):', 'chapter.tex');
    if (!name) return;
    if (/\.tex$/i.test(name) === false) name += '.tex';
    if (state.files[name]) { alert('File already exists.'); return; }
    state.files[name] = '\\documentclass{article}\n\\begin{document}\n\\end{document}\n';
    renderFileList();
    setActiveFile(name);
  });

  /* ---------- source input ---------- */
  source.addEventListener('input', function () {
    state.files[state.activeFile] = source.value;
    /* Debounced client-side math preview (not a real compile) */
    clearTimeout(source._mathTimer);
    source._mathTimer = setTimeout(updateMathPreview, 300);
  });

  function updateMathPreview() {
    /* Lightweight client-side math hint only; does not compile LaTeX. */
    var text = source.value;
    var hasMath = /\$/.test(text);
    previewStatus.textContent = hasMath ? 'Math detected (client-side preview only)' : 'Ready';
  }

  /* ---------- security: input validation ---------- */
  /* Dangerous LaTeX primitives that allow file/system access */
  var DANGEROUS = [
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
  function validateSource(src) {
    var issues = [];
    var upper = src.toUpperCase();
    DANGEROUS.forEach(function (cmd) {
      var re = new RegExp('\\\\' + cmd.replace(/\\/g, '\\\\') + '(?![a-zA-Z])', 'gi');
      if (re.test(src)) issues.push(cmd);
    });
    return issues;
  }

  /* ---------- security: CSRF token ---------- */
  function getCsrfToken() {
    if (state.csrfToken) return Promise.resolve(state.csrfToken);
    return fetch('/api/csrf', { credentials: 'same-origin' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.csrfToken = data.token || null;
        return state.csrfToken;
      })
      .catch(function () { return null; });
  }

  /* ---------- security: rate limit check ---------- */
  function checkRateLimit() {
    var now = Date.now();
    if (now > state.rateLimitReset) {
      state.rateLimitRemaining = 10;
      state.rateLimitReset = now + 60000;
    }
    if (state.rateLimitRemaining <= 0) {
      return Promise.reject(new Error('Rate limit exceeded. Try again in ' + Math.ceil((state.rateLimitReset - now) / 1000) + ' seconds.'));
    }
    state.rateLimitRemaining--;
    return Promise.resolve();
  }

  /* ---------- compile ---------- */
  function appendOutput(text, cls) {
    var line = document.createElement('div');
    line.textContent = text;
    if (cls) line.className = cls;
    compileOutput.appendChild(line);
    compileOutput.scrollTop = compileOutput.scrollHeight;
  }
  function clearOutput() { compileOutput.innerHTML = ''; }

  function compile() {
    if (state.compiling) return;
    var src = state.files[state.activeFile];

    /* Security: validate input */
    var dangers = validateSource(src);
    if (dangers.length > 0) {
      clearOutput();
      appendOutput('Security: blocked dangerous command(s): ' + dangers.join(', '), 'err');
      compilePanel.hidden = false;
      return;
    }

    /* Security: rate limit */
    checkRateLimit().catch(function (err) {
      clearOutput();
      appendOutput(err.message, 'err');
      compilePanel.hidden = false;
      return;
    });

    state.compiling = true;
    btnCompile.setAttribute('aria-busy', 'true');
    btnCompile.textContent = 'Compiling…';
    previewStatus.textContent = 'Compiling…';
    previewEmpty.hidden = true;
    previewFrame.style.display = 'none';
    clearOutput();
    compilePanel.hidden = false;

    getCsrfToken().then(function (token) {
      var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      if (token) headers['X-CSRF-Token'] = token;

      return fetch('/api/compile', {
        method: 'POST',
        headers: headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          source: src,
          file: state.activeFile,
          engine: 'pdflatex'
        })
      });
    })
    .then(function (res) {
      if (res.status === 429) throw new Error('Rate limit exceeded.');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      if (data.ok && data.pdf) {
        /* Display PDF in iframe */
        var blob = b64toBlob(data.pdf, 'application/pdf');
        var url = URL.createObjectURL(blob);
        if (state.pdfBlobUrl) URL.revokeObjectURL(state.pdfBlobUrl);
        state.pdfBlobUrl = url;
        previewFrame.src = url;
        previewFrame.style.display = 'block';
        previewEmpty.hidden = true;
        previewStatus.textContent = 'Compiled successfully';
        appendOutput('Compilation successful.', 'ok');
        btnDownload.disabled = false;
      } else {
        appendOutput(data.error || 'Compilation failed.', 'err');
        previewStatus.textContent = 'Compilation failed';
      }
    })
    .catch(function (err) {
      appendOutput('Error: ' + err.message, 'err');
      previewStatus.textContent = 'Compilation error';
    })
    .finally(function () {
      state.compiling = false;
      btnCompile.removeAttribute('aria-busy');
      btnCompile.textContent = 'Compile';
    });
  }

  btnCompile.addEventListener('click', compile);
  btnHidePanel.addEventListener('click', function () { compilePanel.hidden = true; });

  /* ---------- download ---------- */
  btnDownload.addEventListener('click', function () {
    if (!state.pdfBlobUrl) return;
    var a = document.createElement('a');
    a.href = state.pdfBlobUrl;
    a.download = state.activeFile.replace(/\.tex$/i, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  btnDownload.disabled = true;

  /* ---------- new document ---------- */
  btnNew.addEventListener('click', function () {
    if (!confirm('Discard unsaved changes?')) return;
    state.files = { 'main.tex': '\\documentclass{article}\n\\begin{document}\n\\end{document}\n' };
    state.activeFile = 'main.tex';
    renderFileList();
    setActiveFile('main.tex');
    clearOutput();
    compilePanel.hidden = true;
    previewFrame.src = 'about:blank';
    previewFrame.style.display = 'none';
    previewEmpty.hidden = false;
    previewStatus.textContent = 'Ready';
    btnDownload.disabled = true;
  });

  /* ---------- helpers ---------- */
  function b64toBlob(b64, mime) {
    var bin = atob(b64);
    var buf = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return new Blob([buf], { type: mime });
  }
  function updateStatus(msg) {
    var status = document.querySelector('.source-status');
    if (status) status.textContent = msg;
  }

  /* ---------- init ---------- */
  renderFileList();
  setActiveFile('main.tex');
  updateMathPreview();

  /* Expose for debugging */
  window.gabetexEditor = { validateSource: validateSource, state: state };

})();