import React, { useState } from 'react';
import LoginRegister from './LoginRegister';

function App() {
    const [jwt, setJwt] = useState('');
    const [username, setUsername] = useState('');

    if (!jwt) {
        return <LoginRegister onAuth={(token, user) => { setJwt(token); setUsername(user); }} />;
    }

    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <p>Your JWT: <span style={{ wordBreak: 'break-all' }}>{jwt}</span></p>
            {/* Add your messaging UI here */}
        </div>
    );
}

export default App;