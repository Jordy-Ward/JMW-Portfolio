import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';

export default function Landing() {
  // Router navigation hook for programmatic navigation
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auth context for authentication state and functions
  const { username, jwt, logout } = useAuth();
  
  // Local state for fire effects (unchanged from before)
  const [highlightedSection, setHighlightedSection] = useState('');

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

  // Function to handle smooth scroll and animation
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Trigger highlight animation after scroll
      setTimeout(() => {
        setHighlightedSection(sectionId);
        // Remove highlight after animation completes
        setTimeout(() => setHighlightedSection(''), 2500);
      }, 800);
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
  }, [location.state, navigate]);

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
    "/luke2.jpeg",
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 text-white font-sans">
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
        <img src="/landingPagePortrait.JPG" alt="Profile" className="w-40 h-40 rounded-full border-4 border-purple-500 shadow-lg mb-6 object-cover" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">Jordan Ward</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-purple-300 mb-4">Aspiring Software Developer</h2>
        <p className="max-w-2xl text-lg md:text-xl text-gray-200 mb-6">Howzit! Feel free to check out my portfolio and experience!</p>
      </section>

      {/* Apps Section - Cool Bubbles */}
      <section id="apps" className="py-10 px-4 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-purple-300 text-center">Applications</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
          {/* PingChat App */}
          <div 
            className="group relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            onClick={handleViewMessaging}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300">
              <div className="absolute inset-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">💬</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">PingChat</span>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
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
            className="group relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            onClick={() => navigate('/siphon')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-300">
              <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🌊</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">Siphon Demo</span>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* News App */}
          <div 
            className="group relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            onClick={() => navigate('/news')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg group-hover:shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-300">
              <div className="absolute inset-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📰</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors">News App</span>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        
        
        {/* Small description */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            More to come...
          </p>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-10 px-4 max-w-6xl mx-auto">{/* Reduced py-16 to py-12 */}
        <h3 className="text-3xl font-bold mb-8 text-purple-300">Projects</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* JMW Portfolio - Main Project */}
          <div className={`bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col h-full ${highlightedSection === 'projects' ? 'fire-highlight fire-border' : ''}`}>
            <h4 className="text-xl font-semibold mb-2 text-purple-200">JMW Portfolio & RSA Messaging App</h4>
            <p className="mb-4 text-gray-200 text-sm flex-grow">A student portfolio 
              featuring this website and a secure RSA messaging service. Built with React frontend, Java Spring Boot backend, PostgreSQL database, and deployed on Railway. 
              Includes JWT authentication, RSA encryption, and fun UI effects.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/JMW-Portfolio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition shadow-md text-center"
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
          <div className={`bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col h-full ${highlightedSection === 'projects' ? 'fire-highlight fire-border' : ''}`}>
            <h4 className="text-xl font-semibold mb-2 text-purple-200">Bouncing Balls</h4>
            <p className="mb-4 text-gray-200 text-sm flex-grow">An interactive 2D physics game involving shooting balls at targets. Uses fun, realistic physics animations.
              Built with Java for educational and entertainment purposes.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/bouncingBalls" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition shadow-md text-center"
              >
                View on GitHub
              </a>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-1 bg-orange-600 text-xs rounded">Java</span>
              <span className="px-2 py-1 bg-purple-600 text-xs rounded">Physics</span>
              <span className="px-2 py-1 bg-pink-600 text-xs rounded">Animation</span>
            </div>
          </div>

          {/* Financial Data Analysis */}
          <div className={`bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col h-full ${highlightedSection === 'projects' ? 'fire-highlight fire-border' : ''}`}>
            <h4 className="text-xl font-semibold mb-2 text-purple-200">Financial Data Analysis</h4>
            <p className="mb-4 text-gray-200 text-sm flex-grow">Financial data analysis project using machine learning to extract meaningful insights from 
              financial datasets. Includes data visualization and predictive modeling.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/finData" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition shadow-md text-center"
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
          <div className={`bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col h-full ${highlightedSection === 'projects' ? 'fire-highlight fire-border' : ''}`}>
            <h4 className="text-xl font-semibold mb-2 text-purple-200">Prescient Coding Challenge 2025</h4>
            <p className="mb-4 text-gray-200 text-sm flex-grow">One of two solutions presented by team DualBoot at the Prescient Investment Management coding challenge 2025.</p>
            <div className="flex flex-col gap-2 mt-auto">
              <a 
                href="https://github.com/Jordy-Ward/prescient-coding-challenge-2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition shadow-md text-center"
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
        <h3 className="text-3xl font-bold mb-8 text-purple-300">CV / Resume</h3>
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700">
          <ul className="list-disc list-inside text-lg text-gray-200 space-y-2 mb-6">
            <li>BSc Computer Science and Applied Mathematics, University of Stellenbosch</li>
            <li>BSc Honours in Computer Science (2026-present)</li>
            <li>Participated in the {''}
              <a 
                href="https://www.prescient.co.za/"
                target="_blank"
                rel="nopener noreferer"
                className="text-purple-300 hover:text-purple-100 underline decoration-purple-300 hover:decoration-purple-100 transition-colors"
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
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow-md flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View CV
            </button>
            <button 
              onClick={handleDownloadCV}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow-md flex items-center gap-2"
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
        <h3 className="text-3xl font-bold mb-8 text-purple-300">Education</h3>
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700">
          <ul className="list-disc list-inside text-lg text-gray-200 space-y-2">
            <li>Graduated from Glenwood House highschool (2020)</li>
            <li>Graduated from Stellenbosch University, BSc Computer Science and Applied Mathematics (2025)</li>
            <li>Honours in Computer Science, Stellenbosch University (2026)</li>
            {/* Add more education here */}
          </ul>
        </div>
      </section>

      {/* Life Outside the Office */}
      <section id="life-outside" className="py-20 px-4 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-purple-300">More of me</h3>
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 overflow-hidden">
          
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
        <h3 className="text-3xl font-bold mb-8 text-purple-300">Contact details</h3>
        <div className={`bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col items-center ${highlightedSection === 'contact' ? 'fire-highlight fire-border' : ''}`}>
          <p className="mb-4 text-lg text-gray-200">Feel free to reach out to connect and or collaborate!</p>
          <div className="flex gap-6 mb-4">
            <a href="mailto:jordyward041@gmail.com" className="text-purple-400 hover:text-purple-200 text-2xl"><i className="fas fa-envelope"></i> Email</a>
            <a href="https://github.com/Jordy-Ward" className="text-purple-400 hover:text-purple-200 text-2xl" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
}
