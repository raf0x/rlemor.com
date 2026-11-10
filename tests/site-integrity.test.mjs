import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(root, "app");
const publicDir = join(root, "public");

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx$/.test(entry.name) ? [path] : [];
  });
}

const files = [...sourceFiles(app), ...sourceFiles(join(root, "components"))];

test("literal public image paths exist", () => {
  const missing = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/\bsrc="(\/[^"]+)"/g)) {
      const path = match[1].split(/[?#]/)[0];
      if (!existsSync(join(publicDir, path))) {
        missing.push(`${relative(root, file)}: ${path}`);
      }
    }
  }
  assert.deepEqual(missing, [], "Missing public images:\n" + missing.join("\n"));
});

test("literal internal links resolve to a page", () => {
  const missing = [];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/\bhref="(\/[^"]+)"/g)) {
      const path = match[1].split(/[?#]/)[0];
      const page = path === "/" ? join(app, "page.tsx") : join(app, path, "page.tsx");
      if (!existsSync(page)) {
        missing.push(`${relative(root, file)}: ${path}`);
      }
    }
  }
  assert.deepEqual(missing, [], "Missing internal pages:\n" + missing.join("\n"));
});

test("nested case studies expose their current parent section", () => {
  const header = readFileSync(join(root, "components", "SiteHeader.tsx"), "utf8");
  assert.match(header, /pathname\.startsWith\(`\$\{href\}\/`\)/);
  assert.match(header, /aria-current=\{/);
  assert.match(header, /"location"/);
});

test("legacy case study URL has a permanent redirect", () => {
  const config = readFileSync(join(root, "next.config.ts"), "utf8");
  assert.match(config, /source:\s*"\/work\/mypepprotocol"/);
  assert.match(config, /destination:\s*"\/projects\/mypepprotocol"/);
  assert.match(config, /permanent:\s*true/);
});
