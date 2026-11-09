'use strict';

var dictionaryRoot = 'https://cdn.jsdelivr.net/npm/';
var checkers = Object.create(null);

async function loadChecker(language) {
  if (checkers[language]) return checkers[language];
  var packageName = language === 'pt' ? 'dictionary-pt@4.0.0' : 'dictionary-en@4.0.0';
  var dictionaryUrl = dictionaryRoot + packageName + '/index.';
  var promise = Promise.race([
    Promise.all([
      import('https://cdn.jsdelivr.net/npm/typo-js@1.4.0/+esm'),
      fetch(dictionaryUrl + 'aff').then(function (response) {
        if (!response.ok) throw new Error('Dictionary download failed (HTTP ' + response.status + ').');
        return response.text();
      }),
      fetch(dictionaryUrl + 'dic').then(function (response) {
        if (!response.ok) throw new Error('Dictionary download failed (HTTP ' + response.status + ').');
        return response.text();
      })
    ]),
    new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error('Dictionary load timeout.')); }, 15000);
    })
  ]).then(function (resources) {
    var Typo = resources[0].default;
    if (typeof Typo !== 'function') throw new Error('Spell checker module is invalid.');
    return new Typo(language === 'pt' ? 'pt_BR' : 'en_US', resources[1], resources[2]);
  }).catch(function (error) {
    delete checkers[language];
    throw error;
  });
  checkers[language] = promise;
  return promise;
}

self.addEventListener('message', async function (event) {
  var message = event.data;
  if (!message || message.type !== 'check') return;

  try {
    var checker = await loadChecker(message.language);
    var locale = message.language === 'pt' ? 'pt-BR' : 'en-US';
    var ignored = new Set(message.ignoredWords || []);
    var grouped = Object.create(null);
    (message.words || []).forEach(function (token) {
      if (token.word.length > 40 || /\d/.test(token.word) || /^[A-Z]{2,}$/.test(token.word)) return;
      var key = token.word.toLocaleLowerCase(locale);
      if (ignored.has(key) || checker.check(token.word)) return;
      if (!grouped[key]) grouped[key] = { word: token.word, positions: [], suggestions: [] };
      grouped[key].positions.push({
        start: token.start,
        end: token.end,
        line: token.line
      });
    });

    var issues = Object.keys(grouped).map(function (key) { return grouped[key]; });
    issues.forEach(function (issue) {
      issue.suggestions = checker.suggest(issue.word).slice(0, 3);
    });
    var occurrences = issues.reduce(function (total, issue) { return total + issue.positions.length; }, 0);
    self.postMessage({
      type: 'result',
      id: message.id,
      language: message.language,
      fileName: message.fileName,
      issues: issues.slice(0, 100),
      occurrences: occurrences
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      id: message.id,
      message: error && error.message ? error.message : String(error)
    });
  }
});
