import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");

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

async function generate() {
  await fs.mkdir(APP_DIR, { recursive: true });

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
    footer: "indexfast.net",
  });

  await sharp(Buffer.from(twitterSvg)).png({ quality: 95 }).toFile(path.join(APP_DIR, "twitter-image.png"));
  await sharp(Buffer.from(ogSvg)).png({ quality: 95 }).toFile(path.join(APP_DIR, "opengraph-image.png"));

  console.log("Generated src/app/twitter-image.png and src/app/opengraph-image.png");
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
