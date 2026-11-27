import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { photoGallery, shuffleArray, getScrollDuration, largeSrc, smallSrc, PHOTO_FALLBACK } from './config/photos';

// Files served from frontend/public
const CV_PATH = '/JordanWardCV.pdf';
const THESIS_PATH = '/Teaching_Tool_Interferometry_JMWard_Honours_Thesis.pdf';

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg text-gray-900">Jordan Ward</h1>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <a
            href={CV_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg font-medium transition-colors bg-gray-900 text-white hover:bg-gray-700"
          >
            View CV
          </a>
          <a
            href={CV_PATH}
            download="Jordan_Ward_CV.pdf"
            className="px-5 py-2.5 rounded-lg font-medium transition-colors border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
          >
            Download CV
          </a>
          <a
            href={THESIS_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg font-medium transition-colors border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900"
          >
            View Honours thesis
          </a>
        </div>
      </section>


      <section id="about" className="py-8 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-gray-900">
          About me
        </h3>
          <div className="rounded-xl p-6 shadow-lg border transition-all bg-white border-gray-200 hover:border-gray-300 space-y-4 text-lg leading-relaxed text-gray-600">
            <p>
              I'm a Computer Science Honours graduate from Stellenbosch University with a
              background in applied mathematics, software engineering, data science and machine learning. I like  
              building software that holds up at scale and working on scientific computing problems. I'm looking to begin 
              my career as a data or software engineer, specifically working on backend systems. 
            </p>
            <p>
              Outside of programming I love the ocean and working out.
            </p>
          </div>

      </section>

      <section id="education" className="py-8 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-gray-900">Education</h3>
        <div className="rounded-xl p-6 shadow-lg border transition-all bg-white border-gray-200 hover:border-gray-300">
          <ul className="list-disc list-inside text-lg space-y-2 text-gray-600">
            <li>
              Graduated from Stellenbosch University, BSc Honours Computer Science,{' '}
              <span className="font-semibold">Cum Laude</span> (2026)
            </li>
            <li>Graduated from Stellenbosch University, BSc Computer Science and Applied Mathematics (2025)</li>
            <li>Graduated from Glenwood House highschool (2020)</li>
          </ul>
        </div>
      </section>

      <section id="life-outside" className="py-10 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 overflow-hidden">
          <div className={staticMode ? "overflow-x-auto pb-4" : "relative overflow-hidden"}>
            <div
              className={`flex ${staticMode ? 'gap-4' : 'gap-6 w-max animate-scroll'}`}
              style={staticMode ? undefined : { animationDuration: `${scrollDuration}s` }}
            >
              {(staticMode ? randomizedPhotos : duplicatedPhotos).map((photo, index) => (
                <div key={`${photo.id}-${index}`} className="flex-shrink-0 h-80">
                  <img
                    src={largeSrc(photo.file)}
                    srcSet={`${smallSrc(photo.file)} 1x, ${largeSrc(photo.file)} 2x`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    height="320"
                    className={`h-full w-auto max-w-none rounded-lg shadow-lg transition-transform duration-300 ${staticMode ? '' : 'hover:scale-105'}`}
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
        <h3 className="text-3xl font-bold mb-8 text-gray-900">Contact details</h3>
        <div className="rounded-xl p-6 shadow-lg border transition-all flex flex-col items-center bg-white border-gray-200 hover:border-gray-300">
          <div className="flex gap-6 mb-4">
            <a href="mailto:jordanward041@gmail.com" className="text-2xl transition-colors text-gray-700 hover:text-gray-900">Email</a>
            <a href="https://github.com/Jordy-Ward" className="text-2xl transition-colors text-gray-700 hover:text-gray-900" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
}
