import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const fileUrl = 'file://' + path.resolve('docs/index.html').replace(/\\/g, '/');

  // Test 1: Clean context, locale EN, Dark mode
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'dark',
      locale: 'en-US',
    });
    const page = await ctx.newPage();
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const activeImg = Array.from(document.querySelectorAll('.hero-shot img')).find(
        img => window.getComputedStyle(img).display !== 'none'
      );
      return {
        dataLang: document.documentElement.getAttribute('data-lang'),
        htmlClass: document.documentElement.className,
        activeSrc: activeImg ? activeImg.src.split('/').pop() : null,
        naturalWidth: activeImg ? activeImg.naturalWidth : 0,
        naturalHeight: activeImg ? activeImg.naturalHeight : 0,
        complete: activeImg ? activeImg.complete : false,
      };
    });
    console.log('EN Dark First Load:', data);
    await ctx.close();
  }

  // Test 2: Clean context, locale PT, Light mode
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'light',
      locale: 'pt-BR',
    });
    const page = await ctx.newPage();
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const activeImg = Array.from(document.querySelectorAll('.hero-shot img')).find(
        img => window.getComputedStyle(img).display !== 'none'
      );
      return {
        dataLang: document.documentElement.getAttribute('data-lang'),
        htmlClass: document.documentElement.className,
        activeSrc: activeImg ? activeImg.src.split('/').pop() : null,
        naturalWidth: activeImg ? activeImg.naturalWidth : 0,
        naturalHeight: activeImg ? activeImg.naturalHeight : 0,
        complete: activeImg ? activeImg.complete : false,
      };
    });
    console.log('PT Light First Load:', data);
    await ctx.close();
  }

  // Test 3: Sync section contrast in both Light and Dark modes
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      locale: 'pt-BR',
    });
    const page = await ctx.newPage();
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Light mode screenshot of #sync
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await page.waitForTimeout(500);
    const syncElem = page.locator('#sync');
    await syncElem.scrollIntoViewIfNeeded();
    await syncElem.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch-sync-light.png' });

    // Dark mode screenshot of #sync
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(500);
    await syncElem.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch-sync-dark.png' });

    console.log('Sync screenshots captured successfully!');
    await ctx.close();
  }

  await browser.close();
}

main().catch(console.error);
