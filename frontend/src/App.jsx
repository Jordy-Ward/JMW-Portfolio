import React, { useState } from 'react';
import LoginRegister from './LoginRegister';
import Landing from './Landing';
import MessagingApp from './MessagingApp';

function App() {
    const [jwt, setJwt] = useState('');
    const [username, setUsername] = useState('');
    const [showMessaging, setShowMessaging] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    // Show login/register page when user wants to use the messaging app
    if (showLogin && !jwt) {
        return <LoginRegister 
            onAuth={(token, user) => { 
                setJwt(token); 
                setUsername(user); 
                setShowMessaging(true); // Go directly to messaging after login
            }} 
            onBack={() => setShowLogin(false)} // Allow going back to landing
        />;
    }

    // Show messaging app when authenticated and messaging is requested
    if (jwt && showMessaging) {
        return <MessagingApp 
            onBack={() => {
                setShowMessaging(false);
                setShowLogin(false);
            }} 
            username={username} 
            jwt={jwt} 
        />;
    }

    // Show landing page by default (even if authenticated)
    return <Landing 
        username={username} 
        jwt={jwt} 
        onViewProject={() => {
            if (jwt) {
                // If already logged in, go directly to messaging
                setShowMessaging(true);
            } else {
                // If not logged in, show login page first
                setShowLogin(true);
            }
        }}
    />;
}

export default App;