import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, Shield } from 'lucide-react';

const Login = ({ admin, setAdmin }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" }); // --- IGNORE ---
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user.email || !user.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin", JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email
        }));
        const storedUser = localStorage.getItem("admin");
        setAdmin({
          id:JSON.parse(storedUser).id,
          username:JSON.parse(storedUser).username,
          email:JSON.parse(storedUser).email
        });
         navigate("/dashboard");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/90 to-black"></div>
      </div>

      <div className="relative w-full max-w-lg z-10">
        {/* Main Login Card */}
        <div className="group relative">
          {/* Glowing Border Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-10 shadow-2xl">
            {/* Floating Elements */}
            <div className="absolute top-4 right-4">
              <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
            
            {/* Header Section */}
            <div className="text-center mb-10">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <LogIn className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-lg">Sign in to continue your journey</p>
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <div className="relative bg-red-500/10 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 mb-8">
                <div className="absolute inset-0 bg-red-500/5 rounded-xl"></div>
                <div className="relative flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 animate-pulse" />
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form Fields */}
           <form onSubmit={handleSubmit}>
             <div className="space-y-8">
              {/* Email Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors duration-300 ${
                        focusedField === 'email' ? 'text-purple-400' : 'text-gray-500'
                      }`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-300 ${
                        focusedField === 'password' ? 'text-purple-400' : 'text-gray-500'
                      }`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center group/eye"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 group-hover/eye:text-purple-400 transition-colors duration-200" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 group-hover/eye:text-purple-400 transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                <div className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform group-hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span className="text-lg">Signing you in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <LogIn className="h-6 w-6" />
                      <span className="text-lg">Sign In</span>
                    </div>
                  )}
                </div>
              </button>
            </div>

           </form>
            {/* Divider */}
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/80 text-gray-400">New to our platform?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="group relative inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <span className="relative">
                  Create your account
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </span>
                <span className="text-purple-400 group-hover:text-pink-400 transition-colors duration-200">→</span>
              </Link>
            </div>

            {/* Additional Links */}
            <div className="mt-8 text-center space-y-3">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <Shield className="h-4 w-4" />
            <span>Protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes tilt {
          0%, 50%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
        .animate-tilt {
          animation: tilt 6s infinite linear;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Login;