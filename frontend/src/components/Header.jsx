import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ username, jwt, onLogout, onNavigate, onGoHome, onLogin }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors ${
      isDark 
        ? 'bg-gray-950/80 border-gray-800' 
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
          <nav className="hidden md:flex items-center space-x-8">
            {/* Apps Navigation */}
            <button 
              onClick={() => onNavigate('apps')}
              className={`transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Apps
            </button>

            {/* Navigation Links */}
            <button 
              onClick={() => onNavigate('projects')}
              className={`transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Projects
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className={`transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* User Status & Theme Toggle */}
          <div className="flex items-center space-x-4">

            {jwt ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{username}</span>
                </div>
                <button
                  onClick={onLogout}
                  className={`text-sm transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Not signed in</span>
                </div>
                <button
                  onClick={onLogin}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                    isDark 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Login
                </button>
                {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white-400' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => onNavigate('apps')}
              className="text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}