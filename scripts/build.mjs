import { readFile, writeFile, mkdir, cp, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const out = path.join(root, "dist");
// The output directory is fixed beneath the repository, never caller supplied.
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const shared = ["fonts", "tokens", "animations", "base", "layout", "header", "footer"];
const home = ["hero", "credibility-strip", "problem-solution", "services-overview",
  "featured-projects", "why-work-with-me", "signature-offer", "testimonials", "final-cta"];
const routes = ["home", "services", "work", "about", "contact"];
const copied = new Set();
async function copyAsset(relative) {
  if (copied.has(relative)) return;
  const source = path.resolve(root, relative);
  if (!source.startsWith(root + path.sep)) throw new Error("Asset escaped repository: " + relative);
  await stat(source);
  await mkdir(path.dirname(path.join(out, relative)), { recursive: true });
  await cp(source, path.join(out, relative));
  copied.add(relative);
}
for (const route of routes) {
  const styles = [...shared, ...(route === "home" ? home : [route]), "premium-refinements", "readiness"];
  let css = "";
  for (const name of styles) css += await readFile(path.join(root, "assets/css", name + ".css"), "utf8") + "\n";
  css = css.replace(/\/\*[\s\S]*?\*\//g, "").split("\n").map(line => line.trim()).filter(Boolean).join("\n");
  const cssFile = "assets/css/" + route + ".bundle.css";
  await mkdir(path.dirname(path.join(out, cssFile)), { recursive: true });
  await writeFile(path.join(out, cssFile), css);
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (/^(data:|https?:)/.test(match[1])) continue;
    await copyAsset(path.posix.normalize(path.posix.join("assets/css", match[1])));
    if (match[1].endsWith(".woff2")) {
      await copyAsset(path.posix.normalize(path.posix.join("assets/css", path.posix.dirname(match[1]), "OFL.txt")));
    }
  }
  const htmlFile = route === "home" ? "index.html" : route + "/index.html";
  const html = await readFile(path.join(root, htmlFile), "utf8");
  await mkdir(path.dirname(path.join(out, htmlFile)), { recursive: true });
  await writeFile(path.join(out, htmlFile), html.replace(/<!--[\s\S]*?-->/g, "").replace(/\n[ \t]*\n/g, "\n"));
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|mailto:|tel:|#)/.test(ref) || !ref.includes("assets/") || ref.endsWith(".bundle.css")) continue;
    await copyAsset(path.posix.normalize(path.posix.join(path.posix.dirname(htmlFile), ref)));
  }
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(",")) {
      await copyAsset(path.posix.normalize(path.posix.join(path.posix.dirname(htmlFile), candidate.trim().split(/\s+/)[0])));
    }
  }
}
for (const file of ["404.html", "robots.txt", "sitemap.xml", "assets/images/logo/og-image.jpg"]) await copyAsset(file);
await writeFile(path.join(out, ".nojekyll"), "");
console.log("Built five pages and copied " + copied.size + " referenced assets to dist/.");
