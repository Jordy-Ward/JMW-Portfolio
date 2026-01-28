// Photo gallery configuration
export const photoGallery = [
  { id: 1, src: "/family.jpeg" },
  { id: 2, src: "/guitar.jpeg" },
  { id: 3, src: "/hackathon.jpeg" },
  { id: 4, src: "/paintball.jpeg" },
  { id: 5, src: "/georgia.jpeg" },
  { id: 6, src: "/tank.jpeg" },
  { id: 7, src: "/luke.jpeg" },
  { id: 8, src: "/daddas.jpeg" },
  { id: 9, src: "/flyingcat.jpeg" },
  { id: 10, src: "/sleepytank.jpeg" },
  { id: 11, src: "/GeorgiaVicGrad.jpg" },
  { id: 12, src: "/gradFamBib.jpg" },
  { id: 13, src: "/GrayMichJoshGrad.jpg" },
  { id: 14, src: "/joGrad.jpg" },
  { id: 15, src: "/rhysSunset.jpg" },
  { id: 16, src: "/overheadPress.jpg" },
  { id: 17, src: "/gymPose.jpg" }
];

// Helper function to shuffle array (Fisher-Yates algorithm)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Calculate animation properties based on photo count
export const getAnimationConfig = (photoCount) => {
  const photoWidth = 256; // width in pixels
  const gap = 24; // gap between photos
  const totalWidth = photoCount * (photoWidth + gap);
  const duration = photoCount * 4; // 4 seconds per photo
  
  return {
    totalWidth,
    duration,
    photoWidth: photoWidth + gap
  };
};
