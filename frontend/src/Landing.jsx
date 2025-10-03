import React, { useState } from 'react';

export default function Landing({ onViewProject }) {
  const [highlightedSection, setHighlightedSection] = useState('');

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
      }, 800); // Delay to allow scroll to complete
    }
  };
  // Photo carousel state - no longer needed for horizontal scroll
  
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
    "/luke2.jpeg"
  ];
  
  // Duplicate photos array for seamless loop
  const duplicatedPhotos = [...photos, ...photos];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 text-white font-sans">
      {/* Hero/About Me */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <img src="/landingPagePortrait.JPG" alt="Profile" className="w-40 h-40 rounded-full border-4 border-purple-500 shadow-lg mb-6 object-cover" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">Jordan Ward</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-purple-300 mb-4">Aspiring Software Developer</h2>
        <p className="max-w-2xl text-lg md:text-xl text-gray-200 mb-6">Howzit! Feel free to check out my portfolio and experience!</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => scrollToSection('projects')}
            className="px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg font-bold shadow transition"
          >
            View Projects
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="px-6 py-2 bg-white text-purple-800 hover:bg-purple-200 rounded-lg font-bold shadow transition"
          >
            Contact Me
          </button>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 px-4 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-purple-300">Projects</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Messaging Web App */}
          <div className={`bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col ${highlightedSection === 'projects' ? 'fire-highlight fire-border' : ''}`}>
            <h4 className="text-2xl font-semibold mb-2 text-purple-200">RSA Messaging Web App</h4>
            <p className="mb-4 text-gray-200">A secure messaging platform using RSA encryption, built with Java Spring Boot and React. Features user authentication, encrypted messaging, and a modern UI.</p>
            <button
              onClick={onViewProject}
              className="mt-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition shadow-md"
            >
              Try Live Demo →
            </button>
          </div>
          {/* Add more projects here */}
          <div className={`bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col ${highlightedSection === 'projects' ? 'fire-highlight fire-border' : ''}`}>
            <h4 className="text-2xl font-semibold mb-2 text-purple-200">Bouncing Balls</h4>
            <p className="mb-4 text-gray-200">Add bouncing balls here</p>
            <a href="#projects" className="mt-auto text-purple-400 hover:underline">View Details</a>
          </div>
        </div>
      </section>

      {/* CV/Resume */}
      <section id="cv" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-purple-300">CV / Resume</h3>
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700">
          <ul className="list-disc list-inside text-lg text-gray-200 space-y-2 mb-6">
            <li>BSc Computer Science and Applied Mathematics, University of Stellenbosch (2021-present)</li>
            <li>Participated in the Prescient Investment Management 2025 Hackathon</li>
            <li>Waiter at Dorp Bar, Stellenbosch (2023-2025)</li>
            <li>Lifeguard for Gwaing and Wilderness beaches (2018-2021)</li>
          </ul>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.open('/JordanWardCV.pdf', '_blank')}
              className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shadow transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View CV
            </button>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/JordanWardCV.pdf';
                link.download = 'Jordan_Ward_CV.pdf';
                link.click();
              }}
              className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shadow transition flex items-center gap-2"
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
            <li>BSc Computer Science with Applied Mathematics, University of Stellenbosch (2021–2025)</li>
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
