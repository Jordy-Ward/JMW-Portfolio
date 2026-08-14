// Photo gallery configuration
//
// Sources live in assets/originals/; run `npm run optimize-images` to (re)generate
// the WebP files (see scripts/optimize-images.js). Each photo is written to two
// size folders under public/photos/ using the same filename:
//   /photos/large/<file>  (~900px, retina)   /photos/small/<file>  (~450px, 1x)
export const photoGallery = [
  { id: 1, file: "family.webp" },
  { id: 2, file: "hackathon.webp" },
  { id: 3, file: "georgia.webp" },
  { id: 4, file: "daddas.webp" },
  { id: 5, file: "GeorgiaVicGrad.webp" },
  { id: 6, file: "gradFamBib.webp" },
  { id: 7, file: "GrayMichJoshGrad.webp" },
  { id: 8, file: "joGrad.webp" },
  { id: 9, file: "rhysSunset.webp" }
];

// Build the public URL for a photo file at each size.
export const largeSrc = (file) => `/photos/large/${file}`;
export const smallSrc = (file) => `/photos/small/${file}`;

// Self-contained placeholder shown if a photo fails to load (no network request).
const FALLBACK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="320">
     <rect width="100%" height="100%" fill="#e5e7eb"/>
     <g fill="#9ca3af">
       <circle cx="100" cy="130" r="16"/>
       <path d="M48 224l64-72 40 44 28-28 44 56z"/>
     </g>
   </svg>`
);
export const PHOTO_FALLBACK = `data:image/svg+xml,${FALLBACK_SVG}`;

// Fisher-Yates shuffle (returns a new array, leaving the input untouched).
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Seconds for one full marquee loop (~4s per photo). The animation shifts the
// duplicated track by translateX(-50%), so no pixel measurements are needed.
export const getScrollDuration = (photoCount) => photoCount * 4;
