// Genererar platshållarbilder i ritningsstil.
// Kör: npm run bilder
// Ersätt filerna i src/bilder/ med riktiga foton när de finns — filnamnen
// är det enda som content-filerna refererar till.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UT = join(ROT, "src", "bilder");

const PAPPER = "#E6E7E2";
const GRAFIT = "#191C1E";
const POCHE = "#0A0B0C";
const NORRLJUS = "#F7F8F5";
const BLA = "#22467A";
const KRITA = "#7C8179";

function slump(fro) {
  let a = fro >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mellan = (r, a, b) => a + r() * (b - a);
const heltal = (r, a, b) => Math.floor(mellan(r, a, b + 1));

function ram(b, h, innehall, bakgrund = PAPPER) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${b}" height="${h}" viewBox="0 0 ${b} ${h}">
<rect width="${b}" height="${h}" fill="${bakgrund}"/>
${innehall}
</svg>`;
}

// Hårkorsraster som ligger under alla ritningar — konstruktionslinjer.
function raster(b, h, steg = 96) {
  let d = "";
  for (let x = steg; x < b; x += steg) d += `M${x} 0V${h}`;
  for (let y = steg; y < h; y += steg) d += `M0 ${y}H${b}`;
  return `<path d="${d}" stroke="${KRITA}" stroke-width="1" opacity="0.18"/>`;
}

// Måttlinje med vinklade ticks, som på en riktig ritning.
function mattlinje(x1, y, x2) {
  const t = 9;
  return `<g stroke="${GRAFIT}" stroke-width="2" opacity="0.65">
    <path d="M${x1} ${y}H${x2}"/>
    <path d="M${x1 - t} ${y + t}L${x1 + t} ${y - t}"/>
    <path d="M${x2 - t} ${y + t}L${x2 + t} ${y - t}"/>
  </g>`;
}

function plan(b, h, r) {
  const m = Math.min(b, h) * 0.12;
  const x = m;
  const y = m;
  const bb = b - m * 2;
  const hh = h - m * 2 - 40;
  let s = raster(b, h);

  // Yttervägg som poché — det som är kapat fylls svart.
  const v = 16;
  s += `<path d="M${x} ${y}h${bb}v${hh}h${-bb}z M${x + v} ${y + v}h${bb - v * 2}v${hh - v * 2}h${-(bb - v * 2)}z" fill="${POCHE}" fill-rule="evenodd"/>`;

  // Innerväggar
  const delx = x + v + mellan(r, 0.3, 0.6) * (bb - v * 2);
  const dely = y + v + mellan(r, 0.35, 0.65) * (hh - v * 2);
  const iv = 9;
  const oppning = 90;
  const gy = dely - mellan(r, 0.1, 0.5) * (dely - y);
  s += `<rect x="${delx}" y="${y + v}" width="${iv}" height="${gy - y - v}" fill="${POCHE}"/>`;
  s += `<rect x="${delx}" y="${gy + oppning}" width="${iv}" height="${y + hh - v - gy - oppning}" fill="${POCHE}"/>`;
  s += `<rect x="${x + v}" y="${dely}" width="${delx - x - v}" height="${iv}" fill="${POCHE}"/>`;

  // Dörrslag
  s += `<path d="M${delx + iv} ${gy + oppning}a${oppning} ${oppning} 0 0 0 ${oppning} ${-oppning}" fill="none" stroke="${GRAFIT}" stroke-width="2.5" opacity="0.8"/>`;
  s += `<path d="M${delx + iv} ${gy + oppning}v${-oppning}" stroke="${GRAFIT}" stroke-width="2.5" opacity="0.8"/>`;

  // Möblering, antydd
  const antal = heltal(r, 2, 4);
  for (let i = 0; i < antal; i++) {
    const mw = mellan(r, 70, 150);
    const mh = mellan(r, 50, 110);
    const mx = mellan(r, delx + 40, x + bb - v - mw - 20);
    const my = mellan(r, dely + 40, y + hh - v - mh - 20);
    s += `<rect x="${mx}" y="${my}" width="${mw}" height="${mh}" fill="none" stroke="${KRITA}" stroke-width="2.5"/>`;
  }

  // Trappa
  const tx = x + v + 24;
  const ty = dely + iv + 24;
  const steg = 7;
  for (let i = 0; i < steg; i++) {
    s += `<path d="M${tx} ${ty + i * 22}h120" stroke="${GRAFIT}" stroke-width="2.5" opacity="0.75"/>`;
  }
  s += `<rect x="${tx}" y="${ty}" width="120" height="${steg * 22}" fill="none" stroke="${GRAFIT}" stroke-width="2.5" opacity="0.75"/>`;

  s += mattlinje(x, h - m * 0.45, x + bb);
  return ram(b, h, s);
}

function sektion(b, h, r) {
  const mark = h * 0.78;
  let s = raster(b, h);

  // Mark med snitthatch
  let hatch = "";
  for (let i = -h; i < b + h; i += 26) hatch += `M${i} ${h}L${i + h - mark} ${mark}`;
  s += `<path d="${hatch}" stroke="${GRAFIT}" stroke-width="2" opacity="0.4"/>`;
  s += `<path d="M0 ${mark}H${b}" stroke="${POCHE}" stroke-width="7"/>`;

  // Byggnadsprofil, kapad och svartfylld
  const x = b * 0.16;
  const bb = b * 0.68;
  const vaning = heltal(r, 2, 4);
  const vh = (mark - h * 0.16) / vaning;
  const v = 15;
  const topp = mark - vh * vaning;

  s += `<rect x="${x}" y="${topp}" width="${v}" height="${mark - topp}" fill="${POCHE}"/>`;
  s += `<rect x="${x + bb - v}" y="${topp}" width="${v}" height="${mark - topp}" fill="${POCHE}"/>`;
  for (let i = 0; i <= vaning; i++) {
    const y = mark - i * vh;
    s += `<rect x="${x}" y="${y - 11}" width="${bb}" height="11" fill="${POCHE}"/>`;
  }
  // Pulpettak
  const lut = mellan(r, 0.06, 0.16) * h;
  s += `<path d="M${x} ${topp}L${x + bb} ${topp - lut}l0 14L${x} ${topp + 14}z" fill="${POCHE}"/>`;

  // Ljusinsläpp markerat i blåkopia
  for (let i = 0; i < vaning; i++) {
    const y = mark - (i + 1) * vh + 26;
    s += `<path d="M${x + v} ${y}h${bb - v * 2}" stroke="${BLA}" stroke-width="4" opacity="0.55" stroke-dasharray="26 16"/>`;
  }

  // Skalfigur
  const fx = x + bb + 70;
  const fh = vh * 0.62;
  s += `<g fill="none" stroke="${GRAFIT}" stroke-width="3.5" opacity="0.8">
    <circle cx="${fx}" cy="${mark - fh}" r="${fh * 0.12}"/>
    <path d="M${fx} ${mark - fh + fh * 0.12}v${fh * 0.45}l${-fh * 0.16} ${fh * 0.43}m${fh * 0.16} ${-fh * 0.43}l${fh * 0.16} ${fh * 0.43}"/>
  </g>`;

  return ram(b, h, s);
}

function fasad(b, h, r) {
  const mark = h * 0.86;
  let s = raster(b, h);
  const x = b * 0.12;
  const bb = b * 0.76;
  const topp = h * 0.14;

  s += `<rect x="${x}" y="${topp}" width="${bb}" height="${mark - topp}" fill="none" stroke="${GRAFIT}" stroke-width="5"/>`;

  const kol = heltal(r, 4, 7);
  const rad = heltal(r, 3, 5);
  const pad = 34;
  const fw = (bb - pad * (kol + 1)) / kol;
  const fh = (mark - topp - pad * (rad + 1)) / rad;
  for (let i = 0; i < kol; i++) {
    for (let j = 0; j < rad; j++) {
      if (r() < 0.12) continue;
      const fx = x + pad + i * (fw + pad);
      const fy = topp + pad + j * (fh + pad);
      const djup = r() < 0.3;
      s += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="${djup ? GRAFIT : NORRLJUS}" opacity="${djup ? 0.85 : 1}" stroke="${GRAFIT}" stroke-width="3"/>`;
    }
  }
  s += `<path d="M0 ${mark}H${b}" stroke="${POCHE}" stroke-width="7"/>`;
  s += mattlinje(x, mark + 48, x + bb);
  return ram(b, h, s);
}

function axonometri(b, h, r) {
  let s = raster(b, h, 120);
  const cx = b / 2;
  const cy = h * 0.62;
  const e = Math.min(b, h) * 0.13;
  const iso = (u, v, w) => [cx + (u - v) * e * 0.866, cy - (u + v) * e * 0.5 - w * e];

  const block = [];
  const n = heltal(r, 3, 5);
  for (let i = 0; i < n; i++) {
    block.push({
      u: heltal(r, -2, 1),
      v: heltal(r, -2, 1),
      bu: heltal(r, 1, 2),
      bv: heltal(r, 1, 2),
      hj: mellan(r, 0.8, 2.4),
    });
  }
  block.sort((a, c) => a.u + a.v - (c.u + c.v));

  for (const k of block) {
    const p = (u, v, w) => iso(u, v, w).join(" ");
    const { u, v, bu, bv, hj } = k;
    // topp
    s += `<polygon points="${p(u, v, hj)},${p(u + bu, v, hj)},${p(u + bu, v + bv, hj)},${p(u, v + bv, hj)}" fill="${NORRLJUS}" stroke="${GRAFIT}" stroke-width="3"/>`;
    // vänster
    s += `<polygon points="${p(u, v + bv, hj)},${p(u + bu, v + bv, hj)},${p(u + bu, v + bv, 0)},${p(u, v + bv, 0)}" fill="#C9CCC5" stroke="${GRAFIT}" stroke-width="3"/>`;
    // höger
    s += `<polygon points="${p(u + bu, v, hj)},${p(u + bu, v + bv, hj)},${p(u + bu, v + bv, 0)},${p(u + bu, v, 0)}" fill="#A8ACA5" stroke="${GRAFIT}" stroke-width="3"/>`;
  }
  return ram(b, h, s);
}

function situationsplan(b, h, r) {
  let s = raster(b, h, 140);
  // Nivåkurvor
  for (let i = 0; i < 7; i++) {
    const y = h * (0.18 + i * 0.1);
    let d = `M0 ${y}`;
    for (let x = 0; x <= b; x += b / 6) {
      d += ` Q${x + b / 12} ${y + mellan(r, -46, 46)} ${x + b / 6} ${y + mellan(r, -18, 18)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${KRITA}" stroke-width="2.5" opacity="0.7"/>`;
  }
  // Gata
  const gy = h * 0.72;
  s += `<path d="M0 ${gy}H${b}" stroke="${GRAFIT}" stroke-width="3" opacity="0.8"/>`;
  s += `<path d="M0 ${gy + 62}H${b}" stroke="${GRAFIT}" stroke-width="3" opacity="0.8"/>`;
  s += `<path d="M0 ${gy + 31}H${b}" stroke="${GRAFIT}" stroke-width="2.5" stroke-dasharray="30 24" opacity="0.5"/>`;

  // Byggnadsfotavtryck
  const n = heltal(r, 3, 6);
  for (let i = 0; i < n; i++) {
    const bw = mellan(r, 90, 230);
    const bh = mellan(r, 70, 160);
    const bx = mellan(r, b * 0.06, b * 0.94 - bw);
    const by = mellan(r, h * 0.12, gy - bh - 40);
    s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${POCHE}"/>`;
  }
  // Norrpil
  const nx = b - 110;
  const ny = 110;
  s += `<g stroke="${GRAFIT}" stroke-width="3" fill="none"><circle cx="${nx}" cy="${ny}" r="42"/><path d="M${nx} ${ny + 30}V${ny - 34}m0 0l-13 17m13-17l13 17" fill="${GRAFIT}"/></g>`;
  return ram(b, h, s);
}

// Modellfoto-ersättare: tonade plan med riktat ljus.
function modell(b, h, r) {
  const grad = `<defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#D9DBD5"/><stop offset="1" stop-color="#B4B8B1"/>
    </linearGradient>
  </defs>`;
  let s = grad + `<rect width="${b}" height="${h}" fill="url(#g)"/>`;
  const golv = h * 0.74;
  s += `<rect y="${golv}" width="${b}" height="${h - golv}" fill="#C6C9C2"/>`;

  // Bitarna staplas i rad och hela gruppen centreras sedan i bildrutan. Slumpas
  // x-läget per bit i stället hamnar massan var som helst utom i mitten.
  const n = heltal(r, 3, 5);
  const bitar = [];
  let x = 0;
  for (let i = 0; i < n; i++) {
    const bw = mellan(r, b * 0.1, b * 0.26);
    const bh = mellan(r, h * 0.16, h * 0.5);
    bitar.push({ x, bw, bh });
    x += bw + mellan(r, -bw * 0.3, b * 0.05);
  }

  const bredd = Math.max(...bitar.map((k) => k.x + k.bw));
  // Skuggan faller åt höger och räknas som en del av massan, annars ser gruppen
  // vänstertung ut fast lådorna står mitt i.
  const skugga = Math.max(...bitar.map((k) => k.bh)) * 0.5;
  const plats = b * 0.84;
  const skala = bredd + skugga > plats ? plats / (bredd + skugga) : 1;
  for (const k of bitar) {
    k.x *= skala;
    k.bw *= skala;
    k.bh *= skala;
  }
  const forskjut = (b - (bredd + skugga) * skala) / 2;
  for (const k of bitar) k.x += forskjut;
  for (const k of bitar) {
    const y = golv - k.bh;
    // slagskugga
    s += `<polygon points="${k.x + k.bw} ${golv},${k.x + k.bw + k.bh * 0.5} ${golv + k.bh * 0.22},${k.x + k.bh * 0.5} ${golv + k.bh * 0.22},${k.x} ${golv}" fill="#9EA29B" opacity="0.55"/>`;
    s += `<rect x="${k.x}" y="${y}" width="${k.bw}" height="${k.bh}" fill="#E9EAE5"/>`;
    s += `<rect x="${k.x + k.bw * 0.72}" y="${y}" width="${k.bw * 0.28}" height="${k.bh}" fill="#CFD2CB"/>`;
    s += `<rect x="${k.x}" y="${y}" width="${k.bw}" height="${Math.max(6, k.bh * 0.03)}" fill="#F4F5F1"/>`;
  }
  return ram(b, h, s, "#D9DBD5");
}

const ritare = { plan, sektion, fasad, axonometri, situationsplan, modell };

// namn, typ, bredd, höjd
const BILDER = [
  ["hero-affisch", "sektion", 1920, 1080],
  ["bergsklinten-01", "sektion", 1800, 1200],
  ["bergsklinten-02", "plan", 1600, 1200],
  ["bergsklinten-03", "modell", 1800, 1200],
  ["bergsklinten-04", "fasad", 1800, 1013],
  ["kajhuset-01", "fasad", 1800, 1200],
  ["kajhuset-02", "situationsplan", 1600, 1600],
  ["kajhuset-03", "sektion", 1800, 1013],
  ["kajhuset-04", "modell", 1400, 1800],
  ["biblioteket-01", "modell", 1800, 1200],
  ["biblioteket-02", "plan", 1600, 1600],
  ["biblioteket-03", "sektion", 1800, 1013],
  ["biblioteket-04", "axonometri", 1600, 1200],
  ["strandangen-01", "situationsplan", 1800, 1200],
  ["strandangen-02", "axonometri", 1600, 1200],
  ["strandangen-03", "modell", 1800, 1013],
  ["verkstaden-01", "plan", 1600, 1200],
  ["verkstaden-02", "modell", 1400, 1800],
  ["verkstaden-03", "fasad", 1800, 1013],
  ["skiss-01", "axonometri", 1200, 1500],
  ["skiss-02", "plan", 1400, 1050],
  ["skiss-03", "sektion", 1500, 1000],
  ["galleri-01", "modell", 1400, 1750],
  ["galleri-02", "modell", 1600, 1067],
  ["galleri-03", "modell", 1400, 1400],
  ["galleri-04", "modell", 1600, 1200],
  ["galleri-05", "modell", 1200, 1600],
  ["galleri-06", "modell", 1600, 900],
  ["galleri-07", "modell", 1500, 1500],
  ["galleri-08", "modell", 1400, 1050],
  ["portratt", "modell", 1200, 1500],
];

await mkdir(UT, { recursive: true });

let i = 0;
for (const [namn, typ, b, h] of BILDER) {
  const r = slump(0x5eed + i * 7919);
  const svg = ritare[typ](b, h, r);
  const fil = join(UT, `${namn}.jpg`);
  await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(fil);
  i++;
  console.log(`  ${namn}.jpg  ${typ}  ${b}×${h}`);
}

// Platshållar-CV så nedladdningslänken inte pekar i tomma intet.
const cv = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length 74>>stream
BT /F1 18 Tf 64 760 Td (CV - platshallare. Ersatt public/cv.pdf.) Tj ET
endstream
endobj
trailer<</Root 1 0 R>>`;
await mkdir(join(ROT, "public"), { recursive: true });
await writeFile(join(ROT, "public", "cv.pdf"), cv, "latin1");

console.log(`\n${BILDER.length} platshållarbilder skrivna till src/bilder/`);
