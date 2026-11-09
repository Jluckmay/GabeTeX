import fs from 'fs';

let html = fs.readFileSync('docs/index.html', 'utf8');

// 1. Update .themed-shot CSS to add border-radius and box-shadow
const oldThemedCss = `.themed-shot { display: none; width: 100%; height: auto; }`;
const newThemedCss = `.themed-shot {
  display: none; width: 100%; height: auto;
  border-radius: clamp(12px, 1.4vw, 18px);
  box-shadow: 0 24px 60px -12px rgba(0, 0, 0, .45), 0 0 0 1px var(--hairline-strong);
}`;

if (!html.includes(oldThemedCss)) {
  throw new Error('oldThemedCss not found');
}
html = html.replace(oldThemedCss, newThemedCss);

// 2. Update height attribute for project and sync images (1640 -> 1576)
html = html.replace(/assets\/screenshots\/(project|sync)-([a-z-]+)\.png" width="2600" height="1640"/g, 'assets/screenshots/$1-$2.png" width="2600" height="1576"');

// 3. Update height attribute for welcome images (1400 -> 1336)
html = html.replace(/assets\/screenshots\/welcome-([a-z-]+)\.png" width="2000" height="1400"/g, 'assets/screenshots/welcome-$1.png" width="2000" height="1336"');

fs.writeFileSync('docs/index.html', html, 'utf8');
console.log('docs/index.html updated successfully with rounded corners and updated dimensions!');
