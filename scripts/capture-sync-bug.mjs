import { chromium } from "playwright";
import path from "path";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const filePath = "file://" + path.resolve("docs/index.html");
  await page.goto(filePath);

  // 1. Light mode
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.setAttribute("data-lang", "pt");
    document.querySelectorAll('[data-only="pt"]').forEach(el => el.removeAttribute('hidden'));
    document.querySelectorAll('[data-only="en"]').forEach(el => el.setAttribute('hidden', ''));
  });
  await page.waitForTimeout(500);

  await page.locator("#sync").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.locator("#sync .demo").screenshot({ path: "scratch-sync-light.png" });

  // 2. Dark mode
  await page.evaluate(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  });
  await page.waitForTimeout(500);
  await page.locator("#sync .demo").screenshot({ path: "scratch-sync-dark.png" });

  await browser.close();
  console.log("Screenshots captured!");
}

main();
