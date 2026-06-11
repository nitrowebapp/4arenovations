// Generates wood-tone plank placeholder SVGs for the seeded gallery
import { writeFileSync, mkdirSync } from "fs";

const tones = [
  ["#8a5a33", "#b07a45"],
  ["#6e4426", "#9a6a3c"],
  ["#a3744a", "#c79a6b"],
  ["#7c5230", "#a87a50"],
  ["#5f3d22", "#8a6038"],
  ["#94683f", "#bf8d5e"],
];

mkdirSync("public/gallery", { recursive: true });

tones.forEach(([base, plank], i) => {
  let planks = "";
  for (let y = 0; y < 300; y += 30) {
    const off = ((y / 30) % 4) * 100 - 200;
    for (let x = off; x < 480; x += 160) {
      const op = (0.25 + ((x / 160 + y / 30 + i) % 5) * 0.12).toFixed(2);
      planks += `<rect x="${x}" y="${y + 2}" width="156" height="26" rx="2" fill="${plank}" opacity="${op}"/>`;
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300">` +
    `<rect width="480" height="300" fill="${base}"/>` +
    planks +
    `<rect width="480" height="300" fill="url(#g)"/>` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#000" stop-opacity="0"/>` +
    `<stop offset="1" stop-color="#1b2a41" stop-opacity="0.5"/>` +
    `</linearGradient></defs>` +
    `<text x="20" y="276" font-family="Arial" font-size="20" font-weight="bold" fill="#f7f5f2">Project ${i + 1} — LVP Installation</text>` +
    `</svg>`;
  writeFileSync(`public/gallery/project-${i + 1}.svg`, svg);
});

console.log("Gallery placeholders generated.");
