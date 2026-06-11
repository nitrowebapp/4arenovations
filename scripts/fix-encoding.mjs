// Reverses cp1252 mojibake: file was UTF-8, read as cp1252, re-saved as UTF-8.
// Re-encode each char to its cp1252 byte, then decode the bytes as UTF-8.
import { readFileSync, writeFileSync } from "fs";

const cp1252 = {
  0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6, 0x89: 0x2030, 0x8a: 0x0160,
  0x8b: 0x2039, 0x8c: 0x0152, 0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201c, 0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a, 0x9c: 0x0153,
  0x9e: 0x017e, 0x9f: 0x0178,
};
const enc = new Map(Object.entries(cp1252).map(([b, c]) => [c, Number(b)]));

function fix(str) {
  const bytes = [];
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp < 0x100) bytes.push(cp);
    else if (enc.has(cp)) bytes.push(enc.get(cp));
    else return null; // char that can't come from cp1252 misread — abort
  }
  return Buffer.from(bytes).toString("utf8");
}

for (const file of process.argv.slice(2)) {
  let content = readFileSync(file, "utf8");
  if (content.charCodeAt(0) === 0xfeff) content = content.slice(1); // strip BOM
  const fixed = fix(content);
  if (fixed === null || fixed.includes("�")) {
    console.log(`SKIP (not reversible): ${file}`);
    continue;
  }
  writeFileSync(file, fixed, "utf8");
  console.log(`fixed: ${file}`);
}
