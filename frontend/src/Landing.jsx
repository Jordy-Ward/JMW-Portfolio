import React, { useState, useEffect } from 'react';

export default function Landing({ onViewProject }) {
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
          <a href="#projects" className="px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg font-bold shadow transition">View Projects</a>
          <a href="#contact" className="px-6 py-2 bg-white text-purple-800 hover:bg-purple-200 rounded-lg font-bold shadow transition">Contact Me</a>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 px-4 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-purple-300">Projects</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Messaging Web App */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col">
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
          <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col">
            <h4 className="text-2xl font-semibold mb-2 text-purple-200">Bouncing Balls</h4>
            <p className="mb-4 text-gray-200">Add bouncing balls here</p>
            <a href="#" className="mt-auto text-purple-400 hover:underline">View Details</a>
          </div>
        </div>
      </section>

      {/* CV/Resume */}
      <section id="cv" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-purple-300">CV / Resume</h3>
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700">
          <ul className="list-disc list-inside text-lg text-gray-200 space-y-2">
            <li>BSc Computer Science and Applied Mathematics, University of Stellenbosch (2023-present)</li>
            <li>Participated in the Prescient Investment Managements 2025 Hackathon</li>
            <li>Waiter at Dorp Bar, Stellenbosch (2023-2025)</li>
            {/* Add more experience/skills here */}
          </ul>
          <a href="#" className="inline-block mt-6 px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg font-bold shadow transition">Download CV</a>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-purple-300">Education</h3>
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700">
          <ul className="list-disc list-inside text-lg text-gray-200 space-y-2">
            <li>Graduated from Glenwood House highschool (2020)</li>
            <li>BSc Computer Science with Applied Mathematics, University of Stellenbosch (2023–2025)</li>
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
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col items-center">
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
