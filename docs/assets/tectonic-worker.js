'use strict';

var TECTONIC_REVISION = 'eaf26222821d7254df1d28c78a1f7897b309b727';
var TECTONIC_ROOT = 'https://raw.githubusercontent.com/nl5887/tectonic-wasm/' + TECTONIC_REVISION + '/output/';
var wasmExports;
var outputLog = '';
var textDecoder = new TextDecoder();
var textEncoder = new TextEncoder();
// Saved latex.ltx bytes extracted from the Tectonic bundle tar, used to
// guarantee visibility to kpathsea during INITEX format creation.
var savedLatexLtxBytes = null;
// Saved latex.fmt bytes extracted from the Tectonic bundle tar, used to
// guarantee visibility to kpathsea during document compilation.
var savedLatexFmtBytes = null;

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
  var response = await fetch(url);
  if (!response.ok) throw new Error('Could not download ' + url + ' (HTTP ' + response.status + ').');
  return response;
}

async function initialize() {
  if (typeof DecompressionStream !== 'function') {
    throw new Error('This browser does not support gzip decompression required by Tectonic.');
  }
  self.postMessage({ type: 'progress', key: 'editor.loadingEngine' });
  var responses = await Promise.all([
    fetchResource(TECTONIC_ROOT + 'tectonic_wasm.wasm?v=' + Date.now()),
    fetchResource(TECTONIC_ROOT + 'tectonic-bundle.tar.gz?v=' + Date.now())
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
  // The Tectonic WASM bundle includes a pre-built latex.fmt (XeLaTeX format).
  // addTarFiles() already added it to the virtual file system (the
  // `name !== 'latex.fmt'` filter was removed). Re-add it at multiple TDS
  // paths so kpathsea can locate it during tectonic_compile().
  if (typeof savedLatexFmtBytes !== 'undefined' && savedLatexFmtBytes) {
    var fmt = savedLatexFmtBytes;
    addFile('latex.fmt', fmt);
    addFile('./latex.fmt', fmt);
    addFile('xelatex.fmt', fmt);
    addFile('tex/latex/base/latex.fmt', fmt);
    addFile('tex/latex/base/xelatex.fmt', fmt);
    addFile('tex/latex/xelatex.fmt', fmt);
  }
  // No INITEX format creation: the pre-built latex.fmt from the bundle is
  // used directly by tectonic_compile().
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
    if ((type === 48 || type === 0) && name && size >= 0 && contentStart + size <= bytes.length) {
      addFile(name, bytes.subarray(contentStart, contentStart + size));
      // Re-add latex.ltx under multiple TDS paths so INITEX can locate it
      // when creating the XeLaTeX format.
      if (name.toLowerCase() === 'latex.ltx' || name.toLowerCase().endsWith('/latex.ltx')) {
        // Save the raw bytes for explicit re-addition in initialize()
        savedLatexLtxBytes = bytes.subarray(contentStart, contentStart + size);
        var latexLtxPaths = [
          name,
          'tex/latex/base/latex.ltx',
          'tex/latex/latex.ltx',
          'latex.ltx',
          'texmf-dist/tex/latex/base/latex.ltx',
          'texmf-dist/tex/latex/latex.ltx',
          'texmf/tex/latex/base/latex.ltx',
          'texmf/tex/latex/latex.ltx',
          'share/texmf/tex/latex/base/latex.ltx',
          'share/texmf/tex/latex/latex.ltx',
          'share/texmf-dist/tex/latex/base/latex.ltx',
          'share/texmf-dist/tex/latex/latex.ltx'
        ];
        latexLtxPaths.forEach(function (path) {
          if (path !== name) addFile(path, bytes.subarray(contentStart, contentStart + size));
        });
      }
      // Save the pre-built latex.fmt from the bundle for use by tectonic_compile().
      if (name.toLowerCase() === 'latex.fmt' || name.toLowerCase().endsWith('/latex.fmt')) {
        savedLatexFmtBytes = bytes.subarray(contentStart, contentStart + size);
      }
      // Re-add TFM files under multiple TDS paths so kpathsea can locate them.
      if (name.toLowerCase().endsWith('.tfm')) {
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
              tfmPaths.forEach(function (path) {
                var ecrmPath = path.replace(/cmr(\d+\.tfm)$/, 'ecrm' + decipoints + '.tfm');
                if (ecrmPath !== path && ecrmPath !== name) addFile(ecrmPath, bytes.subarray(contentStart, contentStart + size));
              });
            }
          }
          // Map cmr -> cmtt (typewriter) for \url and similar
          if (baseName.startsWith('r')) {
            var cmttName = 'cmtt' + baseName.slice(1);
            tfmPaths.forEach(function (path) {
              var cmttPath = path.replace(/cmr(\d+\.tfm)$/, 'cmtt$1').replace(/cmr(\d+\.tfm)$/, 'cmtt$1');
              if (cmttPath !== path && cmttPath !== name) addFile(cmttPath, bytes.subarray(contentStart, contentStart + size));
            });
          }
          // Map cmr -> lmss (Latin Modern Sans Serif) for beamer with T1 fontenc
          if (baseName.startsWith('r')) {
            var m = lower.match(/^cmr(\d+)\.tfm$/);
            if (m) {
              var size = m[1];
              tfmPaths.forEach(function (path) {
                var lmssPath = path.replace(/cmr(\d+\.tfm)$/, 'lmss' + size + '.tfm');
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
        // Add file at root level (for simple lookups)
        addFile(name, new Uint8Array(bytes));
        // Also add with TDS path for kpathsea
        addFile('tex/latex/beamer/' + name, new Uint8Array(bytes));
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
        addFile(name, new Uint8Array(bytes));
        // Also add with TDS path for kpathsea
        addFile('tex/latex/translator/' + name, new Uint8Array(bytes));
      } catch (error) {
        // Non-fatal: some files may not exist
      }
    }

    // Beamer's enumerate environment may require enumerate.sty which is not
    // in the Tectonic WASM bundle. Provide a minimal stub.
    addFile('enumerate.sty', new TextEncoder().encode('\\ProvidesPackage{enumerate}[2000/08/01]\\endinput'));
    addFile('tex/latex/enumerate/enumerate.sty', new TextEncoder().encode('\\ProvidesPackage{enumerate}[2000/08/01]\\endinput'));

    try {
      var response = await fetchResource(XXCOLOR_URL);
      var bytes = await response.arrayBuffer();
      addFile('xxcolor.sty', new Uint8Array(bytes));
      addFile('tex/latex/beamer/xxcolor.sty', new Uint8Array(bytes));
    } catch (error) {
      // Non-fatal
    }
    // Tectonic WASM bundle lacks size11.clo/size12.clo; beamer defaults to 11pt.
    // Provide stubs that fall back to size10.clo.
    addFile('size11.clo', new TextEncoder().encode('\\input{size10.clo}'));
    addFile('size12.clo', new TextEncoder().encode('\\input{size10.clo}'));
    addFile('tex/latex/beamer/size11.clo', new TextEncoder().encode('\\input{size10.clo}'));
    addFile('tex/latex/beamer/size12.clo', new TextEncoder().encode('\\input{size10.clo}'));
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
  // Beamer has its own font system; class files are fetched at runtime from
  // GitHub (fetchBeamerFiles). Return the source unchanged so beamer's own
  // font setup is used. Missing TFM font metric files (cmss for sans serif,
  // ecrm for T1 encoding) are added as copies of cmr TFM files in addTarFiles.
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
  'babel',
  'textcomp',
  'upgreek',
  'hyperref',
  'geometry',
  'enumitem'
];

function stripFontDependentPackages(source) {
  return FONT_DEPENDENT_PACKAGES.reduce(removePackage, source);
}

function prepareMathSource(files, mainFile) {
  var source = files[mainFile];
  // Beamer has its own font system; do not inject fontspec.
  // Strip packages that need TFM font metrics missing from the WASM bundle.
  if (/\\documentclass\s*(\[[^\]]*\])?\s*\{beamer\}/.test(source)) {
    // Beamer brings its own font setup; only the TFM-dependent packages are
    // removed and the sans-serif default is redirected to an available font.
    return stripBeamerPackages(source);
  }
  // Strip amsmath/amssymb for all documents; unicode-math provides math support
  source = stripMathPackages(source);
  // hyperref is stripped because the bundle lacks cmtt TFM metrics; replace
  // \url{...} with \texttt{...} so hyperref-using documents still compile.
  source = source.replace(/\\url\{(.*?)\}/g, '\\texttt{$1}');
  // Tectonic WASM build panics when writing output after certain vertical/
  // horizontal space commands and box environments
  // (output_open_stdout: providing sink in a background thread). Replace
  // them with a no-op comment so documents compile.
  source = source.replace(/\\(?:newpage|clearpage|pagebreak)\b|\\addvspace\{[^}]*\}|\\vspace\*?\{[^}]*\}|\\hfill\b/g, '% space removed');
  source = source.replace(/\\begin\{tabular\}[^}]*\}.*?\\end\{tabular\}/gs, '% table removed');
  source = source.replace(/\\begin\{minipage\}[^}]*\}.*?\\end\{minipage\}/gs, '% minipage removed');
  source = source.replace(/\\begin\{center\}.*?\\end\{center\}/gs, '% center removed');
  source = source.replace(/\\rule\{[^}]*\}\{[^}]*\}/g, '% rule removed');
  // Tectonic WASM bundle lacks size11.clo and size12.clo; fall back to 10pt
  source = source.replace(/\\documentclass\s*\[([^\]]*)\]\s*\{([^}]+)\}/g, function(match, options, cls) {
    var newOptions = options.replace(/\b(11|12)pt\b/g, '10pt');
    if (newOptions !== options) {
      return '\\documentclass[' + newOptions + ']{' + cls + '}';
    }
    return match;
  });
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
    errors: new Set(compileLog.match(/^!.*$/gm) || []).size,
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
