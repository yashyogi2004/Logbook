import React, { useState } from 'react';
import { Mail, ArrowLeft, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Reusing the Hexagon component for visual consistency
const BackgroundHexagon = ({ top, bottom, left, right, scale, className = 'opacity-30' }) => (
    <svg
        className={`absolute z-0 ${className}`}
        style={{ top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
    >
        <path
            d="M50 0L100 25V75L50 100L0 75V25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        />
        <path
            d="M50 0L100 25V75L50 100L0 75V25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            transform="translate(25, 25) scale(0.5)"
            opacity="0.5"
        />
    </svg>
);

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' }); // 'success' | 'error' | ''
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
        // Clear error/success messages when user starts typing again
        if (status.message) setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Using VITE_URL to keep it dynamic like your other components
            // Endpoint matches the route defined in your AuthRoutes.js
            const res = await fetch(`${import.meta.env.VITE_URL}/forgotPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include', 
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({
                    type: 'success',
                    message: 'Reset instructions have been sent to your email.'
                });
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || 'Failed to find account.'
                });
            }
        } catch (error) {
            console.error(error);
            setStatus({
                type: 'error',
                message: 'Network error. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center p-4 relative overflow-hidden font-sans text-[#212529]">
            
            {/* Background Decorations */}
            <div className="fixed inset-0 w-full h-full pointer-events-none">
                <BackgroundHexagon top="-5%" left="-5%" scale="1.5" className="text-[#00B8D9] opacity-10" />
                <BackgroundHexagon bottom="-10%" right="-5%" scale="1.2" className="text-gray-400 opacity-10" />
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10 relative z-10 transition-all hover:shadow-3xl">
                
                {/* Decorative Header Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#00B8D9]/10 text-[#00B8D9] mb-6 shadow-sm transform transition-transform hover:scale-110 duration-300">
                        <KeyRound className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Forgot Password?
                    </h2>
                    <p className="text-gray-500 text-sm">
                        No worries, enter your email and we'll send you reset instructions.
                    </p>
                </div>

                {/* Status Message (Success or Error) */}
                {status.message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-fade-in border ${
                        status.type === 'success' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                        {status.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <p>{status.message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#00B8D9] transition-colors">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/50 focus:border-[#00B8D9] transition-all duration-200"
                                placeholder="name@example.com"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-3.5 px-4 bg-[#00B8D9] hover:bg-[#00A0BC] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#00B8D9]/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending Link...
                            </span>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;