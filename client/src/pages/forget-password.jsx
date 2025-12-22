import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowLeft, AlertCircle, Sparkles, Shield, CheckCircle, Send, Lock } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const otpRefs = useRef([]);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/forgotPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setStep(2);
        setResendTimer(60);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Unable to process request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode })
      });

      if (res.ok) {
        setStep(3);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/resendOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError("Unable to resend OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp: otp.join(''),
          newPassword 
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/90 to-black"></div>
      </div>

      <div className="relative w-full max-w-lg z-10">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-10 shadow-2xl">
            <div className="absolute top-4 right-4">
              <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
            
            {/* Back Button */}
            {!success && (
              <a
                href="/login"
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-8 group/back"
              >
                <ArrowLeft className="h-5 w-5 group-hover/back:-translate-x-1 transition-transform duration-200" />
                <span>Back to login</span>
              </a>
            )}

            {/* Success State */}
            {success ? (
              <div className="text-center py-8">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur-lg opacity-50"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
                  Password Reset Successfully
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>

                <a
                  href="/login"
                  className="relative inline-block group/btn overflow-hidden"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-70 group-hover/btn:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200">
                    Return to Login
                  </div>
                </a>
              </div>
            ) : (
              <>
                {/* Step 1: Email */}
                {step === 1 && (
                  <>
                    <div className="text-center mb-10">
                      <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                          <Mail className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                        Reset Password
                      </h1>
                      <p className="text-gray-400 text-lg">
                        Enter your email to receive a verification code
                      </p>
                    </div>

                    {error && (
                      <div className="relative bg-red-500/10 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 mb-8">
                        <div className="absolute inset-0 bg-red-500/5 rounded-xl"></div>
                        <div className="relative flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 animate-pulse" />
                          <p className="text-red-300 text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
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
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Enter your email address"
                              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleEmailSubmit}
                        disabled={loading}
                        className="relative w-full group overflow-hidden"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform group-hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                          {loading ? (
                            <div className="flex items-center justify-center space-x-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              <span className="text-lg">Sending Code...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-3">
                              <Send className="h-6 w-6" />
                              <span className="text-lg">Send Verification Code</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <>
                    <div className="text-center mb-10">
                      <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                          <Shield className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                        Verify Your Email
                      </h1>
                      <p className="text-gray-400 text-lg mb-2">
                        Enter the 6-digit code sent to
                      </p>
                      <p className="text-purple-400 font-medium">{email}</p>
                    </div>

                    {error && (
                      <div className="relative bg-red-500/10 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 mb-8">
                        <div className="absolute inset-0 bg-red-500/5 rounded-xl"></div>
                        <div className="relative flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 animate-pulse" />
                          <p className="text-red-300 text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider text-center block">
                          Verification Code
                        </label>
                        <div className="flex justify-center space-x-3">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => (otpRefs.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              onPaste={index === 0 ? handleOtpPaste : undefined}
                              className="w-14 h-14 text-center text-2xl font-bold bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleOtpSubmit}
                        disabled={loading}
                        className="relative w-full group overflow-hidden"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform group-hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                          {loading ? (
                            <div className="flex items-center justify-center space-x-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              <span className="text-lg">Verifying...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-3">
                              <CheckCircle className="h-6 w-6" />
                              <span className="text-lg">Verify Code</span>
                            </div>
                          )}
                        </div>
                      </button>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
                        {resendTimer > 0 ? (
                          <p className="text-purple-400 font-medium">
                            Resend available in {resendTimer}s
                          </p>
                        ) : (
                          <button
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="text-purple-400 hover:text-pink-400 transition-colors duration-200 font-medium disabled:opacity-50"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                  <>
                    <div className="text-center mb-10">
                      <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                          <Lock className="h-10 w-10 text-white" />
                        </div>
                      </div>
                      
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3">
                        Create New Password
                      </h1>
                      <p className="text-gray-400 text-lg">
                        Choose a strong password for your account
                      </p>
                    </div>

                    {error && (
                      <div className="relative bg-red-500/10 border border-red-500/30 backdrop-blur-sm rounded-xl p-4 mb-8">
                        <div className="absolute inset-0 bg-red-500/5 rounded-xl"></div>
                        <div className="relative flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 animate-pulse" />
                          <p className="text-red-300 text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          New Password
                        </label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Lock className={`h-5 w-5 transition-colors duration-300 ${
                                focusedField === 'newPassword' ? 'text-purple-400' : 'text-gray-500'
                              }`} />
                            </div>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              onFocus={() => setFocusedField('newPassword')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Enter new password"
                              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Lock className={`h-5 w-5 transition-colors duration-300 ${
                                focusedField === 'confirmPassword' ? 'text-purple-400' : 'text-gray-500'
                              }`} />
                            </div>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              onFocus={() => setFocusedField('confirmPassword')}
                              onBlur={() => setFocusedField(null)}
                              placeholder="Confirm new password"
                              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handlePasswordSubmit}
                        disabled={loading}
                        className="relative w-full group overflow-hidden"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform group-hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                          {loading ? (
                            <div className="flex items-center justify-center space-x-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              <span className="text-lg">Resetting Password...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-3">
                              <Lock className="h-6 w-6" />
                              <span className="text-lg">Reset Password</span>
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <Shield className="h-4 w-4" />
            <span>Protected with enterprise-grade security</span>
          </div>
        </div>
      </div>

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

export default ForgotPassword;