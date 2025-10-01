import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const apiBaseUrl = 'http://localhost:5000';

const BackgroundHexagon = ({ top, left, right, scale, className }) => (
    <svg 
        className={`absolute z-0 ${className}`}
        style={{ top, left, right, transform: `scale(${scale})`, pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M50 0L100 25V75L50 100L0 75V25Z"
            fill="none"
            stroke="#00B8D9" 
            strokeWidth="3"
        />
    </svg>
);

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${apiBaseUrl}/api/v1/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include', 
            });

            if (res.ok) {
                setMessage('A password reset link has been successfully sent to your email address.');
            } else {
                const errorData = await res.json();
                setMessage(errorData.message || 'Failed to send reset email. Please ensure the email is registered.');
            }
        } catch (error) {
            setMessage('An unexpected network error occurred. Please try again.');
            console.error('Password reset request error:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <BackgroundHexagon top="5%" left="0%" scale="0.9" className="opacity-10" />
                <BackgroundHexagon bottom="10%" right="-5%" scale="1.2" className="opacity-15" />
            </div>

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200 z-10">
                
                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
                    Forgot Password
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Enter your email to receive a password reset link.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                required
                                value={email} 
                                onChange={handleChange} 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200 disabled:bg-teal-400 disabled:cursor-not-allowed"
                        disabled={loading || !email} 
                    >
                        {loading ? 'Sending Request...' : 'Send Reset Link'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-xl text-center text-sm ${message.includes('successfully sent') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
