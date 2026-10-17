import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist-client");
const builtIndex = [path.join(dist, "index.html"), path.join(dist, "index.vite.html")].find((file) =>
  fs.existsSync(file),
);
const assetsSrc = path.join(dist, "assets");
const assetsDst = path.join(root, "assets");

if (!builtIndex) {
  console.error("Build não encontrado. Rode: npm run build:site");
  process.exit(1);
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

fs.copyFileSync(builtIndex, path.join(root, "index.html"));
if (fs.existsSync(assetsDst)) {
  fs.rmSync(assetsDst, { recursive: true, force: true });
}
copyDir(assetsSrc, assetsDst);
console.log("Pronto: index.html e pasta assets/ na raiz para o Live Server.");
