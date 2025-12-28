import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import axios from 'axios';
import { API_BASE_URL } from './config';
import KeyDeliveryModal from './components/KeyDeliveryModal';

export default function LoginRegister() {
    // Router navigation hook
    const navigate = useNavigate();
    const location = useLocation();
    
    // Auth context for login function
    const { login } = useAuth();
    const { isDark } = useTheme();
    
    // Determine where to redirect after login
    const from = location.state?.from?.pathname || '/';
    
    // Local component state (unchanged)
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [message, setMessage] = useState('');
    const [showKeyModal, setShowKeyModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (isLogin) {
                const res = await axios.post(`${API_BASE_URL}/api/rsa/login`, { username, password });
                setMessage('Login successful!');
                // Use auth context login and navigate back to where user came from
                login(res.data.token, username);
                navigate(from, { replace: true });
            } else {
                const res = await axios.post(`${API_BASE_URL}/api/rsa/register/registerUser`, { username, password });
                setMessage(res.data.message);
                if (res.data.privateKey) {
                    setPrivateKey(res.data.privateKey);
                    setShowKeyModal(true);
                }
            }
        } catch (err) {
            setMessage('Error: ' + (err.response?.data?.error || err.response?.data?.message || err.message));
        }
    };

    // Handle saving key to localStorage
    const handleSaveKeyLocally = (key) => {
        try {
            localStorage.setItem(`privateKey_${username}`, key);
            localStorage.setItem(`keyCreatedAt_${username}`, Date.now().toString());
            setMessage('Key saved to browser for automatic decryption!');
        } catch (err) {
            console.error('Failed to save key locally:', err);
            setMessage('Warning: Could not save key to browser storage.');
        }
    };

    // Handle closing the key modal
    const handleCloseKeyModal = () => {
        setShowKeyModal(false);
        // Switch to login mode after successful registration and key backup
        setIsLogin(true);
        // Clear the registration form but keep username for convenience
        setPassword('');
        setMessage('Registration successful! Please log in with your new account.');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors ${
            isDark 
                ? 'bg-gradient-to-br from-gray-800 to-black' 
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>
            <div className={`backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center transition-colors ${
                isDark
                    ? 'bg-white/5 border border-gray-700'
                    : 'bg-white/90 border border-gray-200'
            }`}>
                {/* Back button - now uses router navigation */}
                <button
                    onClick={() => navigate('/')}  // Navigate back to landing page
                    className={`self-start mb-4 px-4 py-2 rounded-lg transition font-medium ${
                        isDark
                            ? 'text-gray-300 hover:text-white hover:bg-white/10'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                    ← Back to Home
                </button>
                <h2 className={`text-3xl font-extrabold mb-6 tracking-wide drop-shadow ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        className={`w-full mb-4 px-4 py-3 rounded-lg border text-lg focus:outline-none focus:ring-2 transition ${
                            isDark
                                ? 'bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-gray-400'
                        }`}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className={`w-full mb-6 px-4 py-3 rounded-lg border text-lg focus:outline-none focus:ring-2 transition ${
                            isDark
                                ? 'bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:ring-gray-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-gray-400'
                        }`}
                    />
                    <button
                        type="submit"
                        className={`w-full py-3 font-semibold rounded-lg shadow-md transition mb-2 text-lg tracking-wide ${
                            isDark
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button
                    onClick={() => { setIsLogin(!isLogin); setMessage(''); setPrivateKey(''); }}
                    className={`mt-2 w-full font-medium underline transition ${
                        isDark
                            ? 'text-gray-300 hover:text-white'
                            : 'text-gray-700 hover:text-gray-900'
                    }`}
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
                {message && (
                    <div className={`mt-5 text-center font-medium ${
                        message.startsWith('Error') 
                            ? 'text-red-500' 
                            : isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
            
            {/* Key Delivery Modal */}
            <KeyDeliveryModal
                isOpen={showKeyModal}
                onClose={handleCloseKeyModal}
                privateKey={privateKey}
                username={username}
                onSaveLocally={handleSaveKeyLocally}
            />
        </div>
    );
}