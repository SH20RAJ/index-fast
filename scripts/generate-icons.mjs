import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const SRC_LOGO = join(PUBLIC, "logo.png");

const sizes = [
  { name: "icon-16x16.png", size: 16 },
  { name: "icon-32x32.png", size: 32 },
  { name: "icon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
  { name: "mstile-150x150.png", size: 150 },
  { name: "icon.png", size: 512 },
  { name: "opengraph-image.png", w: 1200, h: 630, og: true },
  { name: "twitter-image.png", w: 1200, h: 630, og: true },
];

async function main() {
  console.log("Generating icons from", SRC_LOGO);

  for (const entry of sizes) {
    const outPath = join(PUBLIC, entry.name);

    if (entry.og) {
      // For OG images, composite the logo onto a branded background
      const bg = sharp({
        create: {
          width: entry.w,
          height: entry.h,
          channels: 4,
          background: { r: 124, g: 58, b: 237, alpha: 1 }, // Violet #7C3AED
        },
      }).png();

      const logoResized = await sharp(SRC_LOGO)
        .resize(280, 280, { fit: "inside" })
        .toBuffer();

      await sharp(await bg.toBuffer())
        .composite([
          {
            input: logoResized,
            left: Math.round((entry.w - 280) / 2),
            top: Math.round((entry.h - 280) / 2),
          },
        ])
        .png()
        .toFile(outPath);
    } else {
      await sharp(SRC_LOGO)
        .resize(entry.size, entry.size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(outPath);
    }
    console.log(`  ✓ ${entry.name} (${entry.size || entry.w + "x" + entry.h})`);
  }

  // Generate favicon.ico from 16, 32, 48 px PNGs
  const ico16 = join(PUBLIC, "icon-16x16.png");
  const ico32 = join(PUBLIC, "icon-32x32.png");
  const ico48 = join(PUBLIC, "icon-48x48.png");

  const icoBuffer = await pngToIco([ico16, ico32, ico48]);
  writeFileSync(join(PUBLIC, "favicon.ico"), icoBuffer);
  console.log("  ✓ favicon.ico");

  console.log("\nAll icons generated!");
}

main().catch(console.error);
