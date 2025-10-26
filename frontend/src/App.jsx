import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginRegister from './LoginRegister';
import Landing from './Landing';
import MessagingApp from './MessagingApp';
import NewsApp from './NewsApp';
import BernoulliSiphon from './BernoulliSiphon';

function App() {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        // Check if user has already seen this notification
        const hasSeenNotification = sessionStorage.getItem('hasSeenMaintenanceNotification');
        
        if (!hasSeenNotification) {
            setShowNotification(true);
        }
    }, []);

    const handleCloseNotification = () => {
        setShowNotification(false);
        sessionStorage.setItem('hasSeenMaintenanceNotification', 'true');
    };

    return (
        // AuthProvider wraps entire app to provide auth state to all components
        <AuthProvider>
            {/* Maintenance Notification */}
            {showNotification && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🚧</span>
                            <h2 className="text-lg font-bold text-gray-800">Backend Maintenance</h2>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Backend hosting is currently being updated. All backend functionality 
                            (login, registration, messaging) is temporarily unavailable until further notice.
                        </p>
                        <p className="text-sm text-blue-600 mb-4">
                            Portfolio features and demos remain fully functional.
                        </p>
                        <button
                            onClick={handleCloseNotification}
                            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium transition"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
            
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