import React from 'react';

export default function Landing({ onViewProject }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 text-white font-sans">
      {/* Hero/About Me */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <img src="https://avatars.githubusercontent.com/u/000000?v=4" alt="Profile" className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-lg mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">Jordan Ward</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-purple-300 mb-4">Aspiring Software Developer</h2>
        <p className="max-w-2xl text-lg md:text-xl text-gray-200 mb-6">Welcome to my portfolio! Check out my projects, experience, and more below.</p>
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
              className="mt-auto text-purple-400 hover:underline text-left"
            >
              View Project
            </button>
          </div>
          {/* Add more projects here */}
          <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col">
            <h4 className="text-2xl font-semibold mb-2 text-purple-200">Project Title</h4>
            <p className="mb-4 text-gray-200">Short description of another project. You can add as many projects as you like to showcase your work and skills.</p>
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

      {/* Contact / Socials */}
      <section id="contact" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-purple-300">Contact details</h3>
        <div className="bg-white/10 rounded-xl p-6 shadow-lg border border-purple-700 flex flex-col items-center">
          <p className="mb-4 text-lg text-gray-200">Feel free to reach out to connect and or collaborate!</p>
          <div className="flex gap-6 mb-4">
            <a href="mailto:your.jordyward041@gmail.com" className="text-purple-400 hover:text-purple-200 text-2xl"><i className="fas fa-envelope"></i> Email</a>
            <a href="https://github.com/Jordy-Ward" className="text-purple-400 hover:text-purple-200 text-2xl" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
}
