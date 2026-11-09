import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function cropScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const dir = 'docs/assets/screenshots';
  const files = [
    'project-dark-en.png',
    'project-dark-pt.png',
    'project-light-en.png',
    'project-light-pt.png',
    'project.png',
    'sync-dark-en.png',
    'sync-dark-pt.png',
    'sync-light-en.png',
    'sync-light-pt.png',
    'sync.png',
    'welcome-dark-en.png',
    'welcome-dark-pt.png',
    'welcome-light-en.png',
    'welcome-light-pt.png',
    'welcome.png',
  ];

  for (const file of files) {
    const filePath = path.resolve(dir, file).replace(/\\/g, '/');
    if (!fs.existsSync(filePath)) {
      console.log('Skipping missing:', file);
      continue;
    }

    await page.goto('file://' + filePath);
    const croppedBase64 = await page.evaluate(() => {
      const img = document.querySelector('img');
      const canvas = document.createElement('canvas');
      const cropY = 64; // height of the OS titlebar
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight - cropY;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, -cropY);
      return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
    });

    const buffer = Buffer.from(croppedBase64, 'base64');
    fs.writeFileSync(filePath, buffer);
    console.log(`Cropped ${file}: new size ${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)} (${buffer.length} bytes)`);
  }

  await browser.close();
  console.log('All screenshots cropped successfully!');
}

cropScreenshots().catch(console.error);
