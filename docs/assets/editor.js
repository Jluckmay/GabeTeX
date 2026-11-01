/* ===== GabeTeX online LaTeX editor ===== */

(function () {
  'use strict';

  /* ---------- elements ---------- */
  var source = document.getElementById('editor-source');
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
  var addFileForm = document.getElementById('add-file-form');
  var newFileName = document.getElementById('new-file-name');
  var addFileError = document.getElementById('add-file-error');
  var btnCancelAddFile = document.getElementById('btn-cancel-add-file');
  var btnUploadFiles = document.getElementById('btn-upload-files');
  var fileUploadInput = document.getElementById('file-upload-input');
  var uploadDropZone = document.getElementById('upload-drop-zone');
  var uploadStatus = document.getElementById('upload-status');
  var btnHistory = document.getElementById('btn-history');
  var btnSplit = document.getElementById('btn-split');
  var btnViewMode = document.getElementById('btn-view-mode');
  var btnShare = document.getElementById('btn-share');
  var btnZoomIn = document.getElementById('btn-zoom-in');
  var btnZoomOut = document.getElementById('btn-zoom-out');
  var fileList = document.getElementById('file-list');
  var tabList = document.querySelector('.tab-list');
  var tabFiles = document.getElementById('tab-files');
  var tabOutline = document.getElementById('tab-outline');
  var sidebarFiles = document.getElementById('sidebar-files');
  var sidebarOutline = document.getElementById('sidebar-outline');
  var editorApp = document.getElementById('editor-app');
  var editorWindow = document.querySelector('.editor-window');
  var statusCompile = document.getElementById('status-compile');
  var statusErrors = document.getElementById('status-errors');
  var statusWarnings = document.getElementById('status-warnings');
  var statusEngine = document.getElementById('status-engine');
  var statusCursor = document.getElementById('status-cursor');
  var sourceStatus = document.getElementById('source-status');

  function translate(key, values) {
    var value = window.gabetexTranslate ? window.gabetexTranslate(key) : key;
    (values || []).forEach(function (replacement, index) {
      value = value.replace(new RegExp('%' + (index + 1), 'g'), replacement);
    });
    return value;
  }
  function updateOutline() {
    var expression = /\\(part|chapter|section|subsection|subsubsection|paragraph)\*?\s*\{([^}]*)\}/g;
    var matches = [];
    var match;
    while ((match = expression.exec(source.value))) {
      matches.push({ title: match[2].trim(), position: match.index });
    }
    sidebarOutline.innerHTML = '';
    if (!matches.length) {
      var empty = document.createElement('p');
      empty.className = 'outline-empty';
      empty.textContent = translate('editor.noOutline');
      sidebarOutline.appendChild(empty);
      return;
    }
    var list = document.createElement('ul');
    list.className = 'outline-list';
    matches.forEach(function (item) {
      var entry = document.createElement('li');
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'outline-item';
      button.textContent = item.title;
      button.title = item.title;
      button.addEventListener('click', function () {
        source.focus();
        source.setSelectionRange(item.position, item.position);
        updateCursor();
      });
      entry.appendChild(button);
      list.appendChild(entry);
    });
    sidebarOutline.appendChild(list);
  }

  /* ---------- state ---------- */
  var state = {
    files: { 'main.tex': '\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\begin{document}\nHello, world!\n\\end{document}\n' },
    openFiles: ['main.tex'],
    activeFile: 'main.tex',
    engine: 'pdflatex',
    compiling: false,
    lastCompile: 0,
    pdfBlobUrl: null,
    csrfToken: null,
    rateLimitRemaining: 10,
    rateLimitReset: 0,
    zoom: 1,
    errors: 0,
    warnings: 0,
    history: { 'main.tex': ['\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\begin{document}\nHello, world!\n\\end{document}\n'] },
    historyIndex: { 'main.tex': 0 },
    historyTimer: null,
    initialized: false,
    sourceStatusKey: 'editor.opened',
    sourceStatusArgs: ['main.tex'],
    uploadMessages: [],
    previewStatusKey: 'editor.idle',
    previewStatusArgs: []
  };
  state.engine = statusEngine.value;

  function setSourceStatus(key, values) {
    state.sourceStatusKey = key;
    state.sourceStatusArgs = values || [];
    sourceStatus.textContent = translate(key, state.sourceStatusArgs);
  }
  function setPreviewStatus(key, values) {
    state.previewStatusKey = key;
    state.previewStatusArgs = values || [];
    var message = translate(key, state.previewStatusArgs);
    previewStatus.textContent = message;
    previewStatus.title = message;
  }
  function setUploadStatus(messages) {
    state.uploadMessages = messages;
    uploadStatus.textContent = messages.map(function (item) {
      return translate(item.key, item.values);
    }).join(' ');
    uploadStatus.hidden = messages.length === 0;
  }
  function updateCompileStatus() {
    statusCompile.textContent = translate('editor.compileDuration', [state.lastCompile]);
  }
  function updateErrorStatus() {
    var key = state.errors === 1 ? 'editor.errorsOne' : 'editor.errorsMany';
    statusErrors.textContent = translate(key, [state.errors]);
  }
  function updateWarningStatus() {
    var key = state.warnings === 1 ? 'editor.warningsOne' : 'editor.warningsMany';
    statusWarnings.textContent = translate(key, [state.warnings]);
  }
  function updateCompileButton() {
    var label = translate(state.compiling ? 'editor.compiling' : 'editor.compile');
    btnCompile.setAttribute('aria-label', label);
    btnCompile.title = label;
    if (state.compiling) btnCompile.setAttribute('aria-busy', 'true');
    else btnCompile.removeAttribute('aria-busy');
  }
  function updateHistoryButton() {
    btnHistory.disabled = (state.historyIndex[state.activeFile] || 0) <= 0;
  }
  function updateTranslatedUI() {
    source.setAttribute('aria-label', translate('editor.sourceLabel', [state.activeFile]));
    updateCompileButton();
    updateCompileStatus();
    updateErrorStatus();
    updateWarningStatus();
    setPreviewStatus(state.previewStatusKey, state.previewStatusArgs);
    setSourceStatus(state.sourceStatusKey, state.sourceStatusArgs);
    setUploadStatus(state.uploadMessages);
    statusEngine.setAttribute('aria-label', translate('editor.compiler'));
    renderTabs();
    renderFileList();
    updateCursor();
    updateHistoryButton();
  }
  document.addEventListener('gabetex:languagechange', updateTranslatedUI);

  function commitHistorySnapshot() {
    var history = state.history[state.activeFile] || [];
    var index = state.historyIndex[state.activeFile] || 0;
    if (history[index] === source.value) return;
    history = history.slice(0, index + 1);
    history.push(source.value);
    if (history.length > 50) history.shift();
    state.history[state.activeFile] = history;
    state.historyIndex[state.activeFile] = history.length - 1;
    updateHistoryButton();
  }
  function scheduleHistorySnapshot() {
    clearTimeout(state.historyTimer);
    state.historyTimer = setTimeout(commitHistorySnapshot, 500);
  }
  function undoEdit() {
    clearTimeout(state.historyTimer);
    commitHistorySnapshot();
    var index = state.historyIndex[state.activeFile] || 0;
    if (index <= 0) return;
    index--;
    state.historyIndex[state.activeFile] = index;
    source.value = state.history[state.activeFile][index];
    state.files[state.activeFile] = source.value;
    renderGutter();
    updateOutline();
    updateCursor();
    updateMathPreview();
    setSourceStatus('editor.historyRestored');
    updateHistoryButton();
  }
  function setSidebarTab(tab) {
    var showFiles = tab === 'files';
    tabFiles.classList.toggle('active', showFiles);
    tabOutline.classList.toggle('active', !showFiles);
    tabFiles.setAttribute('aria-selected', showFiles ? 'true' : 'false');
    tabOutline.setAttribute('aria-selected', showFiles ? 'false' : 'true');
    tabFiles.tabIndex = showFiles ? 0 : -1;
    tabOutline.tabIndex = showFiles ? -1 : 0;
    sidebarFiles.hidden = !showFiles;
    sidebarOutline.hidden = showFiles;
    sidebarFiles.classList.toggle('hidden', !showFiles);
    sidebarOutline.classList.toggle('hidden', showFiles);
  }

  /* ---------- file tabs ---------- */
  function renderTabs() {
    tabList.innerHTML = '';
    state.openFiles.forEach(function (name, index) {
      var group = document.createElement('div');
      group.className = 'etab-group';
      group.setAttribute('role', 'presentation');
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'etab' + (name === state.activeFile ? ' active' : '');
      tab.id = 'editor-file-tab-' + index;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', name === state.activeFile ? 'true' : 'false');
      tab.setAttribute('aria-controls', 'editor-code-wrap');
      tab.tabIndex = name === state.activeFile ? 0 : -1;
      tab.setAttribute('data-file', name);
      tab.textContent = name;
      tab.addEventListener('click', function () {
        setActiveFile(name);
        tabList.querySelector('[aria-selected="true"]').focus();
      });
      var close = document.createElement('button');
      close.type = 'button';
      close.className = 'etab-close';
      close.setAttribute('aria-label', translate('editor.closeFileTab', [name]));
      close.title = translate('editor.closeFileTab', [name]);
      close.textContent = '×';
      close.addEventListener('click', function () {
        closeFile(name);
        var activeTab = tabList.querySelector('[aria-selected="true"]');
        if (activeTab) activeTab.focus();
      });
      group.appendChild(tab);
      group.appendChild(close);
      tabList.appendChild(group);
    });
    var activeTab = tabList.querySelector('[aria-selected="true"]');
    if (activeTab) document.getElementById('editor-code-wrap').setAttribute('aria-labelledby', activeTab.id);
  }
  tabList.addEventListener('keydown', function (event) {
    if (event.target.getAttribute('role') !== 'tab') return;
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]'));
    var index = tabs.indexOf(event.target);
    var nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    var nextName = tabs[nextIndex].getAttribute('data-file');
    setActiveFile(nextName);
    tabList.querySelector('[aria-selected="true"]').focus();
  });
  function setActiveFile(name) {
    if (!Object.prototype.hasOwnProperty.call(state.files, name)) return;
    clearTimeout(state.historyTimer);
    if (state.initialized && Object.prototype.hasOwnProperty.call(state.files, state.activeFile)) {
      commitHistorySnapshot();
    }
    if (state.openFiles.indexOf(name) === -1) state.openFiles.push(name);
    state.activeFile = name;
    state.initialized = true;
    source.value = state.files[name];
    if (!state.history[name]) state.history[name] = [source.value];
    if (typeof state.historyIndex[name] !== 'number') state.historyIndex[name] = state.history[name].length - 1;
    source.setAttribute('aria-label', translate('editor.sourceLabel', [name]));
    renderTabs();
    renderFileList();
    renderGutter();
    setSourceStatus('editor.opened', [name]);
    updateCursor();
    updateHistoryButton();
  }
  function closeFile(name) {
    var index = state.openFiles.indexOf(name);
    if (index === -1) return;
    if (state.openFiles.length === 1 && Object.keys(state.files).length === 1) {
      window.alert(translate('editor.lastFile'));
      return;
    }
    if (name === state.activeFile) {
      clearTimeout(state.historyTimer);
      commitHistorySnapshot();
    }
    state.openFiles.splice(index, 1);
    if (name === state.activeFile) {
      var nextFile = state.openFiles.length
        ? state.openFiles[Math.min(index, state.openFiles.length - 1)]
        : Object.keys(state.files).filter(function (file) { return file !== name; })[0];
      setActiveFile(nextFile);
    } else {
      renderTabs();
    }
  }
  function deleteFile(name) {
    if (!Object.prototype.hasOwnProperty.call(state.files, name)) return;
    if (Object.keys(state.files).length === 1) {
      window.alert(translate('editor.lastFile'));
      return;
    }
    if (!window.confirm(translate('editor.confirmDeleteFile', [name]))) return;
    var wasActive = name === state.activeFile;
    var openIndex = state.openFiles.indexOf(name);
    if (wasActive) {
      clearTimeout(state.historyTimer);
      commitHistorySnapshot();
    }
    delete state.files[name];
    delete state.history[name];
    delete state.historyIndex[name];
    if (openIndex !== -1) state.openFiles.splice(openIndex, 1);
    renderTabs();
    renderFileList();
    if (wasActive) {
      if (state.openFiles.length) setActiveFile(state.openFiles[Math.min(openIndex, state.openFiles.length - 1)]);
      else setActiveFile(Object.keys(state.files)[0]);
    }
  }

  /* ---------- file tree ---------- */
  function renderFileList() {
    fileList.innerHTML = '';
    Object.keys(state.files).forEach(function (name) {
      var li = document.createElement('li');
      li.className = 'ft-item ft-file' + (name === state.activeFile ? ' active' : '');
      var open = document.createElement('button');
      open.type = 'button';
      open.className = 'ft-open';
      open.setAttribute('aria-current', name === state.activeFile ? 'page' : 'false');
      open.textContent = name;
      open.addEventListener('click', function () { setActiveFile(name); });
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'ft-delete';
      remove.setAttribute('aria-label', translate('editor.deleteFile', [name]));
      remove.title = translate('editor.deleteFile', [name]);
      remove.textContent = '×';
      remove.addEventListener('click', function () { deleteFile(name); });
      li.appendChild(open);
      li.appendChild(remove);
      fileList.appendChild(li);
    });
  }

  btnAddFile.addEventListener('click', function () {
    addFileForm.hidden = false;
    addFileError.hidden = true;
    newFileName.focus();
  });
  btnCancelAddFile.addEventListener('click', function () {
    addFileForm.reset();
    addFileForm.hidden = true;
    addFileError.hidden = true;
    btnAddFile.focus();
  });
  addFileForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = newFileName.value.trim();
    if (!name || /[\\/:*?"<>|]/.test(name) || name === '.' || name === '..') {
      addFileError.textContent = translate('editor.invalidFileName');
      addFileError.hidden = false;
      newFileName.focus();
      return;
    }
    if (/\.tex$/i.test(name) === false) name += '.tex';
    if (state.files[name]) {
      addFileError.textContent = translate('editor.fileExists');
      addFileError.hidden = false;
      newFileName.focus();
      return;
    }
    state.files[name] = '\\documentclass{article}\n\\begin{document}\n\\end{document}\n';
    state.history[name] = [state.files[name]];
    state.historyIndex[name] = 0;
    addFileForm.reset();
    addFileForm.hidden = true;
    addFileError.hidden = true;
    renderTabs();
    renderFileList();
    setActiveFile(name);
  });
  newFileName.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') btnCancelAddFile.click();
  });
  function readTexFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        if (typeof reader.result !== 'string' || reader.result.indexOf('\0') !== -1) {
          reject(new Error('Invalid text file'));
          return;
        }
        resolve(reader.result);
      };
      reader.onerror = function () { reject(reader.error || new Error('File read failed')); };
      reader.readAsText(file);
    });
  }
  function importTexFiles(fileList) {
    var filesToRead = Array.prototype.slice.call(fileList);
    var imported = [];
    var errors = [];
    var pendingNames = Object.create(null);
    var pending = filesToRead.map(function (file) {
      if (!/\.tex$/i.test(file.name)) {
        errors.push({ key: 'editor.uploadInvalidType' });
        return Promise.resolve(null);
      }
      if (/[\\/:*?"<>|]/.test(file.name) || file.name === '.' || file.name === '..') {
        errors.push({ key: 'editor.invalidFileName' });
        return Promise.resolve(null);
      }
      if (file.size > 100 * 1024) {
        errors.push({ key: 'editor.uploadTooLarge', values: [file.name] });
        return Promise.resolve(null);
      }
      if (Object.prototype.hasOwnProperty.call(state.files, file.name) || pendingNames[file.name]) {
        errors.push({ key: 'editor.uploadDuplicate', values: [file.name] });
        return Promise.resolve(null);
      }
      pendingNames[file.name] = true;
      return readTexFile(file).then(function (content) {
        return { name: file.name, content: content };
      }).catch(function () {
        errors.push({ key: 'editor.uploadReadFailed', values: [file.name] });
        return null;
      });
    });
    Promise.all(pending).then(function (results) {
      results.forEach(function (item) {
        if (!item) return;
        state.files[item.name] = item.content;
        state.history[item.name] = [item.content];
        state.historyIndex[item.name] = 0;
        if (state.openFiles.indexOf(item.name) === -1) state.openFiles.push(item.name);
        imported.push(item.name);
      });
      renderTabs();
      renderFileList();
      if (imported.length) {
        setActiveFile(imported[0]);
        errors.unshift({ key: 'editor.uploadSuccess', values: [imported.length] });
      }
      setUploadStatus(errors);
    });
  }
  btnUploadFiles.addEventListener('click', function () { fileUploadInput.click(); });
  fileUploadInput.addEventListener('change', function () {
    importTexFiles(fileUploadInput.files);
    fileUploadInput.value = '';
  });
  ['dragenter', 'dragover'].forEach(function (eventName) {
    editorApp.addEventListener(eventName, function (event) {
      if (!event.dataTransfer || !Array.prototype.some.call(event.dataTransfer.types, function (type) { return type === 'Files'; })) return;
      event.preventDefault();
      uploadDropZone.classList.add('is-dragover');
    });
  });
  editorApp.addEventListener('dragleave', function (event) {
    if (event.relatedTarget && editorApp.contains(event.relatedTarget)) return;
    uploadDropZone.classList.remove('is-dragover');
  });
  editorApp.addEventListener('drop', function (event) {
    if (!event.dataTransfer || !event.dataTransfer.files.length) return;
    event.preventDefault();
    uploadDropZone.classList.remove('is-dragover');
    importTexFiles(event.dataTransfer.files);
  });
  statusEngine.addEventListener('change', function () {
    state.engine = statusEngine.value;
  });

  /* ---------- gutter / line numbers ---------- */
  function renderGutter() {
    var lines = source.value.split('\n');
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
    scheduleHistorySnapshot();
    updateOutline();
    clearTimeout(source._mathTimer);
    source._mathTimer = setTimeout(updateMathPreview, 300);
  });
  source.addEventListener('keyup', updateCursor);
  source.addEventListener('click', updateCursor);

  function updateCursor() {
    var val = source.value.substring(0, source.selectionStart);
    var lines = val.split('\n');
    var line = lines.length;
    var col = lines[lines.length - 1].length + 1;
    statusCursor.textContent = translate('editor.cursor', [line, col]);
  }

  function updateMathPreview() {
    var text = source.value;
    var hasMath = /\$/.test(text);
    setPreviewStatus(hasMath ? 'editor.mathDetected' : 'editor.ready');
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
      return { ok: false, seconds: Math.ceil((state.rateLimitReset - now) / 1000) };
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
  function b64toBlob(base64, contentType) {
    var binary = window.atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: contentType });
  }

  function compile() {
    if (state.compiling) return;
    var src = state.files[state.activeFile];
    var start = Date.now();

    var dangers = validateSource(src);
    if (dangers.length > 0) {
      clearOutput();
      appendOutput(translate('editor.securityBlocked', [dangers.join(', ')]), 'err');
      compilePanel.hidden = false;
      state.errors = 1;
      updateErrorStatus();
      return;
    }

    var rateOk = checkRateLimit();
    if (!rateOk) {
      clearOutput();
      appendOutput(translate('editor.rateLimitWait', [rateOk.seconds]), 'err');
      compilePanel.hidden = false;
      state.compiling = false;
      updateCompileButton();
      state.errors = 1;
      updateErrorStatus();
      setPreviewStatus('editor.rateLimit');
      return;
    }

    state.compiling = true;
    updateCompileButton();
    setPreviewStatus('editor.compiling');
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
          engine: state.engine
        })
      });
    })
    .then(function (res) {
      if (res.status === 429) throw new Error(translate('editor.rateLimit'));
      if (!res.ok) throw new Error(translate('editor.httpError', [res.status]));
      return res.json();
    })
    .then(function (data) {
      var elapsed = ((Date.now() - start) / 1000).toFixed(1);
      state.lastCompile = elapsed;
      updateCompileStatus();
      if (data.ok && data.pdf) {
        var blob = b64toBlob(data.pdf, 'application/pdf');
        var url = URL.createObjectURL(blob);
        if (state.pdfBlobUrl) URL.revokeObjectURL(state.pdfBlobUrl);
        state.pdfBlobUrl = url;
        previewFrame.src = url;
        previewFrame.style.display = 'block';
        previewEmpty.hidden = true;
        previewControls.hidden = false;
        setPreviewStatus('editor.compiledSuccess');
        appendOutput(translate('editor.compilationSuccess'), 'ok');
        btnDownload.disabled = false;
        state.errors = 0;
        state.warnings = 0;
      } else {
        appendOutput(data.error || 'Compilation failed.', 'err');
        previewEmpty.hidden = false;
        setPreviewStatus('editor.compileFailed');
        state.errors = 1;
      }
      updateErrorStatus();
      updateWarningStatus();
    })
    .catch(function (err) {
      appendOutput(translate('editor.compileErrorDetail', [err.message]), 'err');
      previewEmpty.hidden = false;
      setPreviewStatus('editor.compileError');
      state.errors = 1;
      updateErrorStatus();
    })
    .finally(function () {
      state.compiling = false;
      updateCompileButton();
    });
  }

  btnCompile.addEventListener('click', compile);
  btnHistory.addEventListener('click', undoEdit);
  tabFiles.addEventListener('click', function () { setSidebarTab('files'); });
  tabOutline.addEventListener('click', function () {
    updateOutline();
    setSidebarTab('outline');
  });
  tabFiles.parentNode.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    var nextTab = event.key === 'Home' || event.key === 'ArrowLeft' ? tabFiles : tabOutline;
    if (event.key === 'End' || event.key === 'ArrowRight') nextTab = tabOutline;
    nextTab.focus();
    nextTab.click();
  });
  btnSplit.addEventListener('click', function () {
    var split = editorWindow.classList.toggle('is-split-view');
    btnSplit.setAttribute('aria-pressed', split ? 'true' : 'false');
  });
  btnViewMode.addEventListener('click', function () {
    var focused = editorApp.classList.toggle('preview-focus');
    btnViewMode.setAttribute('aria-pressed', focused ? 'true' : 'false');
  });
  btnShare.addEventListener('click', function () {
    var shareData = { title: 'GabeTeX', text: source.value };
    if (navigator.share) {
      navigator.share(shareData).then(function () {
        setSourceStatus('editor.shared');
      }).catch(function (error) {
        if (error.name !== 'AbortError') setSourceStatus('editor.shareFailed');
      });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(source.value).then(function () {
        setSourceStatus('editor.sourceCopied');
      }).catch(function () {
        setSourceStatus('editor.shareFailed');
      });
      return;
    }
    var temporary = document.createElement('textarea');
    temporary.value = source.value;
    temporary.setAttribute('readonly', '');
    temporary.style.position = 'fixed';
    temporary.style.opacity = '0';
    document.body.appendChild(temporary);
    temporary.select();
    var copied = document.execCommand('copy');
    document.body.removeChild(temporary);
    setSourceStatus(copied ? 'editor.sourceCopied' : 'editor.shareFailed');
  });
  source.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      if ((state.historyIndex[state.activeFile] || 0) > 0) {
        event.preventDefault();
        undoEdit();
      }
    }
  });

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
  updateCompileButton();
  updateOutline();
  updateMathPreview();
  updateCursor();
  updateCompileStatus();
  updateErrorStatus();
  updateWarningStatus();

  /* Expose for debugging */
  window.gabetexEditor = { validateSource: validateSource, state: state };

})();