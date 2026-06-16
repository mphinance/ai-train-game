// One-off: capture the Cookbook filtered to the "building" goal.
// Uses the chromium already downloaded for the freshshot sibling tool.
// Run: node scripts/shot-cookbook.mjs   (dev server must be on :5173)
import pw from '../../freshshot/node_modules/playwright/index.js';
const { chromium } = pw;

const PAGE_URL = 'http://localhost:5173/#/cookbook';
const OUT = 'screenshots/cookbook-building.png';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 1600 },
  deviceScaleFactor: 2,
});
await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
// Click the "building" filter chip (capitalized in the UI via CSS, text is the goal).
await page.getByRole('button', { name: 'building', exact: true }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: OUT, fullPage: true });
await browser.close();
console.log('wrote screenshots/cookbook-building.png');
