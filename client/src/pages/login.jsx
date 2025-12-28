import React, { useState } from 'react';
import { Mail, Lock, LogIn, Chrome, Zap, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- Reusing Hexagon Background for Consistency ---
const BackgroundHexagon = ({ top, bottom, left, right, scale, className = 'opacity-30' }) => (
  <svg
    className={`absolute z-0 ${className}`}
    style={{ top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' }}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
  >
    <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" />
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

// --- Reusable Form Input ---
const FormField = ({ id, label, type, placeholder, icon: Icon, value, onChange }) => (
  <div className="space-y-2 group">
    <label htmlFor={id} className="text-sm font-bold text-gray-700 ml-1 group-focus-within:text-[#00B8D9] transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#00B8D9] transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/50 focus:border-[#00B8D9] transition-all duration-200"
      />
    </div>
  </div>
);

const API_BASE_URL = import.meta.env.VITE_URL || "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.open(`${API_BASE_URL}/auth/google`, "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : await res.text();

      if (!res.ok) {
        setError(typeof data === "string" ? data : (data?.message || "Invalid email or password."));
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Login error: Response format incorrect.");
        return;
      }

      localStorage.setItem("admin", JSON.stringify({
        id: user.id || user._id,
        username: user.username,
        email: user.email,
      }));

      navigate("/dashboard");
    } catch (err) {
      setError("Server unreachable. Check your API URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Updated container with pt-24 and md:pt-40 for header gap
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col items-center justify-start p-4 pt-24 md:pt-40 relative overflow-hidden font-sans text-[#212529]">
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <BackgroundHexagon top="-10%" left="-5%" scale="1.8" className="text-[#00B8D9] opacity-5" />
        <BackgroundHexagon bottom="-10%" right="-5%" scale="1.5" className="text-gray-400 opacity-5" />
      </div>

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[600px] mb-20">
        {/* Left Side (Blue Gradient Section) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#1e3a8a] to-[#00B8D9] p-12 flex-col justify-between relative overflow-hidden text-white">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-8 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">Logbook</span>
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Welcome Back, Scholar.</h1>
            <p className="text-teal-100 text-lg max-w-sm font-medium">
              Continue tracking your progress and achieving your academic goals.
            </p>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 opacity-20 rounded-full blur-3xl -ml-16 -mb-16"></div>

          <div className="relative z-10 text-sm text-white/60 font-bold">&copy; 2025 Logbook Inc.</div>
        </div>

        {/* Right Side (Form Section) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 font-medium">Access your dashboard using your credentials.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@college.edu"
              icon={Mail}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
            />

            <div className="space-y-2">
              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[#00B8D9] hover:text-[#009fb8] hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#00B8D9] hover:bg-[#00A0BC] text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : (
                <>
                  Login
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest text-[10px]">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <Chrome className="w-5 h-5 text-gray-900" />
            <span>Google</span>
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-black text-[#00B8D9] hover:text-[#009fb8] hover:underline transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;