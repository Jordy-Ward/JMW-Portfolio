import React, { useState, useEffect, useRef } from 'react';

export default function Header({ username, jwt, onViewMessaging, onViewNews, onLogout, onNavigate, onGoHome, onLogin }) {
  const [showAppsDropdown, setShowAppsDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAppsDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const apps = [
    {
      name: 'PingChat',
      description: 'Secure RSA messaging app',
      icon: '💬',
      onClick: onViewMessaging,
      available: true
    },
    {
      name: 'News',
      description: 'Read up on what interests you',
      icon: '📰',
      onClick: onViewNews,
      available: true
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - Now clickable */}
          <div className="flex items-center">
            <button 
              onClick={onGoHome}
              className="text-xl font-bold text-purple-300 hover:text-purple-200 transition-colors"
            >
              JMW Industries
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Apps Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowAppsDropdown(!showAppsDropdown)}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Apps</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showAppsDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Apps Dropdown Menu */}
              {showAppsDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-md rounded-lg border border-purple-500/30 shadow-xl">
                  <div className="p-2">
                    {apps.map((app, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          app.onClick();
                          setShowAppsDropdown(false);
                        }}
                        disabled={!app.available}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                          app.available 
                            ? 'hover:bg-purple-700/50 text-white' 
                            : 'text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-xl">{app.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-gray-400">{app.description}</div>
                        </div>
                        {!app.available && (
                          <span className="text-xs bg-gray-600 px-2 py-1 rounded">Soon</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <button 
              onClick={() => onNavigate('projects')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* User Status */}
          <div className="flex items-center space-x-4">
            {jwt ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-purple-300 font-medium">{username}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowAppsDropdown(!showAppsDropdown)}
              className="text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Apps Menu */}
        {showAppsDropdown && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              {apps.map((app, index) => (
                <button
                  key={index}
                  onClick={() => {
                    app.onClick();
                    setShowAppsDropdown(false);
                  }}
                  disabled={!app.available}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    app.available 
                      ? 'hover:bg-purple-700/50 text-white' 
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xl">{app.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{app.name}</div>
                    <div className="text-sm text-gray-400">{app.description}</div>
                  </div>
                  {!app.available && (
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}