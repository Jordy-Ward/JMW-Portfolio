// Generates web-ready WebP images from the high-res masters in assets/originals/
// and writes them into public/photos/. Re-run whenever you add or replace a source
// photo:
//
//   npm run optimize-images
//
// Each source is written to both size folders under the same filename:
//   public/photos/large/<name>.webp   ~900px long edge  -> 2x / retina displays
//   public/photos/small/<name>.webp   ~450px long edge  -> 1x displays
// The gallery renders each photo in a fixed 256x320 slot, so these sizes keep it
// crisp at every pixel density while shrinking the files ~90%.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'assets', 'originals');
const OUT_ROOT = path.join(__dirname, '..', 'public', 'photos');
const QUALITY = 80; // WebP quality (0-100)

const VARIANTS = [
  { dir: 'large', maxEdge: 900 }, // 2x / retina
  { dir: 'small', maxEdge: 450 }, // 1x
];

const IMAGE_RE = /\.(jpe?g|png)$/i;

async function run() {
  const files = fs.readdirSync(SRC_DIR).filter((f) => IMAGE_RE.test(f));

  if (files.length === 0) {
    console.error(`No source images found in ${SRC_DIR}`);
    process.exit(1);
  }

  for (const { dir } of VARIANTS) {
    fs.mkdirSync(path.join(OUT_ROOT, dir), { recursive: true });
  }

  let totalIn = 0;
  let totalOut = 0;

  for (const file of files) {
    const inPath = path.join(SRC_DIR, file);
    totalIn += fs.statSync(inPath).size / 1024;

    for (const { dir, maxEdge } of VARIANTS) {
      const outName = file.replace(IMAGE_RE, '.webp');
      const outPath = path.join(OUT_ROOT, dir, outName);

      await sharp(inPath)
        .rotate() // bake in EXIF orientation before the metadata is stripped
        .resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);

      const outKb = fs.statSync(outPath).size / 1024;
      totalOut += outKb;
      console.log(`photos/${dir}/${outName}`.padEnd(40) + `${outKb.toFixed(0).padStart(5)} KB`);
    }
  }

  const saved = 100 - (totalOut / totalIn) * 100;
  console.log(
    `\nSources: ${(totalIn / 1024).toFixed(2)} MB  ->  output: ${(totalOut / 1024).toFixed(2)} MB  (${saved.toFixed(0)}% smaller)`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
