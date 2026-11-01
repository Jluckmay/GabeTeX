/* ===== GabeTeX online LaTeX editor ===== */

(function () {
  'use strict';

  /* ---------- elements ---------- */
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var source = document.getElementById('source');
  var gutter = document.getElementById('editor-gutter');
  var previewFrame = document.getElementById('preview-frame');
  var previewEmpty = document.getElementById('preview-empty');
  var previewStatus = document.getElementById('preview-status');
  var previewControls = document.getElementById('preview-controls');
  var pcZoom = document.getElementById('pc-zoom');
  var pcPage = document.getElementById('pc-page');
  var compilePanel = document.getElementById('compile-panel');
  var compileOutput = document.getElementById('compile-output');
  var btnCompile = document.getElementById('btn-compile');
  var btnDownload = document.getElementById('btn-download');
  var btnAddFile = document.getElementById('btn-add-file');
  var btnZoomIn = document.getElementById('btn-zoom-in');
  var btnZoomOut = document.getElementById('btn-zoom-out');
  var fileList = document.getElementById('file-list');
  var tabList = document.querySelector('.tab-list');
  var statusCompile = document.getElementById('status-compile');
  var statusErrors = document.getElementById('status-errors');
  var statusWarnings = document.getElementById('status-warnings');
  var statusCursor = document.getElementById('status-cursor');
  var docTitle = document.getElementById('doc-title');
  var docPath = document.getElementById('doc-path');

  /* ---------- state ---------- */
  var state = {
    files: { 'main.tex': '\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\begin{document}\nHello, world!\n\\end{document}\n' },
    activeFile: 'main.tex',
    compiling: false,
    lastCompile: 0,
    pdfBlobUrl: null,
    csrfToken: null,
    rateLimitRemaining: 10,
    rateLimitReset: 0,
    zoom: 1,
    errors: 0,
    warnings: 0
  };

  /* ---------- theme ---------- */
  function applyTheme() {
    var isDark = root.classList.contains('dark');
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  }
  themeToggle.addEventListener('click', function () {
    var isDark = root.classList.toggle('dark');
    try { localStorage.setItem('gabetex.theme', isDark ? 'dark' : 'light'); } catch (e) {}
    applyTheme();
  });
  applyTheme();

  /* ---------- file tabs ---------- */
  function renderTabs() {
    tabList.innerHTML = '';
    Object.keys(state.files).forEach(function (name) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'etab' + (name === state.activeFile ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', name === state.activeFile ? 'true' : 'false');
      btn.setAttribute('data-file', name);
      btn.innerHTML = name + ' <span class="etab-close" aria-hidden="true">×</span>';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setActiveFile(name);
      });
      tabList.appendChild(btn);
    });
  }
  function setActiveFile(name) {
    state.activeFile = name;
    source.value = state.files[name];
    source.setAttribute('aria-label', 'LaTeX source — ' + name);
    docTitle.textContent = name;
    docPath.textContent = 'sections/' + name;
    renderTabs();
    renderFileList();
    renderGutter();
    updateStatus('Opened ' + name);
    updateCursor();
  }

  /* ---------- file tree ---------- */
  function renderFileList() {
    fileList.innerHTML = '';
    Object.keys(state.files).forEach(function (name) {
      var li = document.createElement('li');
      li.className = 'ft-item ft-file' + (name === state.activeFile ? ' active' : '');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', name === state.activeFile ? 'true' : 'false');
      li.setAttribute('data-file', name);
      li.textContent = name;
      li.addEventListener('click', function () { setActiveFile(name); });
      fileList.appendChild(li);
    });
  }

  btnAddFile.addEventListener('click', function () {
    var name = prompt('File name (e.g. chapter.tex):', 'chapter.tex');
    if (!name) return;
    if (/\.tex$/i.test(name) === false) name += '.tex';
    if (state.files[name]) { alert('File already exists.'); return; }
    state.files[name] = '\\documentclass{article}\n\\begin{document}\n\\end{document}\n';
    renderTabs();
    renderFileList();
    setActiveFile(name);
  });

  /* ---------- gutter / line numbers ---------- */
  function renderGutter() {
    var lines = source.value.split('\\n');
    var html = '';
    for (var i = 0; i < lines.length; i++) {
      html += '<div class="gutter-line" data-line="' + (i + 1) + '">' + (i + 1) + '</div>';
    }
    gutter.innerHTML = html;
    syncGutterScroll();
  }
  function syncGutterScroll() {
    gutter.scrollTop = source.scrollTop;
  }
  function updateGutter() {
    renderGutter();
  }
  source.addEventListener('scroll', syncGutterScroll);
  source.addEventListener('input', function () {
    state.files[state.activeFile] = source.value;
    renderGutter();
    updateCursor();
    clearTimeout(source._mathTimer);
    source._mathTimer = setTimeout(updateMathPreview, 300);
  });
  source.addEventListener('keyup', updateCursor);
  source.addEventListener('click', updateCursor);

  function updateCursor() {
    var val = source.value.substring(0, source.selectionStart);
    var lines = val.split('\\n');
    var line = lines.length;
    var col = lines[lines.length - 1].length + 1;
    statusCursor.textContent = 'Ln ' + line + ', Col ' + col;
  }

  /* ---------- source input (initial) ---------- */
  source.addEventListener('input', function () {
    state.files[state.activeFile] = source.value;
  });

  function updateMathPreview() {
    var text = source.value;
    var hasMath = /\$/.test(text);
    previewStatus.textContent = hasMath ? 'Math detected (client-side preview only)' : 'Ready';
  }

  /* ---------- security: input validation ---------- */
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
      return { ok: false, message: 'Rate limit exceeded. Try again in ' + Math.ceil((state.rateLimitReset - now) / 1000) + ' seconds.' };
    }
    state.rateLimitRemaining--;
    return { ok: true };
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
    var start = Date.now();

    var dangers = validateSource(src);
    if (dangers.length > 0) {
      clearOutput();
      appendOutput('Security: blocked dangerous command(s): ' + dangers.join(', '), 'err');
      compilePanel.hidden = false;
      statusErrors.textContent = state.errors + ' errors';
      return;
    }

    var rateOk = checkRateLimit();
    if (!rateOk) {
      clearOutput();
      appendOutput(rateOk.message, 'err');
      compilePanel.hidden = false;
      state.compiling = false;
      btnCompile.removeAttribute('aria-busy');
      btnCompile.textContent = 'Compile';
      previewStatus.textContent = 'Rate limit exceeded';
      return;
    }

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
      var elapsed = ((Date.now() - start) / 1000).toFixed(1);
      statusCompile.textContent = 'Compiled in ' + elapsed + 's';
      if (data.ok && data.pdf) {
        var blob = b64toBlob(data.pdf, 'application/pdf');
        var url = URL.createObjectURL(blob);
        if (state.pdfBlobUrl) URL.revokeObjectURL(state.pdfBlobUrl);
        state.pdfBlobUrl = url;
        previewFrame.src = url;
        previewFrame.style.display = 'block';
        previewEmpty.hidden = true;
        previewControls.hidden = false;
        previewStatus.textContent = 'Compiled successfully';
        appendOutput('Compilation successful.', 'ok');
        btnDownload.disabled = false;
        state.errors = 0;
        state.warnings = 0;
      } else {
        appendOutput(data.error || 'Compilation failed.', 'err');
        previewStatus.textContent = 'Compilation failed';
        state.errors = 1;
      }
      statusErrors.textContent = state.errors + ' errors';
      statusWarnings.textContent = state.warnings + ' warnings';
    })
    .catch(function (err) {
      appendOutput('Error: ' + err.message, 'err');
      previewStatus.textContent = 'Compilation error';
      state.errors = 1;
      statusErrors.textContent = state.errors + ' errors';
    })
    .finally(function () {
      state.compiling = false;
      btnCompile.removeAttribute('aria-busy');
      btnCompile.textContent = 'Compile';
    });
  }

  btnCompile.addEventListener('click', compile);

  /* ---------- download ---------- */
  btnDownload.addEventListener('click', function () {
    if (!state.pdfBlobUrl) return;
    var a = document.createElement('a');
    a.href = state.pdfBlobUrl;
    a.download = state.activeFile.replace(/\\.tex$/i, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  btnDownload.disabled = true;

  /* ---------- preview zoom ---------- */
  btnZoomIn.addEventListener('click', function () {
    state.zoom = Math.min(state.zoom + 0.25, 2);
    previewFrame.style.zoom = state.zoom;
    pcZoom.textContent = Math.round(state.zoom * 100) + '%';
  });
  btnZoomOut.addEventListener('click', function () {
    state.zoom = Math.max(state.zoom - 0.25, 0.5);
    previewFrame.style.zoom = state.zoom;
    pcZoom.textContent = Math.round(state.zoom * 100) + '%';
  });

  /* ---------- init ---------- */
  renderTabs();
  renderFileList();
  renderGutter();
  setActiveFile('main.tex');
  updateMathPreview();
  updateCursor();

  /* Expose for debugging */
  window.gabetexEditor = { validateSource: validateSource, state: state };

})();