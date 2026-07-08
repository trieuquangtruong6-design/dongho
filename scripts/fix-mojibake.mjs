import fs from "fs";
import path from "path";

const cp1252 = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f]
]);

const suspiciousPattern = /(?:Ã|Ä|Å|Æ|ðŸ|áº|á»|Â|�)/;
const excludeDirs = new Set(["node_modules", "dist", ".git"]);
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md"]);

function encodeCp1252(text) {
  const bytes = [];
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
    } else if (cp1252.has(code)) {
      bytes.push(cp1252.get(code));
    } else {
      return null;
    }
  }
  return Buffer.from(bytes);
}

function decodeCp1252Mojibake(text) {
  const bytes = encodeCp1252(text);
  return bytes ? bytes.toString("utf8") : text;
}

function score(text) {
  const suspicious = (text.match(/Ã|Ä|Å|Æ|ðŸ|áº|á»|�/g) || []).length;
  const replacement = (text.match(/�/g) || []).length * 5;
  return suspicious + replacement;
}

function repairLine(line) {
  if (!suspiciousPattern.test(line)) return line;
  const decoded = decodeCp1252Mojibake(line);
  if (decoded === line || decoded.includes("\uFFFD")) return line;
  return score(decoded) < score(line) ? decoded : line;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (excludeDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!extensions.has(path.extname(entry.name))) continue;

    const original = fs.readFileSync(fullPath, "utf8");
    const repaired = original.split(/\r?\n/).map(repairLine).join("\n");
    if (repaired !== original) {
      fs.writeFileSync(fullPath, repaired, "utf8");
      console.log(fullPath);
    }
  }
}

walk(process.cwd());
