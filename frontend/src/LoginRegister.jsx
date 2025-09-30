import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

export default function LoginRegister({ onAuth, onBack }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (isLogin) {
                const res = await axios.post(`${API_BASE_URL}/api/rsa/login`, { username, password });
                setMessage('Login successful!');
                onAuth(res.data, username);
            } else {
                const res = await axios.post(`${API_BASE_URL}/api/rsa/register/registerUser`, { username, password });
                setMessage(res.data.message);
                if (res.data.privateKey) {
                    setPrivateKey(res.data.privateKey);
                }
            }
        } catch (err) {
            setMessage('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-500 to-purple-900">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-purple-200">
                {/* Back button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="self-start mb-4 px-4 py-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100 rounded-lg transition font-medium"
                    >
                        ← Back to Home
                    </button>
                )}
                <h2 className="text-3xl font-extrabold text-purple-700 mb-6 tracking-wide drop-shadow">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className="w-full mb-4 px-4 py-3 rounded-lg border border-purple-200 bg-purple-50 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full mb-6 px-4 py-3 rounded-lg border border-purple-200 bg-purple-50 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-lg shadow-md transition mb-2 text-lg tracking-wide"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button
                    onClick={() => { setIsLogin(!isLogin); setMessage(''); setPrivateKey(''); }}
                    className="mt-2 w-full text-purple-700 hover:text-purple-900 font-medium underline transition"
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
                {message && (
                    <div className={`mt-5 text-center font-medium ${message.startsWith('Error') ? 'text-red-500' : 'text-purple-700'}`}>
                        {message}
                    </div>
                )}
                {privateKey && (
                    <div className="mt-5 text-red-600 bg-red-50 border border-red-300 rounded-lg p-3 text-xs break-all">
                        <strong>Save your private key securely!</strong>
                        <pre className="whitespace-pre-wrap">{privateKey}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}