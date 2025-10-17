import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginRegister from './LoginRegister';
import Landing from './Landing';
import MessagingApp from './MessagingApp';
import NewsApp from './NewsApp';
import BernoulliSiphon from './BernoulliSiphon';

function App() {
    return (
        // AuthProvider wraps entire app to provide auth state to all components
        <AuthProvider>
            {/* Router enables navigation between different pages/routes */}
            <Router>
                <Routes>
                    {/* Main landing page route */}
                    <Route path="/" element={<Landing />} />
                    
                    {/* Login/Register page route */}
                    <Route path="/login" element={<LoginRegister />} />
                    
                    {/* Messaging app route - protected, requires authentication */}
                    <Route path="/messaging" element={<ProtectedMessagingRoute />} />

                    {/* News app route */}
                    <Route path="/news" element={<NewsApp/>}/>
                    
                    {/* Bernoulli Siphon demonstration route */}
                    <Route path="/siphon" element={<BernoulliSiphon />} />
                    
                    {/* Fallback route - redirect any unknown paths to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// Protected route component for messaging app
// Automatically redirects to login if user is not authenticated
function ProtectedMessagingRoute() {
    const { isAuthenticated } = useAuth();
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // If authenticated, show the messaging app
    return <MessagingApp />;
}

export default App;