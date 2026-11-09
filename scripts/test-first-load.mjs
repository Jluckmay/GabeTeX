import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Start a simple static server for docs/
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join('docs', reqPath.replace(/^\//, ''));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mime = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8765, async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'pt-BR',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8765/');
  await page.waitForTimeout(500);

  const info1 = await page.evaluate(() => {
    const root = document.documentElement;
    const imgs = Array.from(document.querySelectorAll('.hero-shot img')).map(img => ({
      cls: img.className,
      src: img.src,
      display: window.getComputedStyle(img).display,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
    }));
    return {
      step: 'first-load-pt',
      dataLang: root.getAttribute('data-lang'),
      htmlClass: root.className,
      imgs,
    };
  });
  console.log('FIRST LOAD (PT):', JSON.stringify(info1, null, 2));
  await page.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch/first-load-pt.png' });

  // Now test with English locale
  const contextEn = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  });
  const pageEn = await contextEn.newPage();
  await pageEn.goto('http://127.0.0.1:8765/');
  await pageEn.waitForTimeout(500);

  const infoEn = await pageEn.evaluate(() => {
    const root = document.documentElement;
    const imgs = Array.from(document.querySelectorAll('.hero-shot img')).map(img => ({
      cls: img.className,
      src: img.src,
      display: window.getComputedStyle(img).display,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
    }));
    return {
      step: 'first-load-en',
      dataLang: root.getAttribute('data-lang'),
      htmlClass: root.className,
      imgs,
    };
  });
  console.log('FIRST LOAD (EN):', JSON.stringify(infoEn, null, 2));
  await pageEn.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch/first-load-en.png' });

  // Now switch language to PT on the EN page
  await pageEn.click('button[data-setlang="pt"]');
  await pageEn.waitForTimeout(500);
  const infoAfterSwitch = await pageEn.evaluate(() => {
    const root = document.documentElement;
    const imgs = Array.from(document.querySelectorAll('.hero-shot img')).map(img => ({
      cls: img.className,
      src: img.src,
      display: window.getComputedStyle(img).display,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
    }));
    return {
      step: 'after-switch-to-pt',
      dataLang: root.getAttribute('data-lang'),
      htmlClass: root.className,
      imgs,
    };
  });
  console.log('AFTER SWITCH TO PT:', JSON.stringify(infoAfterSwitch, null, 2));

  // Now switch back to EN
  await pageEn.click('button[data-setlang="en"]');
  await pageEn.waitForTimeout(500);
  const infoAfterSwitchBack = await pageEn.evaluate(() => {
    const root = document.documentElement;
    const imgs = Array.from(document.querySelectorAll('.hero-shot img')).map(img => ({
      cls: img.className,
      src: img.src,
      display: window.getComputedStyle(img).display,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      clientWidth: img.clientWidth,
      clientHeight: img.clientHeight,
    }));
    return {
      step: 'after-switch-back-to-en',
      dataLang: root.getAttribute('data-lang'),
      htmlClass: root.className,
      imgs,
    };
  });
  console.log('AFTER SWITCH BACK TO EN:', JSON.stringify(infoAfterSwitchBack, null, 2));
  await pageEn.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch/switch-back-to-en.png' });

  await browser.close();
  server.close();
});
