import React, { createContext, useContext, useState } from 'react';

// Create authentication context to share auth state across routes
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  // Authentication state (previously in App.jsx)
  const [jwt, setJwt] = useState('');
  const [username, setUsername] = useState('');

  // Login function - sets auth state
  const login = (token, user) => {
    setJwt(token);
    setUsername(user);
  };

  // Logout function - clears auth state
  const logout = () => {
    setJwt('');
    setUsername('');
  };

  // Check if user is authenticated
  const isAuthenticated = Boolean(jwt);

  // Auth context value object
  const value = {
    jwt,
    username,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};