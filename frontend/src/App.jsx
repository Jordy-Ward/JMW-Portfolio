import React, { useState } from 'react';
import axios from 'axios';

function App() {

    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [modulus, setModulus] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [cipherText, setCiphertext] = useState('');
    const [decryptedText, setDecryptedText] = useState('');

    const generateKeyPair = async () => {
        try {
            //backend returns a RsaKeyPair object, which has private fields (publicKey, privateKey, modulus) and 
            //public getters/setters. When you return this object from a Spring REST controller, Spring Boot automatically 
            // converts (serializes) it to JSON using the getters.
            const res = await axios.post('http://localhost:8080/api/rsa/generate-key-pair');
            setPublicKey(res.data.publicKey);
            setPrivateKey(res.data.privateKey);
            setModulus(res.data.modulus);
            console.log('Key pair generated successfully:', res.data);
        } catch (error) {
            console.error('Error generating key pair:', error);
        }
    }

    const encrypt = async () => {
        const res = await axios.post('http://localhost:8080/api/rsa/encrypt', null, {
            params: {
                plaintext,
                publicKey,
                modulus
            }
        });
        setCiphertext(res.data);
    };

    const decrypt = async () => {
        const res = await axios.post('http://localhost:8080/api/rsa/decrypt', null, {
            params: {
                cipherText,
                privateKey,
                modulus
            }
        });
        setDecryptedText(res.data);
    }

    return (
        <div className="App">
            <h1>RSA Encryption Web App</h1>
            <button onClick={generateKeyPair}>Generate Key Pair</button>
            <div>
                <p>Public Key: {publicKey}</p>
                <p>Private Key: {privateKey}</p>
                <p>Modulus: {modulus}</p>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Plaintext"
                    value={plaintext}
                    onChange={e => setPlaintext(e.target.value)}
                 />
                 <button onClick={encrypt}>Encrypt</button>
                 <p>Cipher Text: {cipherText}</p>
            </div>
            <div>
                <button onClick={decrypt}>Decrypt</button>
                <p>Decrypted Text: {decryptedText}</p>
            </div>
        </div>
    );
}

export default App;