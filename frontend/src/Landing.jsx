import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import { photoGallery, shuffleArray, getAnimationConfig } from './config/photos';

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isDark } = useTheme();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      setTimeout(() => {
        scrollToSection(scrollTo);
      }, 100);
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const handleDownloadCV = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isMobile) {
      window.open('/JordanWardCV.pdf', '_blank');
    } else {
      try {
        const link = document.createElement('a');
        link.href = '/JordanWardCV.pdf';
        link.download = 'Jordan_Ward_CV.pdf';
        
        if (link.download !== undefined) {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open('/JordanWardCV.pdf', '_blank');
        }
      } catch (error) {
        window.open('/JordanWardCV.pdf', '_blank');
      }
    }
  };

  const [randomizedPhotos] = useState(() => shuffleArray(photoGallery));
  const duplicatedPhotos = [...randomizedPhotos, ...randomizedPhotos];
  const animationConfig = getAnimationConfig(photoGallery.length);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <Header 
            onNavigate={scrollToSection}
            onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      <section className="flex flex-col items-center justify-center py-6 px-4 text-center pt-32 pb-8">
        <img src="/landingPagePortrait.JPG" alt="Profile" className="w-40 h-40 rounded-full border-4 border-white shadow-2xl mb-6 object-cover" />
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Jordan Ward</h1>
        <p className={`max-w-2xl text-lg md:text-xl mb-1 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>My portfolio</p>
      </section>


      <section id="cv" className="py-8 px-4 max-w-4xl mx-auto">
        <h3 className={`text-3xl font-bold mb-8 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>CV / Resume</h3>
        <div className={`rounded-xl p-6 shadow-lg border transition-all ${
          isDark
            ? 'bg-white/5 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}>
          <ul className={`list-disc list-inside text-lg space-y-2 mb-6 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <li>BSc Computer Science and Applied Mathematics, University of Stellenbosch</li>
            <li>BSc Honours in Computer Science (2026-present)</li>
            <li>Participated in the {''}
              <a 
                href="https://www.prescient.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:text-white underline transition-colors ${
                  isDark
                    ? 'text-gray-300 decoration-gray-500 hover:decoration-white'
                    : 'text-gray-700 decoration-gray-400 hover:decoration-gray-900'
                }`}
              >
                Prescient Investment Management
              </a>
              {' '}2025 Hackathon</li>
            <li>Tutor for Teach Me2 (2025-present)</li>
            <li>Waiter at Dorp Bar, Stellenbosch (2023-2025)</li>
            <li>Lifeguard for Gwaing and Wilderness beaches, Garden Route (2018-2021)</li>
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('/JordanWardCV.pdf', '_blank')}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition shadow-md flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View CV
            </button>
            <button 
              onClick={handleDownloadCV}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition shadow-md flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </button>
          </div>
        </div>
      </section>

      <section id="education" className="py-8 px-4 max-w-4xl mx-auto">
        <h3 className={`text-3xl font-bold mb-8 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Education</h3>
        <div className={`rounded-xl p-6 shadow-lg border transition-all ${
          isDark
            ? 'bg-white/5 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}>
          <ul className={`list-disc list-inside text-lg space-y-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <li>Graduated from Glenwood House highschool (2020)</li>
            <li>Graduated from Stellenbosch University, BSc Computer Science and Applied Mathematics (2025)</li>
            <li>Honours in Computer Science, Stellenbosch University (2026)</li>
          </ul>
        </div>
      </section>

      <section id="life-outside" className="py-10 px-4 max-w-6xl mx-auto">
        <h3 className={`text-3xl font-bold mb-8 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>More of me</h3>
        <div className="bg-white/5 rounded-xl p-6 shadow-lg border border-gray-700 overflow-hidden">
          {!isMobile && (
            <style>{`
              .animate-scroll {
                animation: scroll ${animationConfig.duration}s linear infinite;
              }
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${animationConfig.totalWidth}px); }
              }
            `}</style>
          )}
          <div className={isMobile ? "overflow-x-auto pb-4" : "relative overflow-hidden"}>
            <div className={`flex space-x-4 md:space-x-6 ${isMobile ? '' : 'animate-scroll'}`}>
              {(isMobile ? randomizedPhotos : duplicatedPhotos).map((photo, index) => (
                <div key={`${photo.id}-${index}`} className="flex-shrink-0 w-64 h-80 md:w-64 md:h-80">
                  <img 
                    src={photo.src} 
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 ${isMobile ? '' : 'hover:scale-105'}`}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/256x320/8B5CF6/FFFFFF?text=Photo+Unavailable";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-8 px-4 max-w-4xl mx-auto">
        <h3 className={`text-3xl font-bold mb-8 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Contact details</h3>
        <div className={`rounded-xl p-6 shadow-lg border transition-all flex flex-col items-center ${
          isDark
            ? 'bg-white/5 border-gray-700 hover:border-gray-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
        }`}>
          <p className={`mb-4 text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Feel free to reach out to connect and or collaborate!</p>
          <div className="flex gap-6 mb-4">
            <a href="mailto:jordanward041@gmail.com" className={`text-2xl transition-colors ${
              isDark
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}><i className="fas fa-envelope"></i> Email</a>
            <a href="https://github.com/Jordy-Ward" className={`text-2xl transition-colors ${
              isDark
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`} target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
}
