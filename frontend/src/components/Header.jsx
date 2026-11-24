import React from 'react';

export default function Header({ onNavigate, onGoHome }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b bg-white/80 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Now clickable */}
          <div className="flex items-center">
            <button
              onClick={onGoHome}
              className="text-xl font-bold transition-colors text-gray-900 hover:text-gray-600"
            >
              JMW Industries
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 md:space-x-8">
            {/* Navigation Links */}
            <button
              onClick={() => onNavigate('contact')}
              className="transition-colors text-sm md:text-base text-gray-600 hover:text-gray-900"
            >
              Contact
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
