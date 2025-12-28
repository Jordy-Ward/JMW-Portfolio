import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

export default function BernoulliSiphon() {
  const navigate = useNavigate();
  const { username, jwt, logout } = useAuth();
  const { isDark } = useTheme();

  const scrollToSection = (sectionId) => {
    navigate('/', { state: { scrollTo: sectionId } });
  };

  return (
    <div className={`min-h-screen font-sans transition-colors ${
      isDark
        ? 'bg-gradient-to-br from-gray-800 to-black text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      <Header 
        username={username}
        jwt={jwt}
        onLogout={logout}
        onNavigate={scrollToSection}
        onGoHome={() => navigate('/')}
        onLogin={() => navigate('/login')}
      />
      
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 py-12">
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Siphon Demo
          </h1>
        </div>
        
        {/* Placeholder Content */}
        <div className={`rounded-xl p-8 border transition-colors ${
          isDark
            ? 'bg-white/5 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            How does a siphon work?
          </h2>
          
        </div>
      </div>
    </div>
  );
}