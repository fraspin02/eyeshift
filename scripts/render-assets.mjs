// Renders every campaign asset defined in lib/render/shots.ts from the live 3D model.
// Usage: npm run dev (or start) in another shell, then `node scripts/render-assets.mjs [shotId ...]`
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright"); // pre-installed globally (run with NODE_PATH=$(npm root -g))
import { mkdirSync } from "node:fs";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = new URL("../public/images/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const src = readFileSync(new URL("../lib/render/shots.ts", import.meta.url), "utf8");
let ids = process.argv.slice(2);

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
if (!ids.length) {
  const p = await browser.newPage();
  await p.goto(`${BASE}/studio`, { waitUntil: "load" });
  await p.waitForSelector("li a", { timeout: 60000 });
  ids = await p.$$eval("li a", (as) => as.map((a) => a.textContent.trim()));
  await p.close();
}
console.log(`Rendering ${ids.length} shots`);
for (const id of ids) {
  const t0 = Date.now();
  // read size from the studio list page metadata via the page itself
  const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
  await page.goto(`${BASE}/studio?shot=${id}`, { waitUntil: "load", timeout: 180000 });
  const size = await page.evaluate(async () => {
    for (let i = 0; i < 600; i++) {
      if (window.__SHOT_SIZE) return window.__SHOT_SIZE;
      await new Promise((r) => setTimeout(r, 100));
    }
    return null;
  });
  if (!size) {
    console.log(`✗ ${id} — no canvas`);
    await page.close();
    continue;
  }
  await page.setViewportSize({ width: size.w, height: size.h });
  await page.waitForFunction(() => window.__RENDER_READY === true, null, { timeout: 600000, polling: 500 });
  await page.waitForTimeout(800);
  const png = id.endsWith("fg-16x9") || src.includes(`id: "${id}", file: "${id}.png"`);
  const file = `${OUT}${id}.${png ? "png" : "jpg"}`;
  await page.screenshot({ path: file, type: png ? "png" : "jpeg", quality: png ? undefined : 88, omitBackground: png, timeout: 600000 });
  console.log(`✓ ${id} (${size.w}×${size.h}) ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await page.close();
}
await browser.close();
