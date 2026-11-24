import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import { photoGallery, shuffleArray, getScrollDuration, largeSrc, smallSrc, PHOTO_FALLBACK } from './config/photos';

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
  const scrollDuration = getScrollDuration(photoGallery.length);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Honor the OS "reduce motion" setting; initialise synchronously to avoid a flash.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Non-animated, manually scrollable mode for touch devices and reduced-motion users.
  const staticMode = isMobile || prefersReducedMotion;

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
        <img
          src={smallSrc('landingPagePortrait.webp')}
          srcSet={`${smallSrc('landingPagePortrait.webp')} 1x, ${largeSrc('landingPagePortrait.webp')} 2x`}
          alt="Portrait of Jordan Ward"
          width="160"
          height="160"
          className="w-40 h-40 rounded-full border-4 border-white shadow-2xl mb-6 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.srcset = '';
            e.currentTarget.src = PHOTO_FALLBACK;
          }}
        />
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Jordan Ward</h1>
      </section>


      <section id="About" className="py-8 px-4 max-w-4xl mx-auto">
        
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
            <li>Graduated from Stellenbosch University, BSc Honours Computer Science (2026)</li>
          </ul>
        </div>
      </section>

      <section id="life-outside" className="py-10 px-4 max-w-6xl mx-auto">
        <div className="bg-white/5 rounded-xl p-6 shadow-lg border border-gray-700 overflow-hidden">
          <div className={staticMode ? "overflow-x-auto pb-4" : "relative overflow-hidden"}>
            <div
              className={`flex ${staticMode ? 'gap-4' : 'gap-6 w-max animate-scroll'}`}
              style={staticMode ? undefined : { animationDuration: `${scrollDuration}s` }}
            >
              {(staticMode ? randomizedPhotos : duplicatedPhotos).map((photo, index) => (
                <div key={`${photo.id}-${index}`} className="flex-shrink-0 w-64 h-80">
                  <img
                    src={largeSrc(photo.file)}
                    srcSet={`${smallSrc(photo.file)} 1x, ${largeSrc(photo.file)} 2x`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="256"
                    height="320"
                    className={`w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 ${staticMode ? '' : 'hover:scale-105'}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.srcset = '';
                      e.currentTarget.src = PHOTO_FALLBACK;
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
          }`}>Reach out</p>
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
