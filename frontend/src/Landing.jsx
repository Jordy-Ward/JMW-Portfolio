import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';

export default function Landing() {
  // Router navigation hook for programmatic navigation
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth context for authentication state and functions
  const { username, jwt, logout } = useAuth();
  const { isDark } = useTheme();

  // Function to handle navigation to messaging app
  // Checks authentication and routes accordingly
  const handleViewMessaging = () => {
    if (jwt) {
      // User is authenticated - go directly to messaging
      navigate('/messaging');
    } else {
      // User not authenticated - go to login page with intended destination
      navigate('/login', { state: { from: { pathname: '/messaging' } } });
    }
  };

  // Function to handle smooth scroll
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Effect to handle navigation from other pages with scroll intent
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        scrollToSection(scrollTo);
      }, 100);
      
      // Clear the state to prevent re-scrolling on re-renders
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Function to handle CV download with mobile compatibility
  const handleDownloadCV = () => {
    // Detect if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad detection

    if (isMobile) {
      // On mobile, open in new tab for better compatibility
      window.open('/JordanWardCV.pdf', '_blank');
    } else {
      // On desktop, try download first, fallback to opening in new tab
      try {
        const link = document.createElement('a');
        link.href = '/JordanWardCV.pdf';
        link.download = 'Jordan_Ward_CV.pdf';
        
        // Test if download attribute is supported
        if (link.download !== undefined) {
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Fallback to opening in new tab
          window.open('/JordanWardCV.pdf', '_blank');
        }
      } catch (error) {
        // Fallback to opening in new tab
        window.open('/JordanWardCV.pdf', '_blank');
      }
    }
  };
  // Photo carousel state - no longer needed for horizontal scroll
  
  // Shuffle function to randomize array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Add your photos here - replace with your actual image filenames
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
  
  // Randomize photos and duplicate for seamless loop
  const [randomizedPhotos] = useState(() => shuffleArray(photos));
  const duplicatedPhotos = [...randomizedPhotos, ...randomizedPhotos];

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
            onGoHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onLogin={() => navigate('/login', { state: { from: location } })}
        />      {/* Hero/About Me */}
      <section className="flex flex-col items-center justify-center py-12 px-4 text-center pt-32 pb-8">{/* Reduced py-20 to py-12 and added pb-8 */}
        <img src="/landingPagePortrait.JPG" alt="Profile" className="w-40 h-40 rounded-full border-4 border-white shadow-2xl mb-6 object-cover" />
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Jordan Ward</h1>
        <h2 className={`text-xl md:text-2xl font-semibold mb-4 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>Tech Enthusiast</h2>
        <p className={`max-w-2xl text-lg md:text-xl mb-6 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>Feel free to check out my portfolio and experience!</p>
      </section>

      {/* Apps Section - Cool Bubbles */}
      <section id="apps" className="py-10 px-4 max-w-6xl mx-auto">
        <h3 className={`text-3xl font-bold mb-12 text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Applications</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
          {/* PingChat App */}
          <div 
            className="group relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            onClick={handleViewMessaging}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full shadow-lg group-hover:shadow-2xl group-hover:shadow-gray-600/50 transition-all duration-300">
              <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">💬</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-semibold text-white group-hover:text-gray-300 transition-colors">PingChat</span>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Login prompt tooltip for non-authenticated users */}
            {!username && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 shadow-lg">
                <div className="text-center">
                  <div className="font-semibold">🔐 Login Required</div>
                  <div className="text-gray-300">Register or login to start chatting</div>
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>

          {/* Siphon Demo App */}
          <div 
            className="group relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            onClick={() => navigate('/siphon')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full shadow-lg group-hover:shadow-2xl group-hover:shadow-gray-500/50 transition-all duration-300">
              <div className="absolute inset-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🌊</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-semibold text-white group-hover:text-gray-300 transition-colors">Siphon Demo</span>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* News App */}
          <div 
            className="group relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            onClick={() => navigate('/news')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-lg group-hover:shadow-2xl group-hover:shadow-gray-400/50 transition-all duration-300">
              <div className="absolute inset-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📰</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-semibold text-white group-hover:text-gray-300 transition-colors">News App</span>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

      </section>

      {/* Projects */}
      <section id="projects" className="py-10 px-4 max-w-6xl mx-auto">{/* Reduced py-16 to py-12 */}
        <h3 className={`text-3xl font-bold mb-8 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Projects</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* JMW Portfolio - Main Project */}
          <div className={`rounded-xl p-6 shadow-lg border transition-all flex flex-col h-full ${
            isDark 
              ? 'bg-white/5 border-gray-700 hover:border-gray-600' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <h4 className="text-xl font-semibold mb-2 text-white">JMW Portfolio & RSA Messaging App</h4>
            <p className="mb-4 text-gray-400 text-sm flex-grow">A student portfolio 
              featuring this website and a secure RSA messaging service. Built with React frontend, Java Spring Boot backend, PostgreSQL database, and deployed on Railway. 
              Includes JWT authentication, RSA encryption, and fun UI effects.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/JMW-Portfolio" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-6 py-2 rounded-lg font-semibold transition shadow-md text-center ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                View on GitHub
              </a>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-1 bg-cyan-600 text-xs rounded">React</span>
              <span className="px-2 py-1 bg-blue-600 text-xs rounded">Java</span>
              <span className="px-2 py-1 bg-green-600 text-xs rounded">Spring Boot</span>
              <span className="px-2 py-1 bg-yellow-600 text-xs rounded">JavaScript</span>
              <span className="px-2 py-1 bg-red-600 text-xs rounded">PostgreSQL</span>
              <span className="px-2 py-1 bg-purple-600 text-xs rounded">RSA Encryption</span>
            </div>
          </div>

          {/* Bouncing Balls */}
          <div className={`rounded-xl p-6 shadow-lg border transition-all flex flex-col h-full ${
            isDark 
              ? 'bg-white/5 border-gray-700 hover:border-gray-600' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <h4 className="text-xl font-semibold mb-2 text-white">Bouncing Balls</h4>
            <p className="mb-4 text-gray-400 text-sm flex-grow">An interactive 2D physics game involving shooting balls at targets. Uses fun, realistic physics animations.
              Built with Java for educational and entertainment purposes.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/bouncingBalls" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-6 py-2 rounded-lg font-semibold transition shadow-md text-center ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                View on GitHub
              </a>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-1 bg-orange-600 text-xs rounded">Java</span>
              <span className="px-2 py-1 bg-gray-700 text-xs rounded">Physics</span>
              <span className="px-2 py-1 bg-pink-600 text-xs rounded">Animation</span>
            </div>
          </div>

          {/* Financial Data Analysis */}
          <div className={`rounded-xl p-6 shadow-lg border transition-all flex flex-col h-full ${
            isDark 
              ? 'bg-white/5 border-gray-700 hover:border-gray-600' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <h4 className="text-xl font-semibold mb-2 text-white">Financial Data Analysis</h4>
            <p className="mb-4 text-gray-400 text-sm flex-grow">Financial data analysis project using machine learning to extract meaningful insights from 
              financial datasets. Includes data visualization and predictive modeling.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/finData" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-6 py-2 rounded-lg font-semibold transition shadow-md text-center ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                View on GitHub
              </a>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-1 bg-blue-600 text-xs rounded">Python</span>
              <span className="px-2 py-1 bg-orange-600 text-xs rounded">Jupyter</span>
              <span className="px-2 py-1 bg-green-600 text-xs rounded">Data Analysis</span>
              <span className="px-2 py-1 bg-red-600 text-xs rounded">Finance</span>
            </div>
          </div>

          {/* Prescient Coding Challenge */}
          <div className={`rounded-xl p-6 shadow-lg border transition-all flex flex-col h-full ${
            isDark 
              ? 'bg-white/5 border-gray-700 hover:border-gray-600' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <h4 className="text-xl font-semibold mb-2 text-white">Prescient Coding Challenge 2025</h4>
            <p className="mb-4 text-gray-400 text-sm flex-grow">One of two solutions presented by team DualBoot at the Prescient Investment Management coding challenge 2025.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/prescient-coding-challenge-2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-6 py-2 rounded-lg font-semibold transition shadow-md text-center ${
                  isDark 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                View on GitHub
              </a>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-1 bg-blue-600 text-xs rounded">Python</span>
              <span className="px-2 py-1 bg-orange-600 text-xs rounded">Jupyter</span>
              <span className="px-2 py-1 bg-green-600 text-xs rounded">Data Analysis</span>
              <span className="px-2 py-1 bg-yellow-600 text-xs rounded">Challenge</span>
            </div>
          </div>

        </div>
      </section>

      {/* CV/Resume */}
      <section id="cv" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-white">CV / Resume</h3>
        <div className="bg-white/5 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all">
          <ul className="list-disc list-inside text-lg text-gray-400 space-y-2 mb-6">
            <li>BSc Computer Science and Applied Mathematics, University of Stellenbosch</li>
            <li>BSc Honours in Computer Science (2026-present)</li>
            <li>Participated in the {''}
              <a 
                href="https://www.prescient.co.za/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white underline decoration-gray-500 hover:decoration-white transition-colors"
              >
                Prescient Investment Management
              </a>
              {' '}2025 Hackathon</li>
            <li>Tutor for Teach Me2 (2025-present)</li>
            <li>Waiter at Dorp Bar, Stellenbosch (2023-2025)</li>
            <li>Lifeguard for Gwaing and Wilderness beaches, Garden Route (2018-2021)</li>
          </ul>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.open('/JordanWardCV.pdf', '_blank')}
              className={`px-6 py-2 rounded-lg font-semibold transition shadow-md flex items-center gap-2 ${
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
              className={`px-6 py-2 rounded-lg font-semibold transition shadow-md flex items-center gap-2 ${
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

      {/* Education */}
      <section id="education" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-white">Education</h3>
        <div className="bg-white/5 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all">
          <ul className="list-disc list-inside text-lg text-gray-400 space-y-2">
            <li>Graduated from Glenwood House highschool (2020)</li>
            <li>Graduated from Stellenbosch University, BSc Computer Science and Applied Mathematics (2025)</li>
            <li>Honours in Computer Science, Stellenbosch University (2026)</li>
            {/* Add more education here */}
          </ul>
        </div>
      </section>

      {/* Life Outside the Office */}
      <section id="life-outside" className="py-20 px-4 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-white">More of me</h3>
        <div className="bg-white/5 rounded-xl p-6 shadow-lg border border-gray-700 overflow-hidden">
          
          {/* Horizontal Scrolling Gallery */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-6">
              {duplicatedPhotos.map((photo, index) => (
                <div key={index} className="flex-shrink-0 w-64 h-80">
                  <img 
                    src={photo} 
                    alt={`Life moment ${(index % photos.length) + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.target.src = "https://via.placeholder.com/256x320/8B5CF6/FFFFFF?text=Add+Your+Photo";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Socials */}
      <section id="contact" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-white">Contact details</h3>
        <div className="bg-white/5 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all flex flex-col items-center">
          <p className="mb-4 text-lg text-gray-400">Feel free to reach out to connect and or collaborate!</p>
          <div className="flex gap-6 mb-4">
            <a href="mailto:jordyward041@gmail.com" className="text-gray-300 hover:text-white text-2xl"><i className="fas fa-envelope"></i> Email</a>
            <a href="https://github.com/Jordy-Ward" className="text-gray-300 hover:text-white text-2xl" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
}
