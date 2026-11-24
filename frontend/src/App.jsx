import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';

function App() {

    return (
        // Router enables navigation between different pages/routes
        <Router>
            <Routes>
                {/* Main landing page route */}
                <Route path="/" element={<Landing />} />

                {/* Fallback route - redirect any unknown paths to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
