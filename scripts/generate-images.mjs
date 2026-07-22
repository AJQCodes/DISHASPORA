// Dishaspora mock image generator — zero dependencies.
// Writes deterministic food-styled placeholder PNGs into backend static + mobile assets.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outBackend = join(root, 'backend', 'src', 'main', 'resources', 'static', 'images');
const outMobile = join(root, 'mobile', 'assets', 'images');
mkdirSync(outBackend, { recursive: true });
mkdirSync(outMobile, { recursive: true });

// ---------- minimal PNG encoder ----------
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- deterministic PRNG ----------
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- palette ----------
const hex = (s) => [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
const P = {
  brand: hex('27EBF5'), brandDark: hex('0FB8C4'), brandLight: hex('D9FCFE'),
  blue: hex('33CFFF'), blueDark: hex('0E9FD8'), blueLight: hex('E3F7FF'),
  accent: hex('FF9F43'), accentDark: hex('F27F0C'), accentLight: hex('FFF1E0'),
  ink: hex('17252A'), plate: hex('FDFDFB'), plateShadow: hex('E8EEF0'),
  green: hex('2FBF71'), red: hex('E5484D'), star: hex('FFC120'), white: hex('FFFFFF'),
};
const bgPairs = [
  [P.brandLight, P.blueLight], [P.accentLight, P.brandLight], [P.blueLight, P.accentLight],
  [P.brand, P.blue], [P.accent, P.star], [P.blue, P.brandDark], [P.accentLight, P.blueLight],
];
const foodColors = [P.accent, P.accentDark, P.green, P.red, P.star, P.blueDark, P.brandDark];

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// ---------- scene renderer ----------
function render(w, h, seed, style) {
  const rnd = mulberry32(seed * 7919 + 17);
  const [c1, c2] = bgPairs[seed % bgPairs.length];
  const angle = rnd() * Math.PI;
  const dx = Math.cos(angle), dy = Math.sin(angle);
  const buf = Buffer.alloc(w * h * 4);

  const cx = w / 2, cy = style === 'banner' ? h / 2 : h * 0.52;
  const plateR = Math.min(w, h) * (style === 'avatar' || style === 'logo' ? 0.38 : 0.34);
  const food = foodColors[(seed * 3 + 1) % foodColors.length];
  const food2 = foodColors[(seed * 5 + 3) % foodColors.length];
  // irregular food blob harmonics
  const h1 = 0.08 + rnd() * 0.08, h2 = 0.05 + rnd() * 0.06, p1 = rnd() * 6.28, p2 = rnd() * 6.28;
  // garnish dots
  const dots = [];
  const nDots = style === 'banner' ? 26 : 14;
  for (let i = 0; i < nDots; i++) {
    dots.push({
      x: rnd() * w, y: rnd() * h, r: 3 + rnd() * (Math.min(w, h) * 0.02),
      c: foodColors[Math.floor(rnd() * foodColors.length)],
    });
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = ((x / w) * dx + (y / h) * dy + 1) / 2;
      let col = mix(c1, c2, Math.min(1, Math.max(0, t)));

      if (style !== 'empty') {
        const ddx = x - cx, ddy = y - cy;
        const dist = Math.hypot(ddx, ddy);
        const ang = Math.atan2(ddy, ddx);
        if (style === 'logo') {
          // cyan disc + white ring + orange dot (brand mark)
          if (dist < plateR) col = mix(P.brand, P.brandDark, dist / plateR);
          if (dist > plateR * 0.62 && dist < plateR * 0.78) col = P.white;
          const od = Math.hypot(x - (cx + plateR * 0.45), y - (cy - plateR * 0.45));
          if (od < plateR * 0.16) col = P.accent;
        } else {
          // plate shadow, plate, inner ring, food blob
          if (Math.hypot(ddx, ddy - plateR * 0.06) < plateR * 1.04) col = mix(col, P.plateShadow, 0.7);
          if (dist < plateR) col = mix(P.plate, P.plateShadow, (dist / plateR) * 0.35);
          if (dist > plateR * 0.86 && dist < plateR * 0.92) col = mix(P.plate, P.plateShadow, 0.8);
          const foodR = plateR * (0.62 + h1 * Math.sin(3 * ang + p1) + h2 * Math.sin(5 * ang + p2));
          if (dist < foodR) {
            const ft = dist / foodR;
            col = mix(food, food2, ft * 0.8 + 0.1 * Math.sin(7 * ang + p1));
            if (dist < foodR * 0.35) col = mix(col, P.star, 0.25); // highlight
          }
        }
      }
      // garnish dots on top (skip for logo)
      if (style !== 'logo') {
        for (const d of dots) {
          const dd = Math.hypot(x - d.x, y - d.y);
          if (dd < d.r) { col = mix(d.c, P.white, 0.15); break; }
        }
      }
      const i = (y * w + x) * 4;
      buf[i] = col[0]; buf[i + 1] = col[1]; buf[i + 2] = col[2]; buf[i + 3] = 255;
    }
  }
  return encodePNG(w, h, buf);
}

// ---------- manifest ----------
const jobs = [];
const add = (name, w, h, seed, style = 'dish') => jobs.push({ name, w, h, seed, style });
for (let i = 1; i <= 40; i++) add(`recipe-${i}.png`, 640, 480, i);
for (let i = 1; i <= 20; i++) add(`listing-${i}.png`, 640, 480, 100 + i);
for (let i = 1; i <= 8; i++) add(`vendor-${i}.png`, 512, 512, 200 + i, 'avatar');
for (let i = 1; i <= 8; i++) add(`story-${i}.png`, 640, 800, 300 + i);
for (let i = 1; i <= 4; i++) add(`banner-${i}.png`, 1024, 480, 400 + i, 'banner');
for (let i = 1; i <= 8; i++) add(`avatar-${i}.png`, 256, 256, 500 + i, 'avatar');
for (let i = 1; i <= 3; i++) add(`onboarding-${i}.png`, 720, 1080, 600 + i);
for (let i = 1; i <= 3; i++) add(`empty-${i}.png`, 512, 512, 700 + i, 'empty');
add('logo.png', 512, 512, 800, 'logo');

for (const j of jobs) {
  writeFileSync(join(outBackend, j.name), render(j.w, j.h, j.seed, j.style));
}
// local copies the mobile app bundles directly
for (const n of ['logo.png', 'onboarding-1.png', 'onboarding-2.png', 'onboarding-3.png', 'empty-1.png', 'empty-2.png', 'empty-3.png']) {
  copyFileSync(join(outBackend, n), join(outMobile, n));
}
console.log(`Generated ${jobs.length} images -> ${outBackend} (+${7} copied to mobile/assets/images)`);
