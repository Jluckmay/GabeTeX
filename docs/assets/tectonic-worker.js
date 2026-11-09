'use strict';

var TECTONIC_REVISION = 'eaf26222821d7254df1d28c78a1f7897b309b727';
var TECTONIC_ROOT = 'https://raw.githubusercontent.com/nl5887/tectonic-wasm/' + TECTONIC_REVISION + '/output/';
var wasmExports;
var outputLog = '';
var textDecoder = new TextDecoder();
var textEncoder = new TextEncoder();

function log(text) {
  outputLog = (outputLog + text).slice(-20000);
}

function writeU32(pointer, value) {
  new DataView(wasmExports.memory.buffer).setUint32(pointer, value, true);
}

function wasiImports() {
  var wasi = {};
    wasi.args_sizes_get = function (count, size) {
      writeU32(count, 0);
      writeU32(size, 0);
      return 0;
    };
    wasi.args_get = function () { return 0; };
    wasi.environ_sizes_get = wasi.args_sizes_get;
    wasi.environ_get = function () { return 0; };
    wasi.proc_exit = function (code) { throw new Error('Tectonic exited with code ' + code); };
    wasi.fd_close = function () { return 0; };
    wasi.fd_read = function (fd, iovecs, count, readPointer) {
      writeU32(readPointer, 0);
      return 0;
    };
    wasi.fd_seek = function (fd, offset, whence, resultPointer) {
      new DataView(wasmExports.memory.buffer).setBigInt64(resultPointer, 0n, true);
      return 0;
    };
    wasi.fd_write = function (fd, iovecs, count, writtenPointer) {
      var view = new DataView(wasmExports.memory.buffer);
      var written = 0;
      for (var index = 0; index < count; index++) {
        var entry = iovecs + index * 8;
        var pointer = view.getUint32(entry, true);
        var length = view.getUint32(entry + 4, true);
        if (fd === 1 || fd === 2) {
          log(textDecoder.decode(new Uint8Array(wasmExports.memory.buffer, pointer, length)));
        }
        written += length;
      }
      writeU32(writtenPointer, written);
      return 0;
    };
    // WASI stubs needed by Tectonic's output_open_stdout (WASI-IO layer).
    // Without these, calling fd_open/fd_prestat_get/path_open traps the VM
    // and causes a non-unwinding Rust panic at output_open_stdout.
    // We must write valid values to output pointers so Tectonic doesn't
    // read uninitialized memory and panic.
    wasi.fd_open = function (dirfd, dirFlags, pathPointer, pathLen, oflags, fsRightsBase, fsRightsInheriting, fdFlags, resultPointer) {
      writeU32(resultPointer, 3); // return a valid fd number
      return 0;
    };
    wasi.fd_fdstat_get = function (fd, resultPointer) {
      // __wasi_fdstat_t layout (32-bit WASM):
      //   offset 0: fs_filetype (u8)
      //   offset 1: fs_flags (u8)
      //   offset 2-7: padding (6 bytes)
      //   offset 8: fs_rights_base (u64)
      //   offset 16: fs_rights_inheriting (u64)
      // Total: 24 bytes
      var view = new DataView(wasmExports.memory.buffer);
      view.setUint8(resultPointer, 0); // fs_filetype = 0 (unknown)
      view.setUint8(resultPointer + 1, 0); // fs_flags = 0
      // Zero out padding bytes 2-7
      for (var p = 2; p < 8; p++) view.setUint8(resultPointer + p, 0);
      view.setBigUint64(resultPointer + 8, 0n, true); // fs_rights_base
      view.setBigUint64(resultPointer + 16, 0n, true); // fs_rights_inheriting
      return 0;
    };
    wasi.fd_prestat_get = function (fd, resultPointer) {
      // __wasi_prestat_t layout:
      //   offset 0: pr_type (u8)
      //   offset 1-3: padding (3 bytes)
      //   offset 4: pr_dir (u32)
      // Total: 8 bytes
      var view = new DataView(wasmExports.memory.buffer);
      view.setUint8(resultPointer, 0); // pr_type = 0 (no preopened dirs)
      view.setUint8(resultPointer + 1, 0); // padding
      view.setUint8(resultPointer + 2, 0); // padding
      view.setUint8(resultPointer + 3, 0); // padding
      view.setUint32(resultPointer + 4, 0, true); // pr_dir = 0
      return 0;
    };
    wasi.fd_prestat_dir_name = function () { return 0; };
    wasi.path_open = function (dirfd, dirFlags, pathPointer, pathLen, oflags, fsRightsBase, fsRightsInheriting, fdFlags, resultPointer) {
      writeU32(resultPointer, 4); // return a valid fd number
      return 0;
    };
    wasi.fd_filestat_get = function (fd, resultPointer) {
      // __wasi_filestat_t layout: 56 bytes, all zeros
      var view = new DataView(wasmExports.memory.buffer);
      for (var p = 0; p < 56; p++) view.setUint8(resultPointer + p, 0);
      return 0;
    };
    wasi.fd_allocate = function () { return 0; };
    wasi.fd_sync = function () { return 0; };
    wasi.fd_tell = function (fd, resultPointer) {
      writeU32(resultPointer, 0);
      return 0;
    };
    wasi.path_filestat_get = function () { return 0; };
    wasi.clock_time_get = function (clock, precision, resultPointer) {
      new DataView(wasmExports.memory.buffer).setBigUint64(resultPointer, BigInt(Date.now()) * 1000000n, true);
      return 0;
    };
    wasi.random_get = function (pointer, length) {
      var bytes = new Uint8Array(wasmExports.memory.buffer, pointer, length);
      for (var offset = 0; offset < length; offset += 65536) {
        crypto.getRandomValues(bytes.subarray(offset, Math.min(offset + 65536, length)));
      }
      return 0;
    };
    return wasi;
  }

function envImports() {
  var env = {};
  ['invoke_iiiiiiiiiiji', 'invoke_iiij', 'invoke_iii', 'invoke_iiiii', 'invoke_iiii', 'invoke_vii'].forEach(function (name) {
    env[name] = function () {
      var args = Array.prototype.slice.call(arguments);
      try {
        return wasmExports.__indirect_function_table.get(args.shift()).apply(null, args);
      } catch (error) {
        if (error && error.longjmp) {
          wasmExports.setThrew(1, error.value);
          return 0;
        }
        throw error;
      }
    };
  });
  env.emscripten_longjmp = function (buffer, value) {
    var error = new Error('Tectonic longjmp');
    error.longjmp = true;
    error.value = value;
    throw error;
  };
  env.hb_graphite2_face_get_gr_face = function () { return 0; };
  env.__main_argc_argv = function () { return 0; };
  env.emscripten_notify_memory_growth = function () {};
  env.__syscall_getcwd = function () { return 0; };
  env.__syscall_unlinkat = function () { return 0; };
  env.__syscall_rmdir = function () { return 0; };
  return env;
}

function allocate(bytes) {
  var pointer = wasmExports.malloc(Math.max(bytes.length, 1));
  if (!pointer) throw new Error('Tectonic could not allocate WebAssembly memory.');
  new Uint8Array(wasmExports.memory.buffer, pointer, bytes.length).set(bytes);
  return pointer;
}

function addFile(name, bytes) {
  var nameBytes = textEncoder.encode(name);
  var namePointer = allocate(nameBytes);
  var dataPointer = allocate(bytes);
  try {
    wasmExports.tectonic_add_file(namePointer, nameBytes.length, dataPointer, bytes.length);
  } finally {
    wasmExports.free(dataPointer);
    wasmExports.free(namePointer);
  }
}

async function fetchResource(url) {
  try {
    var response = await fetch(url);
    if (response.ok) return response;
  } catch (e) {}
  if (url.indexOf('cdn.jsdelivr.net') !== -1) {
    var fallback = url.replace('https://cdn.jsdelivr.net/gh/nl5887/tectonic-wasm@' + TECTONIC_REVISION + '/output/', 'https://raw.githubusercontent.com/nl5887/tectonic-wasm/' + TECTONIC_REVISION + '/output/');
    var fbResponse = await fetch(fallback);
    if (fbResponse.ok) return fbResponse;
  }
  throw new Error('Could not download ' + url);
}

// Supplemental packages bundled to avoid external network dependencies:
// - size11.clo, size12.clo: enables 11pt and 12pt document font sizing
// - multicol.sty: multi-column layout support (compatible with Tectonic WASM format)
// - brazilian.ldf, portuguese.ldf, english.ldf, spanish.ldf: babel language definitions
var SUPPLEMENTAL_BUNDLE = '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';
var supplementalFiles = {};

async function unpackSupplementalFiles() {
  if (Object.keys(supplementalFiles).length > 0) return;
  try {
    var binary = Uint8Array.from(atob(SUPPLEMENTAL_BUNDLE), function (c) { return c.charCodeAt(0); });
    var ds = new DecompressionStream('gzip');
    var jsonText = await new Response(new Blob([binary]).stream().pipeThrough(ds)).text();
    supplementalFiles = JSON.parse(jsonText);
  } catch (error) {
    supplementalFiles = {};
  }
  Object.keys(supplementalFiles).forEach(function (name) {
    var bytes = textEncoder.encode(supplementalFiles[name]);
    addFile(name, bytes);
    if (name.endsWith('.clo')) {
      addFile('tex/latex/base/' + name, bytes);
      addFile('tex/latex/beamer/' + name, bytes);
    } else if (name.endsWith('.sty')) {
      addFile('tex/latex/tools/' + name, bytes);
      addFile('tex/latex/' + name.replace(/\.sty$/, '') + '/' + name, bytes);
    } else if (name.endsWith('.ldf')) {
      addFile('tex/generic/babel/' + name, bytes);
      addFile('tex/generic/babel-portuges/' + name, bytes);
      addFile('tex/generic/babel-english/' + name, bytes);
      addFile('tex/generic/babel-spanish/' + name, bytes);
    }
  });
}

async function initialize() {
  if (wasmExports) return;
  if (typeof DecompressionStream !== 'function') {
    throw new Error('This browser does not support gzip decompression required by Tectonic.');
  }
  self.postMessage({ type: 'progress', key: 'editor.loadingEngine' });
  var responses = await Promise.all([
    fetchResource(TECTONIC_ROOT + 'tectonic_wasm.wasm'),
    fetchResource(TECTONIC_ROOT + 'tectonic-bundle.tar.gz')
  ]);
  var module = await WebAssembly.compile(await responses[0].arrayBuffer());
  var result = await WebAssembly.instantiate(module, {
    env: envImports(),
    wasi_snapshot_preview1: wasiImports()
  });
  wasmExports = result.exports;
  if (wasmExports.tectonic_wasm_version() < 1) {
    throw new Error('The downloaded Tectonic WebAssembly engine has an invalid version.');
  }
  await addTarFilesFromResponse(responses[1]);
  await unpackSupplementalFiles();

  // Fallback font definition files for Latin Modern families in Tectonic WASM bundle
  var tulmssFallback = '\\ProvidesFile{tulmss.fd}[2021/07/23 v1.8a Latin Modern Sans mapped to Roman]\n' +
    '\\DeclareFontFamily{TU}{lmss}{}\n' +
    '\\DeclareFontShape{TU}{lmss}{m}{n}{<->sub*lmr/m/n}{}\n' +
    '\\DeclareFontShape{TU}{lmss}{m}{it}{<->sub*lmr/m/it}{}\n' +
    '\\DeclareFontShape{TU}{lmss}{m}{sl}{<->sub*lmr/m/it}{}\n' +
    '\\DeclareFontShape{TU}{lmss}{bx}{n}{<->sub*lmr/bx/n}{}\n' +
    '\\DeclareFontShape{TU}{lmss}{bx}{it}{<->sub*lmr/bx/it}{}\n' +
    '\\DeclareFontShape{TU}{lmss}{bx}{sl}{<->sub*lmr/bx/it}{}\n' +
    '\\DeclareFontShape{TU}{lmss}{b}{n}{<->sub*lmr/bx/n}{}\n' +
    '\\endinput';
  var tulmssData = textEncoder.encode(tulmssFallback);
  addFile('tulmss.fd', tulmssData);
  addFile('tex/latex/lm/tulmss.fd', tulmssData);

  var tulmttFallback = '\\ProvidesFile{tulmtt.fd}[2021/07/23 v1.8a Latin Modern Typewriter mapped to Roman]\n' +
    '\\DeclareFontFamily{TU}{lmtt}{}\n' +
    '\\DeclareFontShape{TU}{lmtt}{m}{n}{<->sub*lmr/m/n}{}\n' +
    '\\DeclareFontShape{TU}{lmtt}{m}{it}{<->sub*lmr/m/it}{}\n' +
    '\\DeclareFontShape{TU}{lmtt}{m}{sl}{<->sub*lmr/m/it}{}\n' +
    '\\DeclareFontShape{TU}{lmtt}{bx}{n}{<->sub*lmr/bx/n}{}\n' +
    '\\DeclareFontShape{TU}{lmtt}{bx}{it}{<->sub*lmr/bx/it}{}\n' +
    '\\DeclareFontShape{TU}{lmtt}{bx}{sl}{<->sub*lmr/bx/it}{}\n' +
    '\\DeclareFontShape{TU}{lmtt}{b}{n}{<->sub*lmr/bx/n}{}\n' +
    '\\endinput';
  var tulmttData = textEncoder.encode(tulmttFallback);
  addFile('tulmtt.fd', tulmttData);
  addFile('tex/latex/lm/tulmtt.fd', tulmttData);

  wasmExports.tectonic_create_format();
  var format = readOutput('xelatex.fmt');
  if (!format.length) {
    throw new Error('Tectonic could not prepare its XeLaTeX format.');
  }
  addFile('latex.fmt', format);
}

function addTarFiles(bytes) {
  var entries = 0;
  var offset = 0;
  while (offset + 512 <= bytes.length) {
    var header = bytes.subarray(offset, offset + 512);
    if (header.every(function (byte) { return byte === 0; })) break;
    var name = textDecoder.decode(header.subarray(0, 100)).replace(/\0.*$/, '');
    var prefix = textDecoder.decode(header.subarray(345, 500)).replace(/\0.*$/, '');
    if (prefix) name = prefix + '/' + name;
    name = name.replace(/^\.\/+/, '');
    var sizeText = textDecoder.decode(header.subarray(124, 136)).replace(/\0/g, '').trim();
    var size = sizeText ? parseInt(sizeText, 8) : 0;
    var type = header[156];
    var contentStart = offset + 512;
    if ((type === 48 || type === 0) && name && name !== 'latex.fmt' && size >= 0 && contentStart + size <= bytes.length) {
      addFile(name, bytes.subarray(contentStart, contentStart + size));
      if (name.indexOf('lmroman') !== -1 && name.endsWith('.otf')) {
        var fileData = bytes.subarray(contentStart, contentStart + size);
        var sansName = name.replace('lmroman', 'lmsans');
        addFile(sansName, fileData);
        var monoName = name.replace('lmroman', 'lmmono');
        addFile(monoName, fileData);
        if (name === 'lmroman10-regular.otf') {
          [
            'lmroman5-regular.otf', 'lmroman6-regular.otf', 'lmroman7-regular.otf', 'lmroman8-regular.otf', 'lmroman9-regular.otf',
            'lmromanslant8-regular.otf', 'lmromanslant9-regular.otf', 'lmromanslant10-regular.otf', 'lmromanslant12-regular.otf', 'lmromanslant17-regular.otf',
            'lmromancaps10-regular.otf', 'lmromanunsl10-regular.otf', 'lmromandemi10-regular.otf',
            'lmsans8-regular.otf', 'lmsans9-regular.otf', 'lmsans10-regular.otf', 'lmsans12-regular.otf', 'lmsans17-regular.otf',
            'lmsansdemicond10-regular.otf',
            'lmmono10-regular.otf', 'lmmono8-regular.otf', 'lmmono9-regular.otf', 'lmmono12-regular.otf',
            'lmmonoslant10-regular.otf', 'lmmonolt10-regular.otf', 'lmmonoltcond10-regular.otf'
          ].forEach(function (s) { addFile(s, fileData); });
        }
        if (name === 'lmroman10-bold.otf') {
          [
            'lmroman5-bold.otf', 'lmroman6-bold.otf', 'lmroman7-bold.otf', 'lmroman8-bold.otf', 'lmroman9-bold.otf',
            'lmromanslant10-bold.otf',
            'lmsans10-bold.otf', 'lmsans12-bold.otf',
            'lmmono10-bold.otf', 'lmmonolt10-bold.otf'
          ].forEach(function (s) { addFile(s, fileData); });
        }
        if (name === 'lmroman10-italic.otf') {
          [
            'lmroman8-italic.otf', 'lmroman9-italic.otf', 'lmroman12-italic.otf',
            'lmromancaps10-oblique.otf', 'lmromandemi10-oblique.otf',
            'lmsans8-oblique.otf', 'lmsans9-oblique.otf', 'lmsans10-oblique.otf', 'lmsans12-oblique.otf', 'lmsans17-oblique.otf',
            'lmsansdemicond10-oblique.otf',
            'lmmono10-italic.otf', 'lmmonolt10-oblique.otf', 'lmmono10-oblique.otf'
          ].forEach(function (s) { addFile(s, fileData); });
        }
        if (name === 'lmroman10-bolditalic.otf') {
          ['lmsans10-boldoblique.otf', 'lmmonolt10-boldoblique.otf'].forEach(function (s) { addFile(s, fileData); });
        }
      }
      // Re-add TFM files under multiple TDS paths so kpathsea can locate them.
      // Also register extensionless font names so Tectonic WASM doesn't fall back
      // to outline files (.pfb/.otf) and trigger Bad metric (TFM) errors.
      if (name.toLowerCase().endsWith('.tfm')) {
        var tfmData = bytes.subarray(contentStart, contentStart + size);
        var noExt = name.replace(/\.tfm$/i, '');
        addFile(noExt, tfmData);
        var baseNoExt = noExt.split('/').pop();
        if (baseNoExt !== noExt) addFile(baseNoExt, tfmData);
        var lower = name.toLowerCase();
        var family = lower.startsWith('ms') ? 'amsfonts' : 'cm';
        var base = 'fonts/tfm/public/' + family + '/' + name;
        var tfmPaths = [
          name,
          base,
          'fonts/tfm/' + family + '/' + name,
          'tfm/' + family + '/' + name,
          'fonts/tfm/' + name,
          'texmf-dist/' + base,
          'texmf-dist/fonts/tfm/' + family + '/' + name,
          'texmf/fonts/tfm/' + family + '/' + name,
          'texmf/fonts/tfm/public/' + family + '/' + name,
          'share/texmf/fonts/tfm/' + family + '/' + name,
          'share/texmf-dist/fonts/tfm/' + family + '/' + name
        ];
        tfmPaths.forEach(function (path) {
          if (path !== name) addFile(path, bytes.subarray(contentStart, contentStart + size));
        });
        // Beamer defaults to sans serif (cmss) which is missing from the bundle.
        // Map cmr TFM files to cmss names so beamer's \sffamily resolves to a
        // real font instead of nullfont.
        if (lower.startsWith('cm') && lower.endsWith('.tfm')) {
          var baseName = lower.replace(/^cm/, '');
          // Map cmr -> cmss (sans serif)
          if (baseName.startsWith('r')) {
            var cmssName = 'cmss' + baseName.slice(1);
            var cmssNoExt = cmssName.replace(/\.tfm$/i, '');
            addFile(cmssNoExt, tfmData);
            tfmPaths.forEach(function (path) {
              var cmssPath = path.replace(/cmr(\d+\.tfm)$/, 'cmss$1').replace(/cmr(\d+\.tfm)$/, 'cmss$1');
              if (cmssPath !== path && cmssPath !== name) addFile(cmssPath, bytes.subarray(contentStart, contentStart + size));
            });
          }
          // Map cmr -> ecrm (T1 encoded) for fontenc support
          if (baseName.startsWith('r')) {
            var m = lower.match(/^cmr(\d+)\.tfm$/);
            if (m) {
              var decipoints = parseInt(m[1], 10) * 100;
              var ecrmName = 'ecrm' + decipoints;
              addFile(ecrmName, tfmData);
              tfmPaths.forEach(function (path) {
                var ecrmPath = path.replace(/cmr(\d+\.tfm)$/, 'ecrm' + decipoints + '.tfm');
                if (ecrmPath !== path && ecrmPath !== name) addFile(ecrmPath, bytes.subarray(contentStart, contentStart + size));
              });
            }
          }
          // Map cmr -> cmtt (typewriter) for \url and similar
          if (baseName.startsWith('r')) {
            var cmttName = 'cmtt' + baseName.slice(1);
            var cmttNoExt = cmttName.replace(/\.tfm$/i, '');
            addFile(cmttNoExt, tfmData);
            tfmPaths.forEach(function (path) {
              var cmttPath = path.replace(/cmr(\d+\.tfm)$/, 'cmtt$1').replace(/cmr(\d+\.tfm)$/, 'cmtt$1');
              if (cmttPath !== path && cmttPath !== name) addFile(cmttPath, bytes.subarray(contentStart, contentStart + size));
            });
          }
          // Map cmr -> lmss (Latin Modern Sans Serif) for beamer with T1 fontenc
          if (baseName.startsWith('r')) {
            var m = lower.match(/^cmr(\d+)\.tfm$/);
            if (m) {
              var fontPt = m[1];
              var lmssName = 'lmss' + fontPt;
              addFile(lmssName, tfmData);
              tfmPaths.forEach(function (path) {
                var lmssPath = path.replace(/cmr(\d+\.tfm)$/, 'lmss' + fontPt + '.tfm');
                if (lmssPath !== path && lmssPath !== name) addFile(lmssPath, bytes.subarray(contentStart, contentStart + size));
              });
            }
          }
          // Map cmr -> cmmi (math italic) for math support
          // NOTE: skipped - cmmi*.tfm already exists in the bundle and
          // overwriting it with cmr content corrupts the font metrics.
          // cmmi files are found at their original bundle path.
        }
      }
      entries++;
    }
    offset = contentStart + Math.ceil(size / 512) * 512;
  }
  if (!entries) throw new Error('The Tectonic package bundle is empty or invalid.');
}

async function addTarFilesFromResponse(response) {
  var archive = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  addTarFiles(new Uint8Array(archive));
}

/* ---------- beamer support ---------- */

var BEAMER_GITHUB_ROOT = 'https://raw.githubusercontent.com/josephwright/beamer/master/base/';
var BEAMER_GITHUB_FILES = [
  'beamer.cls',
  'beamerbaseauxtemplates.sty',
  'beamerbaseboxes.sty',
  'beamerbasecolor.sty',
  'beamerbasecompatibility.sty',
  'beamerbasedecode.sty',
  'beamerbasefont.sty',
  'beamerbaseframe.sty',
  'beamerbaseframecomponents.sty',
  'beamerbaseframesize.sty',
  'beamerbaselocalstructure.sty',
  'beamerbasemisc.sty',
  'beamerbasemodes.sty',
  'beamerbasenavigation.sty',
  'beamerbasenavigationsymbols.tex',
  'beamerbasenotes.sty',
  'beamerbaseoptions.sty',
  'beamerbaseoverlay.sty',
  'beamerbaserequires.sty',
  'beamerbasearticle.sty',
  'beamerbasesection.sty',
  'beamerbasetemplates.sty',
  'beamerbasethemes.sty',
  'beamerbasetheorems.sty',
  'beamerbasetitle.sty',
  'beamerbasetoc.sty',
  'beamerbasetranslator.sty',
  'beamerbasetwoscreens.sty',
  'beamerbaseverbatim.sty'
];
  // Beamer default themes (loaded by beamer.cls via \usetheme{default})
  var BEAMER_DEFAULT_THEME_FILES = [
    'themes/outer/beamerouterthemedefault.sty',
    'themes/inner/beamerinnerthemedefault.sty',
    'themes/color/beamercolorthemedefault.sty',
    'themes/font/beamerfontthemedefault.sty',
    'themes/font/beamerfontthemeserif.sty',
    'themes/theme/beamerthemedefault.sty'
  ];
  // Beamer Madrid theme files (loads whale+orchid color, rounded inner, infolines outer)
  var BEAMER_MADRID_THEME_FILES = [
    'themes/theme/beamerthemeMadrid.sty',
    'themes/color/beamercolorthemewhale.sty',
    'themes/color/beamercolorthemeorchid.sty',
    'themes/inner/beamerinnerthemerounded.sty',
    'themes/outer/beamerouterthemeinfolines.sty'
  ];
  var XXCOLOR_URL = 'https://raw.githubusercontent.com/pgf-tikz/pgf/master/tex/latex/pgf/utilities/xxcolor.sty';

    // Beamer depends on the translator package (loaded via beamerbasetranslator.sty).
    // translator.sty and its dictionary files are fetched from the translator repo.
    var TRANSLATOR_GITHUB_ROOT = 'https://raw.githubusercontent.com/josephwright/translator/master/';
    var TRANSLATOR_FILES = [
      'translator.sty',
      'dictionaries/translator-basic-dictionary.sty',
      'dictionaries/translator-bibliography-dictionary.sty',
      'dictionaries/translator-environment-dictionary.sty',
      'dictionaries/translator-months-dictionary.sty',
      'dictionaries/translator-numbers-dictionary.sty',
      'dictionaries/translator-theorem-dictionary.sty'
    ];

    async function fetchBeamerFiles() {
    var allFiles = BEAMER_GITHUB_FILES
      .concat(BEAMER_DEFAULT_THEME_FILES)
      .concat(BEAMER_MADRID_THEME_FILES);
    for (var i = 0; i < allFiles.length; i++) {
      var name = allFiles[i];
      try {
        var response = await fetchResource(BEAMER_GITHUB_ROOT + name);
        var bytes = await response.arrayBuffer();
        var u8 = new Uint8Array(bytes);
        addFile(name, u8);
        var baseName = name.split('/').pop();
        if (baseName !== name) {
          addFile(baseName, u8);
          addFile('tex/latex/beamer/' + baseName, u8);
        }
        addFile('tex/latex/beamer/' + name, u8);
      } catch (error) {
        // Non-fatal: some files may not exist
      }
    }
    // Fetch translator package files (dependency of beamer)
    for (var i = 0; i < TRANSLATOR_FILES.length; i++) {
      var name = TRANSLATOR_FILES[i];
      try {
        var response = await fetchResource(TRANSLATOR_GITHUB_ROOT + name);
        var bytes = await response.arrayBuffer();
        var u8 = new Uint8Array(bytes);
        addFile(name, u8);
        var baseName = name.split('/').pop();
        if (baseName !== name) {
          addFile(baseName, u8);
          addFile('tex/latex/translator/' + baseName, u8);
        }
        addFile('tex/latex/translator/' + name, u8);
      } catch (error) {
        // Non-fatal: some files may not exist
      }
    }

    // Beamer's enumerate environment may require enumerate.sty which is not
    // in the Tectonic WASM bundle. Provide a minimal stub.
    addFile('enumerate.sty', new TextEncoder().encode('\\ProvidesPackage{enumerate}[2000/08/01]\\endinput'));
    addFile('tex/latex/enumerate/enumerate.sty', new TextEncoder().encode('\\ProvidesPackage{enumerate}[2000/08/01]\\endinput'));

    // Stubs for amssymb and amsfonts: XeLaTeX uses OpenType math fonts (Latin Modern),
    // and 8-bit msbm TFM metrics do not exist in the Tectonic WASM bundle.
    var amsStub = new TextEncoder().encode('\\ProvidesPackage{amssymb}[2013/01/14 v3.01]\\endinput');
    addFile('amssymb.sty', amsStub);
    addFile('tex/latex/amssymb/amssymb.sty', amsStub);
    var amsFontsStub = new TextEncoder().encode('\\ProvidesPackage{amsfonts}[2013/01/14 v3.01]\\endinput');
    addFile('amsfonts.sty', amsFontsStub);
    addFile('tex/latex/amsfonts/amsfonts.sty', amsFontsStub);

    // Provide tulmss.fd fallback mapping TU/lmss to lmr to prevent missing font metric fallbacks
    var tulmssFallback = '\\ProvidesFile{tulmss.fd}[2021/07/23 v1.8a Latin Modern Sans mapped to Roman]\n' +
      '\\DeclareFontFamily{TU}{lmss}{}\n' +
      '\\DeclareFontShape{TU}{lmss}{m}{n}{<->sub*lmr/m/n}{}\n' +
      '\\DeclareFontShape{TU}{lmss}{m}{it}{<->sub*lmr/m/it}{}\n' +
      '\\DeclareFontShape{TU}{lmss}{m}{sl}{<->sub*lmr/m/it}{}\n' +
      '\\DeclareFontShape{TU}{lmss}{bx}{n}{<->sub*lmr/bx/n}{}\n' +
      '\\DeclareFontShape{TU}{lmss}{bx}{it}{<->sub*lmr/bx/it}{}\n' +
      '\\DeclareFontShape{TU}{lmss}{bx}{sl}{<->sub*lmr/bx/it}{}\n' +
      '\\DeclareFontShape{TU}{lmss}{b}{n}{<->sub*lmr/bx/n}{}\n' +
      '\\endinput';
    var tulmssData = new TextEncoder().encode(tulmssFallback);
    addFile('tulmss.fd', tulmssData);
    addFile('tex/latex/lm/tulmss.fd', tulmssData);

    try {
      var response = await fetchResource(XXCOLOR_URL);
      var bytes = await response.arrayBuffer();
      addFile('xxcolor.sty', new Uint8Array(bytes));
      addFile('tex/latex/beamer/xxcolor.sty', new Uint8Array(bytes));
    } catch (error) {
      // Non-fatal
    }
    // size11.clo and size12.clo are provided by unpackSupplementalFiles
  }

function sourceUsesBeamer(sourceText) {
  return /\\documentclass\s*(\[[^\]]*\])?\s*\{beamer\}/.test(sourceText);
}

function readOutput(name) {
  var nameBytes = textEncoder.encode(name);
  var namePointer = allocate(nameBytes);
  try {
    var size = wasmExports.tectonic_get_output_size(namePointer, nameBytes.length);
    if (!size) return new Uint8Array(0);
    var outputPointer = wasmExports.malloc(size);
    if (!outputPointer) throw new Error('Tectonic could not allocate output memory.');
    try {
      var copied = wasmExports.tectonic_get_output(namePointer, nameBytes.length, outputPointer, size);
      return new Uint8Array(wasmExports.memory.buffer, outputPointer, copied).slice();
    } finally {
      wasmExports.free(outputPointer);
    }
  } finally {
    wasmExports.free(namePointer);
  }
}

function stripBeamerPackages(source) {
  // inputenc, fontenc, babel, amsfonts, amssymb are incompatible with XeLaTeX TFM metrics in this bundle
  ['inputenc', 'fontenc', 'babel', 'amsfonts', 'amssymb'].forEach(function (pkg) {
    source = removePackage(source, pkg);
  });
  return source;
}

function stripMathPackages(source) {
  // Packages that require TFM font metrics missing from the Tectonic WASM
  // bundle are stripped to avoid cascading font errors. unicode-math with
  // OTF fonts (available in the bundle) provides math support instead.
  return stripFontDependentPackages(source);
}

// Removes a \usepackage/\RequirePackage declaration that lists the given
// package name among the (possibly comma separated) package list.
function removePackage(source, packageName) {
  return source.replace(/\\(?:usepackage|RequirePackage)(?:\s*\[[^\]]*\])?\s*\{([^}]*)\}/g, function (match, list) {
    var tokens = list.split(/\s*,\s*/);
    var kept = tokens.filter(function (t) { return t !== packageName; });
    if (kept.length === 0) return '';
    return match.replace(list, kept.join(', '));
  });
}

// Packages that depend on TFM font metrics that are not present in the
// Tectonic WASM bundle. Loading them makes LaTeX fall back to nullfont,
// which silently drops every character and yields blank pages.
var FONT_DEPENDENT_PACKAGES = [
  'inputenc',
  'fontenc',
  'lmodern',
  'amsmath',
  'amsfonts',
  'amssymb',
  'textcomp',
  'upgreek'
];

function stripFontDependentPackages(source) {
  return FONT_DEPENDENT_PACKAGES.reduce(removePackage, source);
}

function prepareMathSource(files, mainFile) {
  var source = files[mainFile];
  if (!source) return source;
  // Fix \\ followed by [ being parsed as \\[<length>]
  source = source.replace(/\\\\(\s*\[)/g, function (_, bracket) { return '\\\\\\relax' + bracket; });
  // Provide \\HUGE if used
  if (/\\HUGE\b/.test(source) && !/\\(?:re)?newcommand\*?\{\\HUGE\}/.test(source)) {
    source = source.replace(/\\begin\{document\}/, '\\providecommand{\\HUGE}{\\Huge}\n\\begin{document}');
  }
  // Beamer has its own font system; do not inject fontspec.
  // Strip packages that need TFM font metrics missing from the WASM bundle.
  if (/\\documentclass\s*(\[[^\]]*\])?\s*\{beamer\}/.test(source)) {
    // Beamer brings its own font setup; only the TFM-dependent packages are
    // removed and the sans-serif default is redirected to an available font.
    return stripBeamerPackages(source);
  }
  // Strip amsmath/amssymb for all documents; unicode-math provides math support
  source = stripMathPackages(source);
  // Provide stub .ldf files for any requested babel languages not bundled
  var babelMatch = source.match(/\\(?:usepackage|RequirePackage)(?:\s*\[([^\]]*)\])?\s*\{[^}]*\bbabel\b[^}]*\}/);
  if (babelMatch && babelMatch[1]) {
    var langs = babelMatch[1].split(/\s*,\s*/);
    langs.forEach(function (lang) {
      lang = lang.trim();
      if (!lang || lang.indexOf('=') !== -1) return;
      var ldfName = lang + '.ldf';
      if (!supplementalFiles[ldfName]) {
        var stub = '\\ProvidesLanguage{' + lang + '}\\input{nil.ldf}\\endinput';
        var stubBytes = textEncoder.encode(stub);
        addFile(ldfName, stubBytes);
        addFile('tex/generic/babel/' + ldfName, stubBytes);
      }
    });
  }
  var projectSource = Object.keys(files).map(function (name) { return files[name]; }).join('\n');
  if (!/\$|\\\(|\\\[|\\begin\s*\{(?:equation|align(?:at)?|flalign|gather|multline|displaymath|math|eqnarray)\*?\}/.test(projectSource)) return source;
  if (/\\(?:usepackage|RequirePackage)(?:\s*\[[^\]]*\])?\s*\{[^}]*\bunicode-math\b/.test(projectSource)) return source;
  // Do NOT inject fontspec/unicode-math for non-beamer documents: the Tectonic
  // WASM bundle lacks TFM metric files for Computer Modern math fonts
  // (cmmi, cmsy, cmex), and fontspec/unicode-math would fail to load them.
  // Let XeLaTeX use its default Computer Modern fonts (cmr/cmmi/cmsy/cmex)
  // which are present in the bundle.
  return source;
}

async function compileDocument(message) {
  outputLog = '';
  var files = message.files || {};
  Object.keys(files).forEach(function (name) {
    addFile(name, textEncoder.encode(files[name]));
  });
  var source = files[message.mainFile];
  if (typeof source !== 'string') throw new Error('The active TeX source file is missing.');
  if (sourceUsesBeamer(source)) await fetchBeamerFiles();
  source = prepareMathSource(files, message.mainFile);
  var inputBytes = textEncoder.encode(source);
  var inputPointer = allocate(inputBytes);
  var engineFailure = null;
  try {
    wasmExports.tectonic_set_input(inputPointer, inputBytes.length);
    wasmExports.tectonic_compile();
  } catch (error) {
    engineFailure = error;
  } finally {
    wasmExports.free(inputPointer);
  }
  var texLog = textDecoder.decode(readOutput('texput.log'));
  if (engineFailure) {
    var failure = new Error(engineFailure && engineFailure.message ? engineFailure.message : String(engineFailure));
    failure.log = texLog || outputLog;
    throw failure;
  }
  var pdf = readOutput('texput.pdf');
  if (pdf.length < 5 || textDecoder.decode(pdf.subarray(0, 5)) !== '%PDF-') {
    var invalid = new Error('Tectonic did not produce a valid PDF.');
    invalid.log = texLog || outputLog;
    throw invalid;
  }
  var compileLog = texLog || outputLog;
  return {
    pdf: pdf.buffer,
    log: compileLog.slice(-20000),
    errors: (function () {
      var allErrors = compileLog.match(/^!.*$/gm) || [];
      var realErrors = allErrors.filter(function (e) {
        return !/! Font .* not loadable/i.test(e) && !/! \\textfont .* is undefined/i.test(e);
      });
      return new Set(realErrors).size;
    })(),
    warnings: new Set(compileLog.match(/^LaTeX Warning:.*$/gm) || []).size
  };
}

self.addEventListener('message', async function (event) {
  var message = event.data;
  if (!message || message.type !== 'compile') return;
  try {
    await initialize();
    var result = await compileDocument(message);
    self.postMessage({
      type: 'result',
      id: message.id,
      pdf: result.pdf,
      log: result.log,
      errors: result.errors,
      warnings: result.warnings
    }, [result.pdf]);
  } catch (error) {
    self.postMessage({
      type: 'error',
      id: message.id,
      message: error && error.message ? error.message : String(error),
      log: error.log || outputLog
    });
  }
});
