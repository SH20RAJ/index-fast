import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");
const PUBLIC_DIR = path.join(ROOT, "public");

function renderSvg({ background, brand, headline, subline, footer }) {
  return `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${background}
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <text x="64" y="100" fill="#f4f8ff" font-size="44" font-weight="800" font-family="Inter, Segoe UI, Arial, sans-serif">${brand}</text>
    <text x="64" y="332" fill="#f4f8ff" font-size="74" font-weight="800" font-family="Inter, Segoe UI, Arial, sans-serif">${headline}</text>
    <text x="64" y="392" fill="#e5efff" font-size="34" opacity="0.92" font-family="Inter, Segoe UI, Arial, sans-serif">${subline}</text>
    <text x="64" y="566" fill="#d2e0ff" font-size="28" opacity="0.84" font-family="Inter, Segoe UI, Arial, sans-serif">${footer}</text>
  </svg>
  `;
}

function renderIconSvg() {
  return `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="iconBg" x1="8%" y1="8%" x2="92%" y2="92%">
        <stop offset="0%" stop-color="#080b16"/>
        <stop offset="55%" stop-color="#243e93"/>
        <stop offset="100%" stop-color="#7aa7ff"/>
      </linearGradient>
      <radialGradient id="glow" cx="65%" cy="20%" r="80%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.24"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="1024" rx="220" fill="url(#iconBg)"/>
    <rect width="1024" height="1024" rx="220" fill="url(#glow)"/>
    <text x="512" y="596" text-anchor="middle" fill="#ffffff" font-size="356" font-weight="800" letter-spacing="-18" font-family="Inter, Segoe UI, Arial, sans-serif">IF</text>
  </svg>
  `;
}

async function generate() {
  await fs.mkdir(APP_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  const twitterSvg = renderSvg({
    background:
      '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#060914"/><stop offset="60%" stop-color="#16264d"/><stop offset="100%" stop-color="#3862cf"/></linearGradient>',
    brand: "IndexFast",
    headline: "Faster Indexing, Better SEO",
    subline: "Built for creators, SEO operators, and agencies shipping pages at scale.",
    footer: "Submit. Track. Scale.",
  });

  const ogSvg = renderSvg({
    background:
      '<radialGradient id="bg" cx="20%" cy="20%" r="90%"><stop offset="0%" stop-color="#4f7dff"/><stop offset="45%" stop-color="#1b2b57"/><stop offset="100%" stop-color="#090d1a"/></radialGradient>',
    brand: "IndexFast",
    headline: "Automated SEO Indexing",
    subline: "Submit URLs to IndexNow and Bing, monitor sitemap changes, and accelerate discovery.",
    footer: "indexfast.co",
  });

  await sharp(Buffer.from(twitterSvg)).png({ quality: 95 }).toFile(path.join(APP_DIR, "twitter-image.png"));
  await sharp(Buffer.from(ogSvg)).png({ quality: 95 }).toFile(path.join(APP_DIR, "opengraph-image.png"));

  const iconPngBuffer = await sharp(Buffer.from(renderIconSvg())).png().toBuffer();

  await sharp(iconPngBuffer).resize(512, 512).png({ quality: 100 }).toFile(path.join(APP_DIR, "icon.png"));
  await sharp(iconPngBuffer).resize(180, 180).png({ quality: 100 }).toFile(path.join(APP_DIR, "apple-icon.png"));
  await sharp(iconPngBuffer).resize(48, 48).png({ quality: 100 }).toFile(path.join(APP_DIR, "favicon.png"));

  const icoPng32 = await sharp(iconPngBuffer).resize(32, 32).png().toBuffer();
  const icoPng16 = await sharp(iconPngBuffer).resize(16, 16).png().toBuffer();
  const faviconIco = await pngToIco([icoPng16, icoPng32]);
  await fs.writeFile(path.join(APP_DIR, "favicon.ico"), faviconIco);

  await sharp(iconPngBuffer)
    .resize(192, 192)
    .png({ quality: 100 })
    .toFile(path.join(PUBLIC_DIR, "android-chrome-192x192.png"));
  await sharp(iconPngBuffer)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(PUBLIC_DIR, "android-chrome-512x512.png"));
  await sharp(iconPngBuffer)
    .resize(150, 150)
    .png({ quality: 100 })
    .toFile(path.join(PUBLIC_DIR, "mstile-150x150.png"));

  console.log("Generated social and app icon assets in src/app and public");
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
