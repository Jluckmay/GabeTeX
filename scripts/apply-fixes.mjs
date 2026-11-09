import fs from 'fs';

let html = fs.readFileSync('docs/index.html', 'utf8');

// 1. Fix head language resolution and attribute
const oldHeadLang = `  if (lang !== 'en' && lang !== 'pt') {
    lang = 'en';
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).toLowerCase();
      if (l.indexOf('pt') === 0) { lang = 'pt'; break; }
      if (l.indexOf('en') === 0) break;
    }
  }
  d.setAttribute('data-lang', lang);`;

const newHeadLang = `  if (lang !== 'en' && lang !== 'pt') {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).toLowerCase();
      if (l.indexOf('pt') === 0) { lang = 'pt'; break; }
      if (l.indexOf('en') === 0) { lang = 'en'; break; }
    }
  }
  lang = lang === 'pt' ? 'pt' : 'en';
  d.setAttribute('data-lang', lang);`;

// 2. Fix theme initialization to explicitly add .light class if not dark
const oldHeadTheme = `  if (isDark) {
    root.classList.add('dark');
    if (toggle) toggle.setAttribute('aria-pressed', 'true');
  } else if (saved === 'light') {
    root.classList.add('light');
  }`;

const newHeadTheme = `  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    if (toggle) toggle.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }`;

// 3. Fix theme tokens in :root, @media (prefers-color-scheme: light), html.dark, and html.light
// Replace in :root
const oldRootTokens = `  --tile: #0b0b0b;
  --tile-raised: #050505;
  --paper: #0d0d0d;
  --ink: #ebebeb;
  --ink-2: #aaa;
  --ink-3: rgba(235, 235, 235, .38);
  --on-tile: #080808;
  --on-tile-2: #aaa;`;

const newRootTokens = `  --tile: #111113;
  --tile-raised: #09090b;
  --paper: #ffffff;
  --ink: #ebebeb;
  --ink-2: #aaa;
  --ink-3: rgba(235, 235, 235, .38);
  --on-tile: #f5f5f7;
  --on-tile-2: #a1a1a6;`;

// Replace in @media (prefers-color-scheme: light)
const oldLightMediaTokens = `    --tile: #d9d9d9;
    --tile-raised: #f5f5f7;
    --paper: #ffffff;
    --ink: #1a1a1a;
    --ink-2: #666;
    --ink-3: rgba(26, 26, 26, .38);
    --on-tile: #eaeaea;
    --on-tile-2: #666;`;

const newLightMediaTokens = `    --tile: #18181b;
    --tile-raised: #0f0f11;
    --paper: #ffffff;
    --ink: #1a1a1a;
    --ink-2: #666;
    --ink-3: rgba(26, 26, 26, .38);
    --on-tile: #f5f5f7;
    --on-tile-2: #a1a1a6;`;

// Replace in html.dark
const oldDarkClassTokens = `html.dark {
  --canvas: #050505;
  --alt: #080808;
  --raised: #0d0d0d;
  --tile: #0b0b0b;
  --tile-raised: #050505;
  --paper: #0d0d0d;
  --ink: #ebebeb;
  --ink-2: #aaa;
  --ink-3: rgba(235, 235, 235, .38);
  --on-tile: #080808;
  --on-tile-2: #aaa;`;

const newDarkClassTokens = `html.dark {
  --canvas: #050505;
  --alt: #080808;
  --raised: #0d0d0d;
  --tile: #111113;
  --tile-raised: #09090b;
  --paper: #ffffff;
  --ink: #ebebeb;
  --ink-2: #aaa;
  --ink-3: rgba(235, 235, 235, .38);
  --on-tile: #f5f5f7;
  --on-tile-2: #a1a1a6;`;

// Replace in html.light
const oldLightClassTokens = `html.light {
  --canvas: #f5f5f7;
  --alt: #eaeaea;
  --raised: #ffffff;
  --tile: #d9d9d9;
  --tile-raised: #f5f5f7;
  --paper: #ffffff;
  --ink: #1a1a1a;
  --ink-2: #666;
  --ink-3: rgba(26, 26, 26, .38);
  --on-tile: #eaeaea;
  --on-tile-2: #666;`;

const newLightClassTokens = `html.light {
  --canvas: #f5f5f7;
  --alt: #eaeaea;
  --raised: #ffffff;
  --tile: #18181b;
  --tile-raised: #0f0f11;
  --paper: #ffffff;
  --ink: #1a1a1a;
  --ink-2: #666;
  --ink-3: rgba(26, 26, 26, .38);
  --on-tile: #f5f5f7;
  --on-tile-2: #a1a1a6;`;

// 4. Remove dark media query override on .src::after so it smoothly uses var(--tile-raised)
const oldSrcAfter = `@media (prefers-color-scheme: dark) { .src::after { background: linear-gradient(rgba(0, 0, 0, 0), #000); } }`;

// 5. Fix hero images: remove loading="lazy" from the hero above the fold, and add fetchpriority="high"
const oldHeroImages = `    <figure class="hero-shot h-5" style="margin-bottom:0">
      <img class="themed-shot shot-dark-pt" src="assets/screenshots/project-dark-pt.png" width="2600" height="1640" decoding="async" fetchpriority="high"
           alt="A janela de projeto do GabeTeX: a barra lateral de arquivos à esquerda, o editor LaTeX no meio e a pré-visualização do PDF ao vivo à direita."
           data-i18n-attr="alt:shots.projectAlt">
      <img class="themed-shot shot-light-pt" src="assets/screenshots/project-light-pt.png" width="2600" height="1640" decoding="async" loading="lazy"
           alt="A janela de projeto do GabeTeX: a barra lateral de arquivos à esquerda, o editor LaTeX no meio e a pré-visualização do PDF ao vivo à direita."
           data-i18n-attr="alt:shots.projectAlt">
      <img class="themed-shot shot-dark-en" src="assets/screenshots/project-dark-en.png" width="2600" height="1640" decoding="async" loading="lazy"
           alt="The GabeTeX project window: the file sidebar on the left, the LaTeX editor in the middle and the live PDF preview on the right."
           data-i18n-attr="alt:shots.projectAlt">
      <img class="themed-shot shot-light-en" src="assets/screenshots/project-light-en.png" width="2600" height="1640" decoding="async" loading="lazy"
           alt="The GabeTeX project window: the file sidebar on the left, the LaTeX editor in the middle and the live PDF preview on the right."
           data-i18n-attr="alt:shots.projectAlt">`;

const newHeroImages = `    <figure class="hero-shot h-5" style="margin-bottom:0">
      <img class="themed-shot shot-dark-pt" src="assets/screenshots/project-dark-pt.png" width="2600" height="1640" fetchpriority="high"
           alt="A janela de projeto do GabeTeX: a barra lateral de arquivos à esquerda, o editor LaTeX no meio e a pré-visualização do PDF ao vivo à direita."
           data-i18n-attr="alt:shots.projectAlt">
      <img class="themed-shot shot-light-pt" src="assets/screenshots/project-light-pt.png" width="2600" height="1640" fetchpriority="high"
           alt="A janela de projeto do GabeTeX: a barra lateral de arquivos à esquerda, o editor LaTeX no meio e a pré-visualização do PDF ao vivo à direita."
           data-i18n-attr="alt:shots.projectAlt">
      <img class="themed-shot shot-dark-en" src="assets/screenshots/project-dark-en.png" width="2600" height="1640" fetchpriority="high"
           alt="The GabeTeX project window: the file sidebar on the left, the LaTeX editor in the middle and the live PDF preview on the right."
           data-i18n-attr="alt:shots.projectAlt">
      <img class="themed-shot shot-light-en" src="assets/screenshots/project-light-en.png" width="2600" height="1640" fetchpriority="high"
           alt="The GabeTeX project window: the file sidebar on the left, the LaTeX editor in the middle and the live PDF preview on the right."
           data-i18n-attr="alt:shots.projectAlt">`;

// Normalise helper for CRLF / LF
function replaceChunk(source, oldChunk, newChunk) {
  const normSource = source.replace(/\r\n/g, '\n');
  const normOld = oldChunk.replace(/\r\n/g, '\n');
  const normNew = newChunk.replace(/\r\n/g, '\n');
  if (!normSource.includes(normOld)) {
    throw new Error('Target chunk not found:\n' + normOld.slice(0, 80));
  }
  const replaced = normSource.replace(normOld, normNew);
  return source.includes('\r\n') ? replaced.replace(/\n/g, '\r\n') : replaced;
}

html = replaceChunk(html, oldHeadLang, newHeadLang);
console.log('1. Head lang updated');
html = replaceChunk(html, oldHeadTheme, newHeadTheme);
console.log('2. Head theme updated');
html = replaceChunk(html, oldRootTokens, newRootTokens);
console.log('3. Root tokens updated');
html = replaceChunk(html, oldLightMediaTokens, newLightMediaTokens);
console.log('4. Light media tokens updated');
html = replaceChunk(html, oldDarkClassTokens, newDarkClassTokens);
console.log('5. Dark class tokens updated');
html = replaceChunk(html, oldLightClassTokens, newLightClassTokens);
console.log('6. Light class tokens updated');
html = replaceChunk(html, oldSrcAfter, '/* .src::after uses var(--tile-raised) */');
console.log('7. Src after updated');
html = replaceChunk(html, oldHeroImages, newHeroImages);
console.log('8. Hero images updated');

fs.writeFileSync('docs/index.html', html, 'utf8');
console.log('All fixes written successfully to docs/index.html!');
