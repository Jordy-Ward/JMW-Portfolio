import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ onNavigate, onGoHome }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors ${
      isDark 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Now clickable */}
          <div className="flex items-center">
            <button 
              onClick={onGoHome}
              className={`text-xl font-bold transition-colors ${
                isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'
              }`}
            >
              JMW Industries
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 md:space-x-8">
            {/* Navigation Links */}
            <button 
              onClick={() => onNavigate('projects')}
              className={`transition-colors text-sm md:text-base ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Projects
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className={`transition-colors text-sm md:text-base ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 text-xs md:text-sm ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}