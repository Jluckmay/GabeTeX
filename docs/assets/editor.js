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

  /* ---------- beamer detection ---------- */
  function isBeamerSource(sourceText) {
    return /\\documentclass\s*(\[[^\]]*\])?\s*\{beamer\}/.test(sourceText);
  }

  function updatePresentationButtonVisibility() {
    var beamer = isBeamerSource(source.value);
    btnToolbarPresent.hidden = !beamer;
    if (!beamer && btnToolbarPresent.getAttribute('aria-pressed') === 'true') {
      btnToolbarPresent.setAttribute('aria-pressed', 'false');
      btnToolbarPresent.classList.remove('tb-active');
      editorWindow.classList.remove('presentation-mode');
      teardownSlideKeyboard();
      exitFullscreen();
    }
  }

  /* ---------- state ---------- */
  var state = {
    files: { 'main.tex': '\\documentclass{article}\n\\begin{document}\nHello, world!\n\\end{document}\n' },
    openFiles: ['main.tex'],
    activeFile: 'main.tex',
    compiling: false,
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
  }
  function updateWarningStatus() {
    var key = state.warnings === 1 ? 'editor.warningsOne' : 'editor.warningsMany';
    statusWarnings.textContent = translate(key, [state.warnings]);
  }
  function showCompileOutput() {
    var isHidden = compilePanel.hidden;
    compilePanel.hidden = !isHidden;
    statusErrors.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    statusWarnings.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    if (isHidden) {
      compilePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      compileOutput.focus({ preventScroll: true });
    }
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
    renderTabs();
    renderFileList();
    updateCursor();
    updateHistoryButton();
  }
  document.addEventListener('gabetex:languagechange', updateTranslatedUI);
  document.addEventListener('gabetex:languagechange', function () {
  });

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
        var fileIcon = document.createElement('span');
        fileIcon.className = 'etab-file-icon';
        fileIcon.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-6l-2-2z" class="ico" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
        var star = document.createElement('span');
        star.className = 'ft-star';
        star.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12 3.5l-1.5 4.5-4.5.5-1.5-4.5L2 8l4.5 1.5L8 16l1.5-4.5L14 8z" class="ico" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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

  /* ---------- prose spell checking ---------- */
  var skippedTexCommands = {
    documentclass: 1, usepackage: 1, RequirePackage: 1, input: 1, include: 1,
    subfile: 1, includeonly: 1, label: 1, ref: 1, pageref: 1, eqref: 1,
    autoref: 1, cref: 1, Cref: 1, cite: 1, citep: 1, citet: 1,
    citeauthor: 1, nocite: 1, bibliography: 1, bibliographystyle: 1,
    bibitem: 1, includegraphics: 1, graphicspath: 1, url: 1, path: 1,
    nolinkurl: 1, verbatiminput: 1, lstinputlisting: 1, tag: 1, tagform: 1,
    ensuremath: 1, texttt: 1, lstinline: 1, mintinline: 1
  };
  var mathEnvironments = {
    math: true, displaymath: true, equation: true, align: true, alignat: true,
    flalign: true, gather: true, multline: true, eqnarray: true, split: true
  };
  var literalEnvironments = {
    verbatim: true, 'verbatim*': true, Verbatim: true, 'Verbatim*': true,
    lstlisting: true, minted: true, comment: true, alltt: true
  };

  function skipTexGroup(text, index, open, close) {
    if (text[index] !== open) return index;
    var depth = 1;
    index++;
    while (index < text.length && depth) {
      if (text[index] === '\\') {
        index += 2;
      } else if (text[index] === open) {
        depth++;
        index++;
      } else if (text[index] === close) {
        depth--;
        index++;
      } else {
        index++;
      }
    }
    return index;
  }

  function skipTexWhitespace(text, index) {
    while (index < text.length && /\s/.test(text[index])) index++;
    return index;
  }

  function skipTexOptions(text, index) {
    index = skipTexWhitespace(text, index);
    while (text[index] === '[') {
      index = skipTexGroup(text, index, '[', ']');
      index = skipTexWhitespace(text, index);
    }
    return index;
  }

  function readTexGroup(text, index) {
    if (text[index] !== '{') return null;
    var end = skipTexGroup(text, index, '{', '}');
    return { value: text.slice(index + 1, Math.max(index + 1, end - 1)), end: end };
  }

  function skipMathDelimiter(text, index, delimiter) {
    var closing = delimiter === '\\(' ? '\\)' : delimiter === '\\[' ? '\\]' : delimiter;
    var cursor = index + delimiter.length;
    while (cursor < text.length) {
      var found = text.indexOf(closing, cursor);
      if (found === -1) return text.length;
      var slashes = 0;
      for (var back = found - 1; back >= 0 && text[back] === '\\'; back--) slashes++;
      var isPartOfDisplayMath = delimiter === '$' && (text[found - 1] === '$' || text[found + 1] === '$');
      if (slashes % 2 === 0 && !isPartOfDisplayMath) return found + closing.length;
      cursor = found + closing.length;
    }
    return text.length;
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
            if (message.message === 'unreachable' || (message.log && message.log.indexOf('panicked') !== -1)) {
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
    if (state.compiling) return;
    var start = Date.now();
    var pdfGenerated = false;

    var source = state.files[state.activeFile] || '';

    state.compiling = true;
    updateCompileButton();
    setPreviewStatus('editor.compiling');
    previewEmpty.hidden = true;
    previewFrame.style.display = 'none';
    previewControls.hidden = true;
    clearOutput();
    compilePanel.hidden = false;
    statusErrors.setAttribute('aria-expanded', 'true');
    statusWarnings.setAttribute('aria-expanded', 'true');
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
    previewFrame.replaceChildren();
    if (state.pdfBlobUrl) URL.revokeObjectURL(state.pdfBlobUrl);
    state.pdfBlobUrl = null;
    btnDownload.disabled = true;

    try {
      var result = await compileWithTectonic(state.files, state.activeFile);
      var blob = new Blob([result.pdf], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      if (state.pdfBlobUrl) URL.revokeObjectURL(state.pdfBlobUrl);
      state.pdfBlobUrl = url;
      btnDownload.disabled = false;
      pdfGenerated = true;
      if (result.log) appendOutput(result.log, result.errors ? 'warn' : '');
      appendOutput(
        translate(result.errors ? 'editor.compiledWithErrors' : 'editor.compilationSuccess'),
        result.errors ? 'warn' : 'ok'
      );
      state.errors = result.errors || 0;
      state.warnings = result.warnings || 0;
      previewFrame.style.display = 'block';
      await renderPdf(result.pdf);
      previewEmpty.hidden = true;
      previewControls.hidden = false;
      setPreviewStatus(result.errors ? 'editor.compiledWithErrors' : 'editor.compiledSuccess');
      state.lastCompile = ((Date.now() - start) / 1000).toFixed(1);
      updateCompileStatus();
    } catch (error) {
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
    } finally {
      previewFrame.removeAttribute('aria-busy');
      state.compiling = false;
      updateCompileButton();
      updateErrorStatus();
      updateWarningStatus();
    }
  }

  btnCompile.addEventListener('click', function () {
    compile().catch(function (err) {
      console.error('Compile failed:', err);
    });
  });
  statusErrors.addEventListener('click', showCompileOutput);
  statusWarnings.addEventListener('click', showCompileOutput);
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

  /* ---------- draggable dividers ---------- */
  var dividerSidebar = document.getElementById('divider-sidebar');
  var dividerPreview = document.getElementById('divider-preview');

  function startDrag(divider, onMove, onEnd) {
    divider.addEventListener('mousedown', function (event) {
      event.preventDefault();
      var startX = event.clientX;
      var startSidebar = parseInt(getComputedStyle(editorSidebar).width, 10);
      var startPreview = parseInt(getComputedStyle(editorPreviewPane).width, 10);

      function onMouseMove(moveEvent) {
        var dx = moveEvent.clientX - startX;
        onMove(dx, startSidebar, startPreview);
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
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

  startDrag(dividerPreview, function (dx, startPreview) {
    var newWidth = Math.max(200, Math.min(600, startPreview - dx));
    document.documentElement.style.setProperty('--preview-width', newWidth + 'px');
  });
  source.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      if ((state.historyIndex[state.activeFile] || 0) > 0) {
        event.preventDefault();
        undoEdit();
      }
    }

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
    a.download = state.activeFile.replace(/\.tex$/i, '') + '.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  btnDownload.disabled = true;

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
      var pageRatio = (e.clientY - rect.top) / rect.height;
      if (pageRatio < 0) pageRatio = 0;
      if (pageRatio > 1) pageRatio = 1;

      var pageNum = Number(page.getAttribute('data-page-number')) || 1;
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
      presentationCache = {};
      renderPresentationSlide(state.presentationSlide);
    }
  });
  document.addEventListener('webkitfullscreenchange', function () {
    var isFull = !!document.webkitFullscreenElement;
    if (!isFull && btnToolbarPresent.getAttribute('aria-pressed') === 'true') {
      exitPresentationMode();
    } else if (isFull) {
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
  window.gabetexEditor = { compile: compile, state: state };

  window.addEventListener('resize', function () {
    if (editorWindow.classList.contains('presentation-mode')) {
      presentationCache = {};
      renderPresentationSlide(state.presentationSlide);
    }
  });

})();