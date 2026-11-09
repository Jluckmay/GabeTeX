import { chromium } from 'playwright';
import path from 'path';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const fileUrl = 'file://' + path.resolve('docs/index.html').replace(/\\/g, '/');

  // Test 1: Dark Mode screenshot
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark', locale: 'pt-BR' });
    const page = await ctx.newPage();
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const hero = page.locator('.hero-shot');
    await hero.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch/page-hero-dark.png' });

    const welcome = page.locator('.split figure');
    await welcome.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await welcome.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch/page-welcome-dark.png' });

    await ctx.close();
  }

  // Test 2: Light Mode screenshot
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const hero = page.locator('.hero-shot');
    await hero.screenshot({ path: 'C:/Users/jluck/.gemini/antigravity/brain/ef36c7e4-3ea2-4f3b-8fb0-16cc9e4f87a5/scratch/page-hero-light.png' });

    await ctx.close();
  }

  await browser.close();
  console.log('Verification screenshots captured!');
}

main().catch(console.error);
