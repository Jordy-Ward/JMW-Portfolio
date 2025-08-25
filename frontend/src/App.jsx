import React, { useState } from 'react';
import LoginRegister from './LoginRegister';
import Landing from './Landing';
import MessagingApp from './MessagingApp';

function App() {
    const [jwt, setJwt] = useState('');
    const [username, setUsername] = useState('');
    const [showMessaging, setShowMessaging] = useState(false);

    if (!jwt) {
        return <LoginRegister onAuth={(token, user) => { setJwt(token); setUsername(user); }} />;
    }

    if (showMessaging) {
        return <MessagingApp onBack={() => setShowMessaging(false)} username={username} jwt={jwt} />;
    }

    return <Landing username={username} jwt={jwt} onViewProject={() => setShowMessaging(true)} />;
}

export default App;