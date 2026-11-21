/* ===== GabeTeX online LaTeX editor ===== */

(function () {
  'use strict';

  /* ---------- elements ---------- */
  var editorScriptUrl = document.currentScript ? document.currentScript.src : new URL('assets/editor.js', window.location.href).href;
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
  var btnZoomIn = document.getElementById('btn-zoom-in');
  var btnZoomOut = document.getElementById('btn-zoom-out');
  var btnPagePrev = document.getElementById('btn-page-prev');
  var btnPageNext = document.getElementById('btn-page-next');
  var btnToolbarDownload = document.getElementById('btn-toolbar-download');
  var btnAutoCompile = document.getElementById('btn-autocompile');
  var btnToolbarPresent = document.getElementById('btn-toolbar-present');
  var btnToolbarIssues = document.getElementById('btn-toolbar-issues');
  var btnCloseCompile = document.getElementById('btn-close-compile');
  var btnSidebar = document.getElementById('btn-sidebar');
  var btnSymbols = document.getElementById('btn-symbols');
  var tbSidebarSlot = document.getElementById('tb-sidebar-slot');
  var sidebarHead = document.querySelector('.sidebar-head');
  var editorDocTitle = document.getElementById('editor-doc-title');
  var statusCompileCapsule = document.querySelector('.status-compile-capsule');
  var fileList = document.getElementById('file-list');

  function fileIconSvg(name) {
    var dot = name.lastIndexOf('.');
    var ext = dot !== -1 ? name.slice(dot + 1).toLowerCase() : '';
    if (ext === 'bib') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5h3v15H4zM8.5 4.5h3v15h-3zM13.3 5.6l2.9-.8 3.9 14.6-2.9.8z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (ext === 'sty' || ext === 'cls') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h3.2a1.8 1.8 0 1 1 3.6 0H15v3.2a1.8 1.8 0 1 1 0 3.6V18H11.8a1.8 1.8 0 1 0-3.6 0H5v-3.2a1.8 1.8 0 1 0 0-3.6Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'pdf' || ext === 'eps' || ext === 'svg') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5h15a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 16l4.6-4.6 3.4 3.4 2.6-2.6 6.4 6.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15.5" cy="9" r="1.5" fill="currentColor"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 2.8h7.8l4.2 4.2v12.5a1.7 1.7 0 0 1-1.7 1.7H6.5a1.7 1.7 0 0 1-1.7-1.7V4.5a1.7 1.7 0 0 1 1.7-1.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 3v4.3h4.3M8.3 11.5h7.4M8.3 14.5h7.4M8.3 17.5h4.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function mainStarSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6c.3 0 .6.2.7.5l2.4 5 5.4.8c.7.1 1 .9.5 1.4l-3.9 3.8.9 5.4c.1.7-.6 1.2-1.2.9L12 17.8l-4.8 2.6c-.6.3-1.3-.2-1.2-.9l.9-5.4-3.9-3.8c-.5-.5-.2-1.3.5-1.4l5.4-.8 2.4-5c.1-.3.4-.5.7-.5Z" fill="currentColor"/></svg>';
  }
  function setDownloadDisabled(disabled) {
    btnDownload.disabled = disabled;
    if (btnToolbarDownload) btnToolbarDownload.disabled = disabled;
  }
  var tabList = document.querySelector('.tab-list');
  var tabFiles = document.getElementById('tab-files');
  var tabOutline = document.getElementById('tab-outline');
  var sidebarFiles = document.getElementById('sidebar-files');
  var sidebarOutline = document.getElementById('sidebar-outline');
  var sidebarSymbols = document.getElementById('sidebar-symbols');
  var symSearch = document.getElementById('sym-search');
  var symSearchClear = document.getElementById('sym-search-clear');
  var symList = document.getElementById('sym-list');
  var symPreviewGlyph = document.getElementById('sym-preview-glyph');
  var symPreviewCode = document.getElementById('sym-preview-code');
  var symPreviewPkg = document.getElementById('sym-preview-pkg');
  var symPreviewName = document.getElementById('sym-preview-name');
  var editorCodeWrap = document.getElementById('editor-code-wrap');
  var editorDropCaret = document.getElementById('editor-drop-caret');
  var editorApp = document.getElementById('editor-app');
  var editorWindow = document.querySelector('.editor-window');
  var statusCompile = document.getElementById('status-compile');
  var statusErrors = document.getElementById('status-errors');
  var statusWarnings = document.getElementById('status-warnings');
  var statusCursor = document.getElementById('status-cursor');
  var sourceStatus = document.getElementById('source-status');

  function translate(key, values) {
    var value = window.gabetexTranslate ? window.gabetexTranslate(key) : key;
    var list = values || [];
    return String(value).replace(/%(\d+)/g, function (match, digits) {
      var idx = parseInt(digits, 10) - 1;
      return idx >= 0 && idx < list.length ? String(list[idx]) : match;
    });
  }
  function updateOutline() {
    var expression = /\\(part|chapter|section|subsection|subsubsection|paragraph|frame|frametitle)\*?\s*\{([^}]*)\}|\\begin\s*\{frame\}\s*\{([^}]*)\}|\\begin\s*\{frame\}/g;
    var matches = [];
    var match;
    while ((match = expression.exec(source.value))) {
      var title, position;
      if (match[1]) {
        title = match[2].trim();
        position = match.index;
      } else if (match[3]) {
        title = match[3].trim();
        position = match.index;
      } else if (/^\\begin\s*\{frame\}/.test(match[0])) {
        title = 'Frame';
        position = match.index;
      } else {
        continue;
      }
      matches.push({ title: title, position: position });
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

  /* ---------- beamer & root detection ---------- */
  function hasDocumentClass(sourceText) {
    return typeof sourceText === 'string' && /^((?:[^%\r\n]|\\.)*?)\\documentclass\b/m.test(sourceText);
  }

  function isBeamerSource(sourceText) {
    return typeof sourceText === 'string' && /^((?:[^%\r\n]|\\.)*?)\\documentclass\s*(\[[^\]]*\])?\s*\{beamer\}/m.test(sourceText);
  }

  function resolveMainFile() {
    var keys = Object.keys(state.files);
    if (!keys.length) return 'main.tex';
    var active = state.activeFile;
    var activeText = state.files[active] || '';
    var magic = activeText.match(/^\s*%\s*!\s*TEX\s+root\s*=\s*([^\r\n]+)/im);
    if (magic && magic[1]) {
      var target = magic[1].trim().replace(/^(\.\/|\.\.\/)+/, '');
      if (Object.prototype.hasOwnProperty.call(state.files, target)) return target;
    }
    var activeStem = active ? active.replace(/\.tex$/i, '') : '';
    if (activeStem && active !== 'main.tex') {
      for (var i = 0; i < keys.length; i++) {
        var candidate = keys[i];
        if (candidate === active) continue;
        var text = state.files[candidate] || '';
        if (!hasDocumentClass(text)) continue;
        var escapedFull = active.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var escapedStem = activeStem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var incRe = new RegExp('\\\\(?:input|include|subfile)\\s*\\{\\s*(?:\\.\\/)?(?:' + escapedFull + '|' + escapedStem + ')\\s*\\}');
        if (incRe.test(text)) return candidate;
      }
    }
    if (active && hasDocumentClass(activeText)) return active;
    if (Object.prototype.hasOwnProperty.call(state.files, 'main.tex') && hasDocumentClass(state.files['main.tex'])) {
      return 'main.tex';
    }
    for (var j = 0; j < keys.length; j++) {
      if (hasDocumentClass(state.files[keys[j]])) return keys[j];
    }
    return Object.prototype.hasOwnProperty.call(state.files, 'main.tex') ? 'main.tex' : (active || keys[0]);
  }

  function updatePresentationButtonVisibility() {
    var rootName = resolveMainFile();
    var rootSource = (rootName && state.files[rootName]) || source.value;
    var beamer = isBeamerSource(rootSource);
    btnToolbarPresent.hidden = !beamer;
    if (!beamer && btnToolbarPresent.getAttribute('aria-pressed') === 'true') {
      exitPresentationMode();
    }
  }

  /* ---------- state ---------- */
  var state = {
    files: { 'main.tex': '\\documentclass{article}\n\\begin{document}\nHello, world!\n\\end{document}\n' },
    openFiles: ['main.tex'],
    activeFile: 'main.tex',
    compiling: false,
    pendingCompile: false,
    lastCompile: 0,
    pdfBlobUrl: null,
    pdfLoadingTask: null,
    pageObserver: null,
    zoom: 1,
    errors: 0,
    warnings: 0,
    history: { 'main.tex': ['\\documentclass{article}\n\\begin{document}\nHello, world!\n\\end{document}\n'] },
    historyIndex: { 'main.tex': 0 },
    historyTimer: null,
    initialized: false,
    sourceStatusKey: 'editor.opened',
    sourceStatusArgs: ['main.tex'],
    uploadMessages: [],
    previewStatusKey: 'editor.idle',
    previewStatusArgs: [],
    autoCompile: true,
    presentationSlide: 1,
  };
  var compileWorker = null;
  var compileRequestId = 0;
  var pdfJsPromise = null;

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
    statusErrors.classList.toggle('has-errors', state.errors > 0);
    if (statusErrors.parentElement) statusErrors.parentElement.classList.toggle('has-errors', state.errors > 0);
  }
  function updateWarningStatus() {
    var key = state.warnings === 1 ? 'editor.warningsOne' : 'editor.warningsMany';
    statusWarnings.textContent = translate(key, [state.warnings]);
    statusWarnings.classList.toggle('has-warnings', state.warnings > 0);
    if (statusWarnings.parentElement) statusWarnings.parentElement.classList.toggle('has-warnings', state.warnings > 0);
  }
  function setCompilePanelVisible(visible) {
    compilePanel.hidden = !visible;
    var exp = visible ? 'true' : 'false';
    statusErrors.setAttribute('aria-expanded', exp);
    statusWarnings.setAttribute('aria-expanded', exp);
    if (btnToolbarIssues) {
      btnToolbarIssues.setAttribute('aria-expanded', exp);
      btnToolbarIssues.classList.toggle('tb-active', visible);
    }
  }
  function showCompileOutput() {
    var isHidden = compilePanel.hidden;
    setCompilePanelVisible(isHidden);
    if (isHidden) {
      compileOutput.focus({ preventScroll: true });
    }
  }
  function updateCompileButton() {
    var label = translate(state.compiling ? 'editor.compiling' : 'editor.compile');
    btnCompile.setAttribute('aria-label', label);
    btnCompile.title = label;
    btnCompile.classList.toggle('busy', !!state.compiling);
    if (state.compiling) {
      btnCompile.setAttribute('aria-busy', 'true');
      if (statusCompileCapsule) statusCompileCapsule.setAttribute('data-state', 'compiling');
    } else {
      btnCompile.removeAttribute('aria-busy');
    }
  }
  function updateHistoryButton() {
    btnHistory.disabled = (state.historyIndex[state.activeFile] || 0) <= 0;
  }
  function updateTranslatedUI() {
    source.setAttribute('aria-label', translate('editor.sourceLabel', [state.activeFile]));
    if (editorDocTitle) editorDocTitle.textContent = state.activeFile;
    updateCompileButton();
    updateCompileStatus();
    updateErrorStatus();
    updateWarningStatus();
    setPreviewStatus(state.previewStatusKey, state.previewStatusArgs);
    setSourceStatus(state.sourceStatusKey, state.sourceStatusArgs);
    setUploadStatus(state.uploadMessages);
    renderTabs();
    renderFileList();
    updateOutline();
    updateCursor();
    updateHistoryButton();
    if (symbolsBuilt) renderMathSymbols();
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
    autoCloserOffsets = [];
    lastTrackedValue = source.value;
    renderGutter();
    updateOutline();
    updateCursor();
    updateMathPreview();
    setSourceStatus('editor.historyRestored');
    updateHistoryButton();
  }
  var lastSidebarTab = 'files';
  var symbolsBuilt = false;
  var collapsedSymbolCats = {};
  function setSidebarTab(tab) {
    var showFiles = tab === 'files';
    var showOutline = tab === 'outline';
    var showSymbols = tab === 'symbols';
    if (!showSymbols) lastSidebarTab = showOutline ? 'outline' : 'files';
    tabFiles.classList.toggle('active', showFiles);
    tabOutline.classList.toggle('active', showOutline);
    if (tabFiles.parentNode) {
      tabFiles.parentNode.setAttribute('data-index', showOutline ? '1' : '0');
      tabFiles.parentNode.setAttribute('data-inactive', showSymbols ? 'true' : 'false');
    }
    tabFiles.setAttribute('aria-selected', showFiles ? 'true' : 'false');
    tabOutline.setAttribute('aria-selected', showOutline ? 'true' : 'false');
    tabFiles.tabIndex = showFiles ? 0 : -1;
    tabOutline.tabIndex = showOutline ? 0 : -1;
    if (btnSymbols) {
      btnSymbols.classList.toggle('active', showSymbols);
      btnSymbols.setAttribute('aria-pressed', showSymbols ? 'true' : 'false');
    }
    sidebarFiles.hidden = !showFiles;
    sidebarOutline.hidden = !showOutline;
    if (sidebarSymbols) sidebarSymbols.hidden = !showSymbols;
    sidebarFiles.classList.toggle('hidden', !showFiles);
    sidebarOutline.classList.toggle('hidden', !showOutline);
    if (sidebarSymbols) sidebarSymbols.classList.toggle('hidden', !showSymbols);
    if (showOutline) updateOutline();
    if (showSymbols && !symbolsBuilt) renderMathSymbols();
  }

  /* ---------- file tabs ---------- */
  function renderTabs() {
    tabList.innerHTML = '';
    state.openFiles.forEach(function (name, index) {
      var group = document.createElement('div');
      group.className = 'etab-group' + (name === state.activeFile ? ' active' : '');
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
        var fileIcon = document.createElement('span');
        fileIcon.className = 'etab-file-icon';
        fileIcon.innerHTML = fileIconSvg(name);
        var nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        tab.appendChild(fileIcon);
        tab.appendChild(nameSpan);
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
    updatePresentationButtonVisibility();
    if (!state.history[name]) state.history[name] = [source.value];
    if (typeof state.historyIndex[name] !== 'number') state.historyIndex[name] = state.history[name].length - 1;
    source.setAttribute('aria-label', translate('editor.sourceLabel', [name]));
    if (editorDocTitle) editorDocTitle.textContent = name;
    renderTabs();
    renderFileList();
    renderGutter();
    updateOutline();
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
    if (compileWorker) {
      compileWorker.terminate();
      compileWorker = null;
    }
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
    var keys = Object.keys(state.files);
    var mainFile = resolveMainFile();
    keys.forEach(function (name) {
      var li = document.createElement('li');
      li.className = 'ft-item ft-file' + (name === state.activeFile ? ' active' : '');
        var star = document.createElement('span');
        star.className = 'ft-star';
        star.innerHTML = fileIconSvg(name);
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
        li.appendChild(star);
        li.appendChild(open);
        if (name === mainFile) {
          var mainStar = document.createElement('span');
          mainStar.className = 'ft-main-star';
          mainStar.setAttribute('aria-hidden', 'true');
          mainStar.innerHTML = mainStarSvg();
          li.appendChild(mainStar);
        }
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
  var VALID_FILE_NAME = /^(?![.\s])[^\\/:*?"<>|\x00-\x1f\x7f\u202a-\u202e]{1,120}$/;

  addFileForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = newFileName.value.trim();
    if (!name || !VALID_FILE_NAME.test(name) || name === '.' || name === '..') {
      addFileError.textContent = translate('editor.invalidFileName');
      addFileError.hidden = false;
      newFileName.focus();
      return;
    }
    if (!/\.(tex|bib|sty|cls)$/i.test(name)) name += '.tex';
    if (Object.prototype.hasOwnProperty.call(state.files, name)) {
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
    var filesToRead = Array.prototype.slice.call(fileList, 0, 50);
    var imported = [];
    var errors = [];
    var pendingNames = Object.create(null);
    var totalBytes = 0;
    var pending = filesToRead.map(function (file) {
      if (!/\.(tex|bib|sty|cls)$/i.test(file.name)) {
        errors.push({ key: 'editor.uploadInvalidType' });
        return Promise.resolve(null);
      }
      if (!VALID_FILE_NAME.test(file.name) || file.name === '.' || file.name === '..') {
        errors.push({ key: 'editor.invalidFileName' });
        return Promise.resolve(null);
      }
      totalBytes += file.size || 0;
      if (file.size > 100 * 1024 || totalBytes > 2 * 1024 * 1024) {
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
    updatePresentationButtonVisibility();
    clearTimeout(source._mathTimer);
    source._mathTimer = setTimeout(updateMathPreview, 300);
    if (state.autoCompile) {
      clearTimeout(source._autoCompileTimer);
      source._autoCompileTimer = setTimeout(function () {
        compile().catch(function (err) {
          console.error('Auto-compile failed:', err);
        });
      }, 1000);
    }
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

  /* ---------- compile ---------- */
  function appendOutput(text, cls) {
    var line = document.createElement('div');
    line.textContent = text;
    if (cls) line.className = cls;
    compileOutput.appendChild(line);
    compileOutput.scrollTop = compileOutput.scrollHeight;
  }
  function clearOutput() { compileOutput.innerHTML = ''; }

  function getPdfJs() {
    if (!pdfJsPromise) {
      pdfJsPromise = import('https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.mjs')
        .then(function (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.worker.mjs';
          return pdfjs;
        })
        .catch(function (error) {
          pdfJsPromise = null;
          throw error;
        });
    }
    return pdfJsPromise;
  }

  var compileWorkerBlobUrl = null;

  function getCompileWorker() {
    if (compileWorker) return Promise.resolve(compileWorker);
    var workerUrl = new URL('tectonic-worker.js', editorScriptUrl).href;
    return fetch(workerUrl)
      .then(function (response) {
        if (!response.ok) throw new Error('Could not load worker: HTTP ' + response.status);
        return response.text();
      })
      .then(function (sourceText) {
        if (compileWorkerBlobUrl) URL.revokeObjectURL(compileWorkerBlobUrl);
        compileWorkerBlobUrl = URL.createObjectURL(new Blob([sourceText], { type: 'application/javascript' }));
        var worker = new Worker(compileWorkerBlobUrl);
        compileWorker = worker;
        worker.addEventListener('error', function () {
          worker.terminate();
          if (compileWorker === worker) compileWorker = null;
        });
        return worker;
      });
  }

  function compileWithTectonic(files, mainFile) {
    return new Promise(function (resolve, reject) {
      getCompileWorker().then(function (worker) {
        var requestId = ++compileRequestId;
        var timeout = window.setTimeout(function () {
          worker.terminate();
          if (compileWorker === worker) compileWorker = null;
          reject(new Error(translate('editor.compileTimeout')));
        }, 180000);

        function cleanup() {
          window.clearTimeout(timeout);
          worker.removeEventListener('message', onMessage);
          worker.removeEventListener('error', onError);
        }

        function onError(event) {
          cleanup();
          worker.terminate();
          if (compileWorker === worker) compileWorker = null;
          reject(new Error(event && event.message ? event.message : translate('editor.compileError')));
        }

        function onMessage(event) {
          var message = event.data;
          if (!message || (message.id !== undefined && message.id !== requestId)) return;
          if (message.type === 'progress') {
            setPreviewStatus(message.key);
          } else if (message.type === 'result') {
            cleanup();
            resolve(message);
          } else if (message.type === 'error') {
            cleanup();
            if (/unreachable|out of bounds|stack|panicked|aborted|memory/i.test((message.message || '') + ' ' + (message.log || ''))) {
              worker.terminate();
              if (compileWorker === worker) compileWorker = null;
            }
            var error = new Error(message.message || translate('editor.compileFailed'));
            error.log = message.log || '';
            reject(error);
          }
        }

        worker.addEventListener('message', onMessage);
        worker.addEventListener('error', onError);
        try {
          worker.postMessage({ type: 'compile', id: requestId, files: files, mainFile: mainFile });
        } catch (error) {
          cleanup();
          reject(error);
        }
      }).catch(reject);
    });
  }

  function applyPreviewZoom() {
      if (editorWindow.classList.contains('presentation-mode')) return;
      pcZoom.textContent = Math.round(state.zoom * 100) + '%';
      Array.prototype.forEach.call(previewFrame.querySelectorAll('.pdf-page'), function (page) {
        var width = Number(page.getAttribute('data-width'));
        var height = Number(page.getAttribute('data-height'));
        page.style.width = width * state.zoom + 'px';
        page.style.height = height * state.zoom + 'px';
        page.querySelector('canvas').style.transform = 'scale(' + state.zoom + ')';
      });
    }

    function fitSlideToScreen() {
      if (!editorWindow.classList.contains('presentation-mode')) return;
      renderPresentationSlide(state.presentationSlide);
    }

  async function renderPdf(bytes) {
    var pdfjs = await getPdfJs();
    if (state.pageObserver) state.pageObserver.disconnect();
    state.pageObserver = null;
    previewFrame.replaceChildren();

    var loadingTask = pdfjs.getDocument({ data: new Uint8Array(bytes) });
    state.pdfLoadingTask = loadingTask;
    var pdf = await loadingTask.promise;
    state.pdfDoc = pdf;
    state.pdfBytes = bytes;
    presentationCache = {};
    var availableWidth = Math.max(240, previewFrame.clientWidth - 32);
    var firstPage = await pdf.getPage(1);
    var firstViewport = firstPage.getViewport({ scale: 1 });
    var fitScale = availableWidth / firstViewport.width;
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    var currentPage = 1;
    pcPage.textContent = '1 / ' + pdf.numPages;
    updatePageNavButtons(currentPage, pdf.numPages);

    if ('IntersectionObserver' in window) {
      state.pageObserver = new IntersectionObserver(function (entries) {
        var mostVisible = null;
        entries.forEach(function (entry) {
          if (entry.isIntersecting && (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio)) {
            mostVisible = entry;
          }
        });
        if (mostVisible) {
          currentPage = Number(mostVisible.target.getAttribute('data-page'));
          pcPage.textContent = currentPage + ' / ' + pdf.numPages;
          updatePageNavButtons(currentPage, pdf.numPages);
        }
      }, { root: previewFrame, threshold: [0.5, 0.75] });
    }

    for (var pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      var page = pageNumber === 1 ? firstPage : await pdf.getPage(pageNumber);
      var viewport = page.getViewport({ scale: fitScale });
      var canvas = document.createElement('canvas');
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', translate('editor.pdfPage', [pageNumber, pdf.numPages]));
      canvas.width = Math.ceil(viewport.width * pixelRatio);
      canvas.height = Math.ceil(viewport.height * pixelRatio);
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      canvas.style.transformOrigin = 'top left';
      var context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('The browser could not create a PDF preview canvas.');
      var wrapper = document.createElement('div');
      wrapper.className = 'pdf-page';
      wrapper.setAttribute('data-page', pageNumber);
      wrapper.setAttribute('data-width', viewport.width);
      wrapper.setAttribute('data-height', viewport.height);
      wrapper.style.width = viewport.width * state.zoom + 'px';
      wrapper.style.height = viewport.height * state.zoom + 'px';
      wrapper.appendChild(canvas);
      previewFrame.appendChild(wrapper);
      if (state.pageObserver) state.pageObserver.observe(wrapper);

      await page.render({
        canvasContext: context,
        viewport: page.getViewport({ scale: fitScale * pixelRatio })
      }).promise;
    }
    applyPreviewZoom();
    previewFrame.style.display = 'block';
    if (editorWindow.classList.contains('presentation-mode')) {
      updateSlideView();
    }
    return currentPage;
  }

  async function compile() {
    if (state.compiling) {
      state.pendingCompile = true;
      return;
    }
    var start = Date.now();
    var pdfGenerated = false;
    var targetMainFile = resolveMainFile();

    state.compiling = true;
    state.pendingCompile = false;
    updateCompileButton();
    setPreviewStatus('editor.compiling');
    previewEmpty.hidden = true;
    previewFrame.style.display = 'none';
    previewControls.hidden = true;
    clearOutput();
    previewFrame.setAttribute('aria-busy', 'true');
    if (state.pageObserver) state.pageObserver.disconnect();
    state.pageObserver = null;
    if (state.pdfLoadingTask) {
      try {
        await state.pdfLoadingTask.destroy();
      } catch (error) {
        appendOutput(translate('editor.compileErrorDetail', [error.message]), 'warn');
      }
      state.pdfLoadingTask = null;
    }
    state.pdfDoc = null;
    presentationCache = {};
    previewFrame.replaceChildren();
    if (state.pdfBlobUrl) URL.revokeObjectURL(state.pdfBlobUrl);
    state.pdfBlobUrl = null;
    setDownloadDisabled(true);

    try {
      var result = await compileWithTectonic(state.files, targetMainFile);
      var blob = new Blob([result.pdf], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      if (state.pdfBlobUrl) URL.revokeObjectURL(state.pdfBlobUrl);
      state.pdfBlobUrl = url;
      setDownloadDisabled(false);
      pdfGenerated = true;
      if (result.log) appendOutput(result.log, result.errors ? 'warn' : '');
      appendOutput(
        translate(result.errors ? 'editor.compiledWithErrors' : 'editor.compilationSuccess'),
        result.errors ? 'warn' : 'ok'
      );
      state.errors = result.errors || 0;
      state.warnings = result.warnings || 0;
      if (state.errors > 0) setCompilePanelVisible(true);
      if (statusCompileCapsule) statusCompileCapsule.setAttribute('data-state', state.errors ? 'failed' : 'succeeded');
      previewFrame.style.display = 'block';
      await renderPdf(result.pdf);
      previewEmpty.hidden = true;
      previewControls.hidden = false;
      setPreviewStatus(result.errors ? 'editor.compiledWithErrors' : 'editor.compiledSuccess');
      state.lastCompile = ((Date.now() - start) / 1000).toFixed(1);
      updateCompileStatus();
    } catch (error) {
      setCompilePanelVisible(true);
      if (error.log) appendOutput(error.log, 'warn');
      var firstError = error.log ? error.log.match(/^!.*$/m) : null;
      if (firstError) appendOutput(firstError[0], 'err');
      else if (error.log) {
        // No LaTeX ! error line: show the tail of the log (e.g. engine panic message)
        var lines = error.log.split('\n').filter(function (l) { return l.trim(); });
        appendOutput(lines.slice(-4).join('\n'), 'err');
      } else appendOutput(translate('editor.compileErrorDetail', [error.message]), 'err');
      previewEmpty.hidden = pdfGenerated;
      previewControls.hidden = !pdfGenerated;
      if (pdfGenerated) {
        previewFrame.style.display = 'block';
        setPreviewStatus('editor.previewError', [error.message]);
      } else {
        setPreviewStatus('editor.compileError');
        state.errors = 1;
        state.warnings = 0;
      }
      if (statusCompileCapsule) statusCompileCapsule.setAttribute('data-state', 'failed');
    } finally {
      previewFrame.removeAttribute('aria-busy');
      state.compiling = false;
      updateCompileButton();
      updateErrorStatus();
      updateWarningStatus();
      if (state.pendingCompile) {
        state.pendingCompile = false;
        window.setTimeout(function () {
          compile().catch(function (err) {
            console.error('Queued compile failed:', err);
          });
        }, 50);
      }
    }
  }

  btnCompile.addEventListener('click', function () {
    compile().catch(function (err) {
      console.error('Compile failed:', err);
    });
  });
  statusErrors.addEventListener('click', showCompileOutput);
  statusWarnings.addEventListener('click', showCompileOutput);
  if (btnToolbarIssues) btnToolbarIssues.addEventListener('click', showCompileOutput);
  if (btnCloseCompile) btnCloseCompile.addEventListener('click', function () { setCompilePanelVisible(false); });
  if (btnSidebar) {
    btnSidebar.addEventListener('click', function () {
      var collapsed = editorWindow.classList.toggle('no-sidebar');
      btnSidebar.setAttribute('aria-pressed', collapsed ? 'false' : 'true');
      if (collapsed && tbSidebarSlot) tbSidebarSlot.appendChild(btnSidebar);
      else if (!collapsed && sidebarHead) sidebarHead.appendChild(btnSidebar);
    });
  }
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

  /* ---------- math symbols panel & click / drag-and-drop insertion ---------- */
  var suppressSymbolClick = false;
  var activeSymbolDragCleanup = null;
  var dropMirror = null;

  function isQuoteDisplay(d) {
    return /[“”‘’]/.test(d || '');
  }

  function showSymbolPreview(sym) {
    if (!sym) return;
    if (symPreviewGlyph) {
      symPreviewGlyph.textContent = sym.display;
      symPreviewGlyph.classList.toggle('quote', isQuoteDisplay(sym.display));
    }
    if (symPreviewCode) symPreviewCode.textContent = sym.code;
    if (symPreviewPkg) {
      symPreviewPkg.textContent = sym.pkg ? ('\\usepackage{' + sym.pkg + '}') : '';
      symPreviewPkg.hidden = !sym.pkg;
    }
    if (symPreviewName) symPreviewName.textContent = sym.name;
  }

  var autoCloserOffsets = [];
  var lastTrackedValue = source ? source.value : '';
  var PAIR_CLOSER = { '{': '}', '(': ')', '[': ']', '$': '$' };
  var PAIR_REVERSE = { '}': '{', ')': '(', ']': '[', '$': '$' };

  function caretOffsetInsideInserted(code) {
    if (code === "``''") return 2;
    if (code === "`'") return 1;
    if (code === '\\guillemotleft{}\\guillemotright{}') return 16;
    var blockBody = code.indexOf('\n  \n');
    if (blockBody !== -1) return blockBody + 3;
    var emptyBrace = code.indexOf('{}');
    if (emptyBrace !== -1) return emptyBrace + 1;
    var spacedBrace = code.indexOf('{  }');
    if (spacedBrace !== -1) return spacedBrace + 2;
    var emptySpaceDelim = code.indexOf('  \\right');
    if (emptySpaceDelim !== -1) return emptySpaceDelim + 1;
    var emptyBracket = code.indexOf('[]');
    if (emptyBracket !== -1) return emptyBracket + 1;
    return code.length;
  }

  function pushFileHistorySnapshot(fileName, content) {
    if (!Array.isArray(state.history[fileName])) return;
    var hIdx = state.historyIndex[fileName] || 0;
    var hist = state.history[fileName].slice(0, hIdx + 1);
    if (hist[hist.length - 1] === content) return;
    hist.push(content);
    if (hist.length > 50) hist.shift();
    state.history[fileName] = hist;
    state.historyIndex[fileName] = hist.length - 1;
  }

  function insertMathSymbolAt(sym, start, end) {
    if (!sym || !source) return;
    var GMS = window.GabeTeXMathSymbols;
    var code = sym.code;
    var val = source.value;
    var fallback = typeof source.selectionStart === 'number' ? source.selectionStart : val.length;
    var s = Math.max(0, Math.min(typeof start === 'number' ? start : fallback, val.length));
    var e = Math.max(s, Math.min(typeof end === 'number' ? end : (typeof source.selectionEnd === 'number' ? source.selectionEnd : s), val.length));

    var baseVal = val;
    if (sym.pkg && GMS && GMS.planPackageImport && GMS.hasPackageImport) {
      var pkgPlan = GMS.planPackageImport(val, sym.pkg);
      if (pkgPlan) {
        baseVal = val.slice(0, pkgPlan.offset) + pkgPlan.text + val.slice(pkgPlan.offset);
        if (pkgPlan.offset <= s) s += pkgPlan.text.length;
        if (pkgPlan.offset <= e) e += pkgPlan.text.length;
      } else if (!GMS.hasPackageImport(val, sym.pkg)) {
        var mainName = resolveMainFile();
        if (mainName && mainName !== state.activeFile && Object.prototype.hasOwnProperty.call(state.files, mainName)) {
          var mainVal = state.files[mainName] || '';
          var mainPlan = GMS.planPackageImport(mainVal, sym.pkg);
          if (mainPlan) {
            var updatedMain = mainVal.slice(0, mainPlan.offset) + mainPlan.text + mainVal.slice(mainPlan.offset);
            state.files[mainName] = updatedMain;
            pushFileHistorySnapshot(mainName, updatedMain);
          }
        }
      }
    }

    var plan = (!sym.textMode && GMS && GMS.prepareInsertion)
      ? GMS.prepareInsertion(baseVal, s, e, code)
      : { from: s, to: e, text: code, moveAfterClosingDollar: false };
    commitHistorySnapshot();
    source.value = baseVal.slice(0, plan.from) + plan.text + baseVal.slice(plan.to);
    autoCloserOffsets = [];
    lastTrackedValue = source.value;
    var innerOffset = caretOffsetInsideInserted(code);
    var caret;
    if (innerOffset < code.length) {
      var codeIdx = plan.text.indexOf(code);
      caret = plan.from + (codeIdx !== -1 ? codeIdx : 0) + innerOffset;
    } else if (plan.moveAfterClosingDollar) {
      caret = Math.min(source.value.length, plan.from + plan.text.length + 1);
    } else {
      caret = plan.from + plan.text.length;
    }
    source.focus();
    source.setSelectionRange(caret, caret);
    source.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function ensureDropMirror() {
    if (dropMirror) return dropMirror;
    dropMirror = document.createElement('div');
    dropMirror.setAttribute('aria-hidden', 'true');
    dropMirror.style.position = 'fixed';
    dropMirror.style.visibility = 'hidden';
    dropMirror.style.pointerEvents = 'none';
    dropMirror.style.zIndex = '-1';
    dropMirror.style.margin = '0';
    dropMirror.style.border = '0';
    dropMirror.style.boxSizing = 'border-box';
    dropMirror.style.whiteSpace = 'pre-wrap';
    dropMirror.style.wordWrap = 'break-word';
    dropMirror.style.overflowWrap = 'break-word';
    var host = document.getElementById('editor-view') || document.body;
    host.appendChild(dropMirror);
    return dropMirror;
  }

  function hideDropCaret() {
    if (editorDropCaret) editorDropCaret.hidden = true;
  }

  function resolveTextareaDrop(clientX, clientY) {
    if (!source || !editorCodeWrap) return null;
    var sr = source.getBoundingClientRect();
    if (clientX < sr.left || clientX > sr.right || clientY < sr.top || clientY > sr.bottom) {
      return null;
    }
    var mirror = ensureDropMirror();
    var cs = getComputedStyle(source);
    mirror.style.font = cs.font;
    mirror.style.fontVariantLigatures = cs.fontVariantLigatures;
    mirror.style.letterSpacing = cs.letterSpacing;
    mirror.style.wordSpacing = cs.wordSpacing;
    mirror.style.tabSize = cs.tabSize;
    mirror.style.lineHeight = cs.lineHeight;
    mirror.style.paddingTop = cs.paddingTop;
    mirror.style.paddingRight = cs.paddingRight;
    mirror.style.paddingBottom = cs.paddingBottom;
    mirror.style.paddingLeft = cs.paddingLeft;
    mirror.style.left = (sr.left + source.clientLeft - source.scrollLeft) + 'px';
    mirror.style.top = (sr.top + source.clientTop - source.scrollTop) + 'px';
    mirror.style.width = source.clientWidth + 'px';

    var text = source.value;
    var wrapRect = editorCodeWrap.getBoundingClientRect();
    var lh = parseFloat(cs.lineHeight) || 21;
    if (!text.length) {
      var padLeft = parseFloat(cs.paddingLeft) || 16;
      var padTop = parseFloat(cs.paddingTop) || 12;
      return {
        offset: 0,
        x: sr.left + source.clientLeft + padLeft - source.scrollLeft - wrapRect.left,
        y: sr.top + source.clientTop + padTop - source.scrollTop - wrapRect.top,
        height: lh
      };
    }

    mirror.textContent = text + '\u200b';
    var textNode = mirror.firstChild;
    var range = document.createRange();
    function rectAt(idx) {
      var safe = Math.max(0, Math.min(idx, text.length));
      range.setStart(textNode, safe);
      range.collapse(true);
      var rects = range.getClientRects();
      return rects.length ? rects[rects.length - 1] : range.getBoundingClientRect();
    }

    var firstRect = rectAt(0);
    var lastRect = rectAt(text.length);
    var lineFirst = 0;
    if (clientY <= firstRect.top) {
      lineFirst = 0;
    } else if (clientY >= lastRect.bottom) {
      var loLast = 0;
      var hiLast = text.length;
      while (loLast < hiLast) {
        var midLast = (loLast + hiLast) >> 1;
        if (Math.abs(rectAt(midLast).top - lastRect.top) < 4) hiLast = midLast;
        else loLast = midLast + 1;
      }
      lineFirst = loLast;
    } else {
      var lo = 0;
      var hi = text.length;
      while (lo < hi) {
        var mid = (lo + hi) >> 1;
        if (rectAt(mid).bottom > clientY) hi = mid;
        else lo = mid + 1;
      }
      lineFirst = lo;
    }

    var lineTop = rectAt(lineFirst).top;
    var loEnd = lineFirst;
    var hiEnd = text.length;
    while (loEnd < hiEnd) {
      var midEnd = (loEnd + hiEnd + 1) >> 1;
      if (rectAt(midEnd).top <= lineTop + 4) loEnd = midEnd;
      else hiEnd = midEnd - 1;
    }
    var lineEnd = loEnd;

    var best = lineFirst;
    if (clientX <= rectAt(lineFirst).left) {
      best = lineFirst;
    } else if (clientX >= rectAt(lineEnd).left) {
      best = lineEnd;
    } else {
      var loX = lineFirst;
      var hiX = lineEnd;
      while (loX < hiX) {
        var midX = (loX + hiX) >> 1;
        if (rectAt(midX).left >= clientX) hiX = midX;
        else loX = midX + 1;
      }
      best = loX;
      if (best > lineFirst) {
        var curDist = Math.abs(rectAt(best).left - clientX);
        var prevDist = Math.abs(rectAt(best - 1).left - clientX);
        if (prevDist < curDist) best = best - 1;
      }
    }

    var chosen = rectAt(best);
    var clampedTop = Math.max(sr.top, Math.min(chosen.top, sr.bottom - 4));
    var clampedLeft = Math.max(sr.left, Math.min(chosen.left, sr.right - 2));
    return {
      offset: best,
      x: clampedLeft - wrapRect.left,
      y: clampedTop - wrapRect.top,
      height: Math.max(14, chosen.height || lh)
    };
  }

  function showDropCaretAt(drop) {
    if (!editorDropCaret) return;
    if (!drop) {
      editorDropCaret.hidden = true;
      return;
    }
    editorDropCaret.style.transform = 'translate(' + drop.x + 'px, ' + drop.y + 'px)';
    editorDropCaret.style.height = drop.height + 'px';
    editorDropCaret.hidden = false;
  }

  function startSymbolDrag(event, sym) {
    if (event.button !== 0) return;
    event.preventDefault();
    if (activeSymbolDragCleanup) activeSymbolDragCleanup();
    showSymbolPreview(sym);
    var startX = event.clientX;
    var startY = event.clientY;
    var dragging = false;
    var lastDrop = null;
    var ghost = null;

    function cleanup() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
      if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
      ghost = null;
      document.body.classList.remove('dragging-math-symbol');
      hideDropCaret();
      activeSymbolDragCleanup = null;
    }

    function onMove(ev) {
      if (!dragging) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < 5) return;
        dragging = true;
        ghost = document.createElement('div');
        ghost.className = 'ed-sym-drag-ghost';
        var glyphSpan = document.createElement('span');
        glyphSpan.className = 'glyph' + (isQuoteDisplay(sym.display) ? ' quote' : '');
        glyphSpan.textContent = sym.display;
        var codeEl = document.createElement('code');
        codeEl.textContent = sym.code;
        ghost.appendChild(glyphSpan);
        ghost.appendChild(codeEl);
        (editorApp || document.body).appendChild(ghost);
        document.body.classList.add('dragging-math-symbol');
      }
      ghost.style.left = (ev.clientX + 12) + 'px';
      ghost.style.top = (ev.clientY - 14) + 'px';
      lastDrop = resolveTextareaDrop(ev.clientX, ev.clientY);
      showDropCaretAt(lastDrop);
      ghost.classList.toggle('over-editor', !!lastDrop);
    }

    function onUp(ev) {
      var wasDragging = dragging;
      var drop = wasDragging ? resolveTextareaDrop(ev.clientX, ev.clientY) : null;
      cleanup();
      if (!wasDragging) return;
      suppressSymbolClick = true;
      setTimeout(function () { suppressSymbolClick = false; }, 0);
      if (drop) insertMathSymbolAt(sym, drop.offset, drop.offset);
    }

    function onCancel() { cleanup(); }

    activeSymbolDragCleanup = cleanup;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
  }

  function renderMathSymbols() {
    if (!symList || !window.GabeTeXMathSymbols) return;
    symbolsBuilt = true;
    var query = symSearch ? symSearch.value : '';
    var searching = String(query).replace(/^\s+|\s+$/g, '').length > 0;
    var categories = window.GabeTeXMathSymbols.filter(query, translate);
    symList.innerHTML = '';
    if (!categories.length) {
      var empty = document.createElement('p');
      empty.className = 'ed-sym-empty';
      empty.textContent = translate('editor.noMatchingSymbols');
      symList.appendChild(empty);
      return;
    }

    var frag = document.createDocumentFragment();
    for (var i = 0; i < categories.length; i++) {
      (function (cat) {
        var expanded = searching || !collapsedSymbolCats[cat.id];
        var catWrap = document.createElement('div');
        catWrap.className = 'ed-sym-cat';

        var catBtn = document.createElement('button');
        catBtn.type = 'button';
        catBtn.className = 'ed-sym-cat-btn';
        catBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');

        var chev = document.createElement('span');
        chev.className = 'ed-sym-cat-chev';
        chev.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6.5 15 12l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        var catIcon = document.createElement('span');
        catIcon.className = 'ed-sym-cat-icon';
        catIcon.textContent = cat.icon;

        var catTitle = document.createElement('span');
        catTitle.className = 'ed-sym-cat-title';
        catTitle.textContent = translate(cat.labelKey);

        var catCount = document.createElement('span');
        catCount.className = 'ed-sym-cat-count';
        catCount.textContent = String(cat.symbols.length);

        catBtn.appendChild(chev);
        catBtn.appendChild(catIcon);
        catBtn.appendChild(catTitle);
        catBtn.appendChild(catCount);

        var grid = document.createElement('div');
        grid.className = 'ed-sym-grid';
        grid.hidden = !expanded;

        for (var j = 0; j < cat.symbols.length; j++) {
          (function (sym) {
            var tile = document.createElement('button');
            tile.type = 'button';
            tile.className = 'ed-sym-tile' + (isQuoteDisplay(sym.display) ? ' quote' : (sym.display.length >= 3 ? ' wide' : ''));
            tile.textContent = sym.display;
            tile.setAttribute('draggable', 'false');
            tile.setAttribute('data-code', sym.code);
            tile.title = sym.pkg ? (sym.code + ' — ' + sym.name + ' (\\usepackage{' + sym.pkg + '})') : (sym.code + ' — ' + sym.name);
            tile.setAttribute('aria-label', sym.name + ' (' + sym.code + ')');

            tile.addEventListener('pointerenter', function () { showSymbolPreview(sym); });
            tile.addEventListener('focus', function () { showSymbolPreview(sym); });
            tile.addEventListener('pointerdown', function (e) { startSymbolDrag(e, sym); });
            tile.addEventListener('click', function () {
              if (suppressSymbolClick) return;
              showSymbolPreview(sym);
              insertMathSymbolAt(sym);
            });
            grid.appendChild(tile);
          })(cat.symbols[j]);
        }

        catBtn.addEventListener('click', function () {
          if (searching) return;
          var next = catBtn.getAttribute('aria-expanded') !== 'true';
          if (next) delete collapsedSymbolCats[cat.id];
          else collapsedSymbolCats[cat.id] = true;
          catBtn.setAttribute('aria-expanded', next ? 'true' : 'false');
          grid.hidden = !next;
        });

        catWrap.appendChild(catBtn);
        catWrap.appendChild(grid);
        frag.appendChild(catWrap);
      })(categories[i]);
    }
    symList.appendChild(frag);
  }

  if (btnSymbols) {
    btnSymbols.addEventListener('click', function () {
      var active = sidebarSymbols && !sidebarSymbols.hidden;
      setSidebarTab(active ? lastSidebarTab : 'symbols');
    });
  }
  if (symSearch) {
    symSearch.addEventListener('input', function () {
      if (symSearchClear) symSearchClear.hidden = symSearch.value.length === 0;
      renderMathSymbols();
    });
  }
  if (symSearchClear) {
    symSearchClear.addEventListener('click', function () {
      if (symSearch) {
        symSearch.value = '';
        symSearch.focus();
      }
      symSearchClear.hidden = true;
      renderMathSymbols();
    });
  }
  btnSplit.addEventListener('click', function () {
    var split = editorWindow.classList.toggle('is-split-view');
    btnSplit.setAttribute('aria-pressed', split ? 'true' : 'false');
    btnSplit.classList.toggle('tb-active', split);
  });

  /* ---------- draggable dividers ---------- */
  var dividerSidebar = document.getElementById('divider-sidebar');
  var dividerPreview = document.getElementById('divider-preview');

  function startDrag(divider, onMove, onEnd) {
    divider.addEventListener('mousedown', function (event) {
      event.preventDefault();
      var startX = event.clientX;
      var startSidebar = parseInt(getComputedStyle(editorSidebar).width, 10);
      var startPreview = parseInt(getComputedStyle(editorPreviewPane).width, 10);
      editorWindow.classList.add('is-resizing');

      function onMouseMove(moveEvent) {
        var dx = moveEvent.clientX - startX;
        onMove(dx, startSidebar, startPreview);
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        editorWindow.classList.remove('is-resizing');
        if (onEnd) onEnd();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  var editorSidebar = document.querySelector('.editor-sidebar');
  var editorPreviewPane = document.querySelector('.editor-preview-pane');

  startDrag(dividerSidebar, function (dx, startSidebar) {
    var newWidth = Math.max(120, Math.min(400, startSidebar + dx));
    document.documentElement.style.setProperty('--sidebar-width', newWidth + 'px');
  });

  startDrag(dividerPreview, function (dx, _startSidebar, startPreview) {
    var newWidth = Math.max(200, Math.min(600, startPreview - dx));
    document.documentElement.style.setProperty('--preview-width', newWidth + 'px');
  });
  function syncAutoClosersAfterInput() {
    if (!source) return;
    var next = source.value;
    if (typeof lastTrackedValue === 'string' && lastTrackedValue !== next && autoCloserOffsets.length) {
      var delta = next.length - lastTrackedValue.length;
      var caret = typeof source.selectionStart === 'number' ? source.selectionStart : next.length;
      var prevCaret = Math.max(0, caret - delta);
      var kept = [];
      for (var i = 0; i < autoCloserOffsets.length; i++) {
        var shifted = prevCaret <= autoCloserOffsets[i] ? autoCloserOffsets[i] + delta : autoCloserOffsets[i];
        var ch = next.charAt(shifted);
        if (shifted >= 0 && shifted < next.length && PAIR_REVERSE[ch] && caret <= shifted) {
          kept.push(shifted);
        }
      }
      autoCloserOffsets = kept;
    }
    lastTrackedValue = next;
  }

  function hasAutoCloserAt(offset, ch) {
    for (var i = 0; i < autoCloserOffsets.length; i++) {
      if (autoCloserOffsets[i] === offset && source.value.charAt(offset) === ch) return i;
    }
    return -1;
  }

  function isOffsetInTexComment(text, pos) {
    var lineStart = text.lastIndexOf('\n', Math.max(0, pos - 1)) + 1;
    var GMS = window.GabeTeXMathSymbols;
    for (var i = lineStart; i < pos; i++) {
      if (text.charCodeAt(i) === 37 && (!GMS || !GMS.isEscapedAt || !GMS.isEscapedAt(text, i))) {
        return true;
      }
    }
    return false;
  }

  function applyPairEdit(nextVal, nextSelStart, nextSelEnd, nextClosers) {
    commitHistorySnapshot();
    source.value = nextVal;
    source.setSelectionRange(nextSelStart, nextSelEnd);
    autoCloserOffsets = nextClosers || [];
    lastTrackedValue = nextVal;
    source.dispatchEvent(new Event('input', { bubbles: true }));
    updateCursor();
  }

  function handleSmartPairKeydown(event) {
    if (!source || event.isComposing) return false;
    var GMS = window.GabeTeXMathSymbols;
    var val = source.value;
    var start = source.selectionStart;
    var end = source.selectionEnd;
    var key = event.key;
    var unmodified = !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;

    if (unmodified && (key === 'Backspace' || key === 'Delete') && start === end) {
      var delPlan = GMS && GMS.findPairedDeletion
        && GMS.findPairedDeletion(val, start, key === 'Backspace' ? 'backward' : 'forward');
      if (delPlan) {
        event.preventDefault();
        var nextVal = val;
        for (var ri = delPlan.ranges.length - 1; ri >= 0; ri--) {
          nextVal = nextVal.slice(0, delPlan.ranges[ri].from) + nextVal.slice(delPlan.ranges[ri].to);
        }
        applyPairEdit(nextVal, delPlan.caret, delPlan.caret, []);
        return true;
      }
      return false;
    }

    if (unmodified && key === 'Enter' && start === end && !isOffsetInTexComment(val, start)) {
      var betweenBraces = val.charAt(start - 1) === '{' && val.charAt(start) === '}';
      var betweenDisp = start >= 2 && val.slice(start - 2, start) === '\\[' && val.slice(start, start + 2) === '\\]';
      if (betweenBraces || betweenDisp) {
        var ls = val.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
        var indentMatch = /^[ \t]*/.exec(val.slice(ls, start));
        var baseIndent = indentMatch ? indentMatch[0] : '';
        var eol = val.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
        var inner = eol + baseIndent + '  ';
        var block = inner + eol + baseIndent;
        event.preventDefault();
        applyPairEdit(val.slice(0, start) + block + val.slice(start), start + inner.length, start + inner.length, []);
        return true;
      }
      return false;
    }

    if (event.metaKey || (event.ctrlKey && !event.altKey)) return false;

    if (start === end && PAIR_REVERSE[key]) {
      var closerIdx = hasAutoCloserAt(start, key);
      if (closerIdx !== -1) {
        event.preventDefault();
        var remaining = [];
        for (var ci = 0; ci < autoCloserOffsets.length; ci++) {
          if (ci !== closerIdx && autoCloserOffsets[ci] > start) remaining.push(autoCloserOffsets[ci]);
        }
        if (key === '}' && GMS && GMS.findBeginAutoClose) {
          var stepBegin = GMS.findBeginAutoClose(val, start + 1, '  ');
          if (stepBegin) {
            applyPairEdit(
              val.slice(0, start + 1) + stepBegin.insert + val.slice(start + 1),
              start + 1 + stepBegin.caretOffset,
              start + 1 + stepBegin.caretOffset,
              []
            );
            return true;
          }
        }
        autoCloserOffsets = remaining;
        source.setSelectionRange(start + 1, start + 1);
        updateCursor();
        return true;
      }

      if (key === '}' && GMS && GMS.findBeginAutoClose && !isOffsetInTexComment(val, start) && (!GMS.isEscapedAt || !GMS.isEscapedAt(val, start))) {
        var withBrace = val.slice(0, start) + '}' + val.slice(start);
        var beginPlan = GMS.findBeginAutoClose(withBrace, start + 1, '  ');
        if (beginPlan) {
          event.preventDefault();
          applyPairEdit(
            withBrace.slice(0, start + 1) + beginPlan.insert + withBrace.slice(start + 1),
            start + 1 + beginPlan.caretOffset,
            start + 1 + beginPlan.caretOffset,
            []
          );
          return true;
        }
      }
      if (key !== '$') return false;
    }

    if (!PAIR_CLOSER[key] || isOffsetInTexComment(val, start)) return false;

    var escapedPrev = start > 0 && val.charAt(start - 1) === '\\' && (!GMS || !GMS.isEscapedAt || !GMS.isEscapedAt(val, start - 1));
    if (escapedPrev) {
      if (key !== '(' && key !== '[') return false;
      var escClose = '\\' + (key === '(' ? ')' : ']');
      if (start === end) {
        event.preventDefault();
        applyPairEdit(val.slice(0, start) + key + escClose + val.slice(end), start + 1, start + 1, []);
        return true;
      }
      if (val.slice(start, end).indexOf('\n') === -1) {
        event.preventDefault();
        applyPairEdit(val.slice(0, start) + key + val.slice(start, end) + escClose + val.slice(end), start + 1, end + 1, []);
        return true;
      }
      return false;
    }

    if (key === '$') {
      if (GMS && GMS.isInMathMode && GMS.isInMathMode(val, start)) return false;
      if (start > 0 && /[A-Za-z0-9$]/.test(val.charAt(start - 1))) return false;
    }

    if (start < end) {
      if (val.slice(start, end).indexOf('\n') !== -1) return false;
      event.preventDefault();
      applyPairEdit(val.slice(0, start) + key + val.slice(start, end) + PAIR_CLOSER[key] + val.slice(end), start + 1, end + 1, []);
      return true;
    }

    var nextCh = start < val.length ? val.charAt(start) : '';
    if (nextCh && !/[\s)}\]$,.;:!?'"\\]/.test(nextCh)) return false;

    var nextClosers = [start + 1];
    for (var ai = 0; ai < autoCloserOffsets.length; ai++) {
      if (autoCloserOffsets[ai] >= start) nextClosers.push(autoCloserOffsets[ai] + 2);
    }
    event.preventDefault();
    applyPairEdit(val.slice(0, start) + key + PAIR_CLOSER[key] + val.slice(start), start + 1, start + 1, nextClosers);
    return true;
  }

  source.addEventListener('input', syncAutoClosersAfterInput);
  source.addEventListener('mousedown', function () { autoCloserOffsets = []; });
  source.addEventListener('blur', function () { autoCloserOffsets = []; });
  source.addEventListener('keyup', function (ev) {
    if (!autoCloserOffsets.length) return;
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown' || ev.key === 'Home' || ev.key === 'End') {
      var caret = source.selectionStart;
      autoCloserOffsets = autoCloserOffsets.filter(function (off) { return off >= caret; });
    }
  });

  source.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      if ((state.historyIndex[state.activeFile] || 0) > 0) {
        event.preventDefault();
        undoEdit();
      }
      return;
    }

    if (handleSmartPairKeydown(event)) return;

    if (event.key !== 'Tab') return;
    event.preventDefault();

    var value = source.value;
    var selectionStart = source.selectionStart;
    var selectionEnd = source.selectionEnd;
    var indent = '  ';
    if (selectionStart === selectionEnd && !event.shiftKey) {
      source.value = value.slice(0, selectionStart) + indent + value.slice(selectionEnd);
      source.setSelectionRange(selectionStart + indent.length, selectionStart + indent.length);
    } else {
      var firstLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      var lastLineStart = value.lastIndexOf('\n', Math.max(selectionStart, selectionEnd - 1)) + 1;
      var lineStarts = [firstLineStart];
      while (lineStarts[lineStarts.length - 1] < lastLineStart) {
        lineStarts.push(value.indexOf('\n', lineStarts[lineStarts.length - 1]) + 1);
      }

      if (event.shiftKey) {
        var removedAt = [];
        for (var removeIndex = lineStarts.length - 1; removeIndex >= 0; removeIndex--) {
          var lineStart = lineStarts[removeIndex];
          var lineIndent = value.slice(lineStart).match(/^(?: {1,2}|\t)/);
          if (!lineIndent) continue;
          value = value.slice(0, lineStart) + value.slice(lineStart + lineIndent[0].length);
          removedAt.push({ position: lineStart, length: lineIndent[0].length });
        }
        var removedBeforeStart = removedAt.reduce(function (total, removal) {
          return total + (removal.position < selectionStart ? removal.length : 0);
        }, 0);
        var removedBeforeEnd = removedAt.reduce(function (total, removal) {
          return total + (removal.position < selectionEnd ? removal.length : 0);
        }, 0);
        source.value = value;
        source.setSelectionRange(selectionStart - removedBeforeStart, selectionEnd - removedBeforeEnd);
      } else {
        for (var addIndex = lineStarts.length - 1; addIndex >= 0; addIndex--) {
          var indentPosition = lineStarts[addIndex];
          value = value.slice(0, indentPosition) + indent + value.slice(indentPosition);
        }
        var addedBeforeStart = lineStarts.filter(function (position) { return position <= selectionStart; }).length * indent.length;
        var addedBeforeEnd = lineStarts.filter(function (position) { return position < selectionEnd; }).length * indent.length;
        source.value = value;
        source.setSelectionRange(selectionStart + addedBeforeStart, selectionEnd + addedBeforeEnd);
      }
    }
    source.dispatchEvent(new Event('input', { bubbles: true }));
    updateCursor();
  });

  /* ---------- download ---------- */
  btnDownload.addEventListener('click', function () {
    if (!state.pdfBlobUrl) return;
    var a = document.createElement('a');
    a.href = state.pdfBlobUrl;
    var mainName = resolveMainFile() || state.activeFile;
    a.download = mainName.replace(/\.tex$/i, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  setDownloadDisabled(true);

  /* ---------- preview zoom ---------- */
  btnZoomIn.addEventListener('click', function () {
    state.zoom = Math.min(state.zoom + 0.25, 2);
    applyPreviewZoom();
  });
  btnZoomOut.addEventListener('click', function () {
    state.zoom = Math.max(state.zoom - 0.25, 0.5);
    applyPreviewZoom();
  });

  /* ---------- preview toolbar buttons ---------- */
  btnToolbarDownload.addEventListener('click', function () {
    btnDownload.click();
  });
  btnAutoCompile.addEventListener('click', function () {
    state.autoCompile = !state.autoCompile;
    btnAutoCompile.setAttribute('aria-pressed', state.autoCompile ? 'true' : 'false');
    btnAutoCompile.classList.toggle('tb-active', state.autoCompile);
  });

  /* Initialize auto-compile button state */
  btnAutoCompile.setAttribute('aria-pressed', state.autoCompile ? 'true' : 'false');
  btnAutoCompile.classList.toggle('tb-active', state.autoCompile);
  btnToolbarPresent.addEventListener('click', function () {
    var pressed = btnToolbarPresent.getAttribute('aria-pressed') === 'true';
    if (!pressed) {
      if (!state.pdfDoc) return;
      btnToolbarPresent.setAttribute('aria-pressed', 'true');
      btnToolbarPresent.classList.add('tb-active');
      // Enter presentation mode
      state.presentationSlide = 1;
      editorWindow.classList.add('presentation-mode');
      if (slideOverlay) slideOverlay.hidden = false;
      var stage = getPresentationStage();
      if (stage) stage.hidden = false;
      updateSlideView();
      setupSlideKeyboard();
      requestFullscreen(editorWindow);
    } else {
      exitPresentationMode();
    }
  });

  /* ---------- slide presentation ---------- */
  var slideOverlay = document.getElementById('slide-overlay');
  var slideCounter = document.getElementById('slide-counter');
  var slidePrev = document.getElementById('slide-prev');
  var slideNext = document.getElementById('slide-next');
  var slideExit = document.getElementById('slide-exit');
  var presentationStage = document.getElementById('presentation-stage');
  var presentationCache = {};
  var presentationRendering = 0;

  function getPresentationStage() {
    if (!presentationStage) {
      presentationStage = document.getElementById('presentation-stage');
    }
    if (!presentationStage && previewFrame && previewFrame.parentElement) {
      presentationStage = document.createElement('div');
      presentationStage.id = 'presentation-stage';
      presentationStage.className = 'presentation-stage';
      presentationStage.hidden = true;
      previewFrame.parentElement.insertBefore(presentationStage, slideOverlay || null);
    }
    return presentationStage;
  }

  async function renderPresentationSlide(slideNum) {
    if (!editorWindow.classList.contains('presentation-mode')) return;
    if (!state.pdfDoc || slideNum < 1 || slideNum > state.pdfDoc.numPages) return;

    var stage = getPresentationStage();
    if (!stage) return;

    var container = previewFrame.parentElement || stage.parentElement || document.body;
    var vw = container.clientWidth || window.innerWidth;
    var vh = container.clientHeight || window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    var currentSeq = ++presentationRendering;

    try {
      var page = await state.pdfDoc.getPage(slideNum);
      if (currentSeq !== presentationRendering || !editorWindow.classList.contains('presentation-mode')) return;

      var unscaled = page.getViewport({ scale: 1 });
      var scale = Math.min((vw * 0.96) / unscaled.width, (vh * 0.96) / unscaled.height);
      var cssW = Math.round(unscaled.width * scale);
      var cssH = Math.round(unscaled.height * scale);
      var canvasW = Math.round(cssW * dpr);
      var canvasH = Math.round(cssH * dpr);

      var cacheKey = slideNum + '_' + canvasW + 'x' + canvasH;
      var canvas = presentationCache[cacheKey];

      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        var ctx = canvas.getContext('2d', { alpha: false });
        await page.render({
          canvasContext: ctx,
          viewport: page.getViewport({ scale: scale * dpr })
        }).promise;
        if (currentSeq !== presentationRendering || !editorWindow.classList.contains('presentation-mode')) return;
        presentationCache[cacheKey] = canvas;
      } else {
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
      }

      if (state.presentationSlide === slideNum) {
        stage.replaceChildren(canvas);
      }

      // Pre-render next slide in cache for instant transitions
      if (slideNum + 1 <= state.pdfDoc.numPages) {
        var nextNum = slideNum + 1;
        var nextKey = nextNum + '_' + canvasW + 'x' + canvasH;
        if (!presentationCache[nextKey]) {
          state.pdfDoc.getPage(nextNum).then(function (nextPage) {
            var nextCanvas = document.createElement('canvas');
            nextCanvas.width = canvasW;
            nextCanvas.height = canvasH;
            nextCanvas.style.width = cssW + 'px';
            nextCanvas.style.height = cssH + 'px';
            var nextCtx = nextCanvas.getContext('2d', { alpha: false });
            nextPage.render({
              canvasContext: nextCtx,
              viewport: nextPage.getViewport({ scale: scale * dpr })
            }).promise.then(function () {
              presentationCache[nextKey] = nextCanvas;
            }).catch(function () {});
          }).catch(function () {});
        }
      }
    } catch (err) {
      console.warn('Presentation render failed:', err);
    }
  }

  function exitPresentationMode() {
    btnToolbarPresent.setAttribute('aria-pressed', 'false');
    btnToolbarPresent.classList.remove('tb-active');
    editorWindow.classList.remove('presentation-mode');
    if (slideOverlay) slideOverlay.hidden = true;
    var stage = getPresentationStage();
    if (stage) {
      stage.hidden = true;
      stage.replaceChildren();
    }
    teardownSlideKeyboard();
    exitFullscreen();
    applyPreviewZoom();
    var current = state.presentationSlide || Number(pcPage.textContent.split(' / ')[0]) || 1;
    goToPage(current);
  }

  function updateSlideView() {
    if (!editorWindow.classList.contains('presentation-mode')) return;
    var totalPages = state.pdfDoc ? state.pdfDoc.numPages : previewFrame.querySelectorAll('.pdf-page').length;
    if (slideCounter) slideCounter.textContent = state.presentationSlide + ' / ' + totalPages;
    var stage = getPresentationStage();
    if (stage) stage.hidden = false;
    renderPresentationSlide(state.presentationSlide);
  }

  function goToSlide(n) {
    var totalPages = state.pdfDoc ? state.pdfDoc.numPages : previewFrame.querySelectorAll('.pdf-page').length;
    if (n < 1) n = 1;
    if (n > totalPages) n = totalPages;
    state.presentationSlide = n;
    updateSlideView();
  }

  function goToPage(n) {
    var pages = previewFrame.querySelectorAll('.pdf-page');
    if (!pages.length) return;
    if (n < 1) n = 1;
    if (n > pages.length) n = pages.length;
    if (editorWindow.classList.contains('presentation-mode')) {
      goToSlide(n);
      return;
    }
    var target = pages[n - 1];
    if (!target) return;
    previewFrame.scrollTo({
      top: Math.max(0, target.offsetTop - 16),
      behavior: 'smooth'
    });
    pcPage.textContent = n + ' / ' + pages.length;
    updatePageNavButtons(n, pages.length);
  }

  function updatePageNavButtons(current, total) {
    if (!btnPagePrev || !btnPageNext) return;
    btnPagePrev.disabled = current <= 1;
    btnPageNext.disabled = current >= total;
  }

  slidePrev.addEventListener('click', function () { goToSlide(state.presentationSlide - 1); });
  slideNext.addEventListener('click', function () { goToSlide(state.presentationSlide + 1); });
  btnPagePrev.addEventListener('click', function () {
    var pages = previewFrame.querySelectorAll('.pdf-page');
    var current = Number(pcPage.textContent.split(' / ')[0]) || 1;
    goToPage(current - 1);
  });
  btnPageNext.addEventListener('click', function () {
    var pages = previewFrame.querySelectorAll('.pdf-page');
    var current = Number(pcPage.textContent.split(' / ')[0]) || 1;
    goToPage(current + 1);
  });
  slideExit.addEventListener('click', function () {
    exitPresentationMode();
  });

  

  /* ---------- reverse sync: double click on PDF to jump to LaTeX source ---------- */
  if (previewFrame) {
    previewFrame.addEventListener('dblclick', function (e) {
      if (!source) return;
      var page = e.target.closest('.pdf-page');
      if (!page) {
        var allPages = previewFrame.querySelectorAll('.pdf-page');
        if (allPages.length) page = allPages[0];
      }
      if (!page) return;

      var rect = page.getBoundingClientRect();
      var pageRatio = rect.height > 0 ? (e.clientY - rect.top) / rect.height : 0;
      if (pageRatio < 0) pageRatio = 0;
      if (pageRatio > 1) pageRatio = 1;

      var pageNum = Number(page.getAttribute('data-page')) || Number(page.getAttribute('data-page-number')) || 1;
      var totalPages = state.pdfDoc ? state.pdfDoc.numPages : 1;

      var text = source.value;
      var lines = text.split('\n');
      var totalLines = lines.length;
      var targetLine = Math.floor(((pageNum - 1 + pageRatio) / totalPages) * totalLines);
      if (targetLine < 0) targetLine = 0;
      if (targetLine >= totalLines) targetLine = totalLines - 1;

      var charPos = 0;
      for (var i = 0; i < targetLine; i++) {
        charPos += lines[i].length + 1;
      }

      source.focus();
      source.setSelectionRange(charPos, charPos + (lines[targetLine] ? lines[targetLine].length : 0));
      updateCursor();

      var lineHeight = source.scrollHeight / totalLines;
      source.scrollTo({
        top: Math.max(0, targetLine * lineHeight - source.clientHeight / 2),
        behavior: 'smooth'
      });
    });
  }
previewFrame.addEventListener('scroll', function () {
    if (editorWindow.classList.contains('presentation-mode')) return;
    var pages = previewFrame.querySelectorAll('.pdf-page');
    if (!pages.length) return;
    var frameTop = previewFrame.scrollTop;
    var frameHeight = previewFrame.clientHeight;
    var viewCenter = frameTop + frameHeight / 2;
    var closest = 1;
    var minDiff = Infinity;
    for (var i = 0; i < pages.length; i++) {
      var pageTop = pages[i].offsetTop;
      var pageCenter = pageTop + pages[i].offsetHeight / 2;
      var diff = Math.abs(viewCenter - pageCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i + 1;
      }
    }
    pcPage.textContent = closest + ' / ' + pages.length;
    updatePageNavButtons(closest, pages.length);
  });

  function setupSlideKeyboard() {
    document.addEventListener('keydown', slideKeydown);
  }
  function teardownSlideKeyboard() {
    document.removeEventListener('keydown', slideKeydown);
  }
  function slideKeydown(event) {
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      goToSlide(state.presentationSlide + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goToSlide(state.presentationSlide - 1);
    } else if (event.key === 'Escape' || event.key === 'q' || event.key === 'Q') {
      event.preventDefault();
      exitPresentationMode();
    }
  }

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }

  function requestFullscreen(el) {
    if (!el || isFullscreen()) return;
    try {
      var p;
      if (el.requestFullscreen) p = el.requestFullscreen();
      else if (el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) p = el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) p = el.msRequestFullscreen();
      if (p && typeof p.catch === "function") {
        p.catch(function () {});
      }
    } catch (err) {
      // Ignore fullscreen errors
    }
  }

  function exitFullscreen() {
    if (!isFullscreen()) return;
    try {
      var p;
      if (document.exitFullscreen) p = document.exitFullscreen();
      else if (document.webkitExitFullscreen) p = document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) p = document.mozCancelFullScreen();
      else if (document.msExitFullscreen) p = document.msExitFullscreen();
      if (p && typeof p.catch === "function") {
        p.catch(function () {});
      }
    } catch (err) {
      // Ignore exitFullscreen errors when document not active or already exited
    }
  }

  /* Handle fullscreen change from browser controls (F11, ESC, etc.) */
  document.addEventListener('fullscreenchange', function () {
    var isFull = !!document.fullscreenElement;
    if (!isFull && btnToolbarPresent.getAttribute('aria-pressed') === 'true') {
      exitPresentationMode();
    } else if (isFull) {
      if (btnToolbarPresent.getAttribute('aria-pressed') !== 'true') {
        exitFullscreen();
        return;
      }
      presentationCache = {};
      renderPresentationSlide(state.presentationSlide);
    }
  });
  document.addEventListener('webkitfullscreenchange', function () {
    var isFull = !!document.webkitFullscreenElement;
    if (!isFull && btnToolbarPresent.getAttribute('aria-pressed') === 'true') {
      exitPresentationMode();
    } else if (isFull) {
      if (btnToolbarPresent.getAttribute('aria-pressed') !== 'true') {
        exitFullscreen();
        return;
      }
      presentationCache = {};
      renderPresentationSlide(state.presentationSlide);
    }
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
  window.gabetexEditor = { compile: compile, state: state, resolveMainFile: resolveMainFile };

  window.addEventListener('resize', function () {
    if (editorWindow.classList.contains('presentation-mode')) {
      presentationCache = {};
      renderPresentationSlide(state.presentationSlide);
    }
  });

})();