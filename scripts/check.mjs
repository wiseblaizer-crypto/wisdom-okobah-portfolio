import { readFile, stat, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const base = new URL("https://wiseblaizer-crypto.github.io/wisdom-okobah-portfolio/");
const pages = ["index.html", "services/index.html", "work/index.html", "about/index.html", "contact/index.html"];
const documents = new Map(await Promise.all(pages.map(async p => [p, await readFile(path.join(root, p), "utf8")])));
let checked = 0;
async function verifyReference(ref, page, checkFragment = false) {
  const source = new URL(page.replace(/index.html$/, ""), base);
  const target = new URL(ref.replaceAll("&amp;", "&"), source);
  if (target.origin !== base.origin) return;
  assert(target.pathname.startsWith(base.pathname), page + " links outside the project: " + ref);
  let relative = decodeURIComponent(target.pathname.slice(base.pathname.length));
  if (!relative || relative.endsWith("/")) relative += "index.html";
  const file = path.resolve(root, relative);
  assert(file.startsWith(root + path.sep), "Reference escapes output");
  assert((await stat(file)).isFile(), "Missing file: " + relative);
  if (checkFragment && target.hash) {
    const html = documents.get(relative) || await readFile(file, "utf8");
    assert(html.includes('id="' + decodeURIComponent(target.hash.slice(1)) + '"'), "Missing anchor: " + ref + " on " + page);
  }
  checked++;
}
for (const [page, html] of documents) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, page + " needs one H1");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, page + " has duplicate IDs");
  assert(html.includes('href="#main-content"') && html.includes('id="main-content"'), page + " needs a skip link");
  assert(html.includes('rel="canonical"') && html.includes('property="og:image"'), page + " lacks metadata");
  await verifyReference(html.match(/property="og:image" content="([^"]+)"/)[1], page);
  assert(html.includes('<footer class="site-footer"'), page + " lacks footer navigation");
  for (const match of html.matchAll(/<(a|link|img|script)\b[^>]*>/g)) {
    const ref = match[0].match(/\b(?:href|src)="([^"]+)"/)?.[1];
    if (ref && !/^(mailto:|tel:|data:)/.test(ref)) await verifyReference(ref, page, match[1] === "a");
    if (match[1] === "img") {
      assert(/\balt=/.test(match[0]), page + " has an image without alt");
      assert(/\bwidth=/.test(match[0]) && /\bheight=/.test(match[0]), page + " has an image without intrinsic dimensions");
    }
  }
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) await verifyReference(candidate.trim().split(/\s+/)[0], page);
  }
}
let total = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    const size = (await stat(file)).size; total += size;
    assert(!file.endsWith(".ttf"), "Uncompressed font deployed: " + file);
    if (/\.(webp|png|jpg)$/.test(file)) assert(size < 900_000, "Image exceeds 900 KB: " + file);
    if (file.endsWith(".css")) {
      const css = await readFile(file, "utf8");
      assert(!css.includes("@import"), "Runtime CSS imports remain");
      for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        if (/^(data:|https?:)/.test(match[1])) continue;
        assert((await stat(path.resolve(path.dirname(file), match[1]))).isFile(), "Missing CSS asset");
      }
    }
  }
}
await walk(root);
assert(total < 8_000_000, "Production output exceeds 8 MB");
assert((await readFile(path.join(root, "sitemap.xml"), "utf8")).includes(base.href), "Sitemap has wrong domain");
console.log("Passed: five pages, " + checked + " local references, metadata, asset checks; output " + (total / 1e6).toFixed(2) + " MB.");
