import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './Landing';

function App() {

    return (
        <ThemeProvider>
            {/* Router enables navigation between different pages/routes */}
            <Router>
                <Routes>
                    {/* Main landing page route */}
                    <Route path="/" element={<Landing />} />
                    
                    {/* Fallback route - redirect any unknown paths to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;