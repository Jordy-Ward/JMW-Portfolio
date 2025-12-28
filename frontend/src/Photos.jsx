import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';

export default function Photos() {
  const navigate = useNavigate();
  const { username, jwt, logout } = useAuth();
  const { isDark } = useTheme();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Array of photos - same as Landing page
  const photos = [
    "/family.jpeg",
    "/guitar.jpeg", 
    "/hackathon.jpeg",
    "/paintball.jpeg",
    "/georgia.jpeg",
    "/tank.jpeg",
    "/helen.jpeg",
    "/luke.jpeg",
    "/daddas.jpeg",
    "/flyingcat.jpeg",
    "/sleepytank.jpeg",
    "/GeorgiaVicGrad.jpg",
    "/gradFamBib.jpg",
    "/GrayMichJoshGrad.jpg",
    "/joGrad.jpg",
    "/rhysSunset.jpg",
    "/overheadPress.jpg",
    "/gymPose.jpg"
  ];

  const scrollToSection = (sectionId) => {
    navigate('/', { state: { scrollTo: sectionId } });
  };

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <Header 
        username={username}
        jwt={jwt}
        onLogout={logout}
        onNavigate={scrollToSection}
        onGoHome={() => navigate('/')}
        onLogin={() => navigate('/login')}
      />

      {/* Main Content */}
      <div className="pt-24 px-4 pb-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Photo Gallery</h1>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div 
              key={index}
              className={`group relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${
                isDark
                  ? 'hover:shadow-gray-600/50'
                  : 'hover:shadow-gray-400/50'
              }`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img 
                src={photo} 
                alt={`Memory ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400/8B5CF6/FFFFFF?text=Photo";
                }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
          <img 
            src={selectedPhoto}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
