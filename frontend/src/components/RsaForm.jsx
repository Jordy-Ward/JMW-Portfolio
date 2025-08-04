import React, { useState } from 'react';

const RsaForm = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [message, setMessage] = useState('');
    const [encryptedMessage, setEncryptedMessage] = useState('');

    const handleGenerateKeys = async () => {
        const response = await fetch('/api/generateKeyPair', { method: 'POST' });
        const data = await response.json();
        setPublicKey(data.publicKey);
        setPrivateKey(data.privateKey);
    };

    const handleEncryptMessage = async () => {
        const response = await fetch('/api/encryptText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicKey, message }),
        });
        const data = await response.json();
        setEncryptedMessage(data.encryptedText);
    };

    return (
        <div>
            <h2>RSA Encryption</h2>
            <button onClick={handleGenerateKeys}>Generate RSA Keys</button>
            <div>
                <h3>Public Key</h3>
                <textarea value={publicKey} readOnly />
                <h3>Private Key</h3>
                <textarea value={privateKey} readOnly />
            </div>
            <div>
                <h3>Message to Encrypt</h3>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={handleEncryptMessage}>Encrypt Message</button>
            </div>
            <div>
                <h3>Encrypted Message</h3>
                <textarea value={encryptedMessage} readOnly />
            </div>
        </div>
    );
};

export default RsaForm;