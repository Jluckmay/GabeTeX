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

function prepareMathSource(files, mainFile) {
  var source = files[mainFile];
  // Beamer has its own font system; do not inject fontspec.
  if (/\\documentclass\s*(\[[^\]]*\])?\s*\{beamer\}/.test(source)) return source;
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

  var mathSetup = '\n\\usepackage{unicode-math}\n\\setmathfont{latinmodern-math.otf}\n';
  var fontspecPackage = /\\(?:usepackage|RequirePackage)(?:\s*\[[^\]]*\])?\s*\{[^}]*\bfontspec\b[^}]*\}/.exec(source);
  if (fontspecPackage) {
    var packageEnd = fontspecPackage.index + fontspecPackage[0].length;
    return source.slice(0, packageEnd) + mathSetup + source.slice(packageEnd);
  }
  if (/\\(?:usepackage|RequirePackage)(?:\s*\[[^\]]*\])?\s*\{[^}]*\bfontspec\b/.test(projectSource)) return source;

  var documentClass = /\\documentclass(?:\s*\[[^\]]*\])?\s*\{[^}]+\}/.exec(source);
  if (!documentClass) return source;
  var classEnd = documentClass.index + documentClass[0].length;
  var fontSetup = '\n\\usepackage{fontspec}\n\\setmainfont{lmroman10-regular.otf}' + mathSetup;
  return source.slice(0, classEnd) + fontSetup + source.slice(classEnd);
}

function compileDocument(message) {
  outputLog = '';
  var files = message.files || {};
  Object.keys(files).forEach(function (name) {
    addFile(name, textEncoder.encode(files[name]));
  });
  var source = files[message.mainFile];
  if (typeof source !== 'string') throw new Error('The active TeX source file is missing.');
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
    var result = compileDocument(message);
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
