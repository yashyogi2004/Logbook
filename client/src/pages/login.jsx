import React, { useState } from 'react';
<<<<<<< HEAD
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
=======
import { Mail, Lock, UserPlus, LogIn, Chrome, Zap, Menu, X } from 'lucide-react';

const customTailwindConfig = {
    theme: {
        extend: {
            colors: {
                'gemini-teal': '#00B8D9',
                'gemini-dark': '#212529',
                'gemini-light-bg': '#f7f8fa',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
};

const BackgroundHexagon = ({ top, left, right, scale, className = 'opacity-30' }) => (
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
        <path
            d="M50 0L100 25V75L50 100L0 75V25Z"
            fill="none"
            stroke="#00B8D9"
            strokeWidth="3"
            transform="translate(15, -15) scale(0.6)"
            opacity="0.5"
        />
    </svg>
);

const SocialButton = ({ icon: Icon, text }) => (
    <button className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-200 text-gemini-dark font-medium rounded-xl shadow-sm hover:bg-gray-50 transition duration-150">
        <Icon className="w-5 h-5 mr-3 text-gray-700" />
        {text}
    </button>
);

const FormField = ({ id, label, type, placeholder, icon: Icon, value, onChange }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
            {label}
        </label>
        <div className="relative">
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                required
                value={value}
                onChange={onChange}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-gemini-teal focus:border-gemini-teal transition duration-150"
            />
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
    </div>
);



const LoginForm = ({ isSignUp, setIsSignUp }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = isSignUp ? { name, email, password } : { email, password };

            const res = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });


            const data = await res.json();

            if (res.ok) {
                if (isSignUp) {
                    alert("Registered Successfully!");
                    window.location.href = "/login";
                } else {
                    localStorage.setItem("admin", JSON.stringify({
                        id: data.user.id,
                        username: data.user.username,
                        email: data.user.email,
                    }));
                    alert("Logged in Successfully!");
                    window.location.href = "/dashboard";
                }
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Login/Register Error:", error);
            alert("Server Error, please try again later.");
        }
    };


    return (
        <div className="w-full max-w-sm md:max-w-md p-6 sm:p-8 lg:p-10 bg-gemini-light-bg rounded-2xl shadow-2xl">
            <div className="flex bg-white rounded-full p-1 mb-8 shadow-inner">
                <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2.5 rounded-full font-bold transition-all duration-300 ${!isSignUp
                        ? 'bg-[#00BFA6] text-white shadow-md'
                        : 'text-gray-500 hover:text-text-[#00796B]'
                        }`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2.5 rounded-full font-bold transition-all duration-300 ${isSignUp
                        ? 'bg-[#00BFA6] text-white shadow-md'
                        : 'text-gray-500 hover:text-text-[#00796B]'
                        }`}
                >
                    Sign Up
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <SocialButton icon={Chrome} text="Continue with Google" />

                <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">
                        OR {isSignUp ? 'REGISTER' : 'LOG IN'}
                    </span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {isSignUp && (
                    <FormField
                        id="name"
                        label="Full Name"
                        type="text"
                        placeholder="Your Full Name"
                        icon={UserPlus}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}

                <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="name@college.edu"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <FormField
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex items-center justify-between text-sm pt-2">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-gemini-teal border-gray-300 rounded focus:ring-gemini-teal"
                        />
                        <label htmlFor="remember-me" className="ml-2 text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <a href="/forgot-password" className="font-medium text-gemini-teal hover:underline transition duration-150">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 mt-4 rounded-xl font-bold text-lg text-white bg-[#00BFA6] transition duration-300 hover:bg-[#00BFA6]/80 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    <LogIn className="w-5 h-5 mr-2" />
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
                {!isSignUp ? (
                    <span>
                        Don't have an account?{' '}
                        <a href="#" onClick={() => setIsSignUp(true)} className="font-bold text-gemini-teal hover:underline transition duration-150">
                            Sign Up
                        </a>
                    </span>
                ) : (
                    <span>
                        Already have an account?{' '}
                        <a href="#" onClick={() => setIsSignUp(false)} className="font-bold text-gemini-teal hover:underline transition duration-150">
                            Sign In
                        </a>
                    </span>
                )}
            </div>
        </div>
    );
};

const App = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    React.useEffect(() => {
        if (typeof tailwind !== 'undefined') {
            tailwind.config = customTailwindConfig;
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gemini-light-bg font-sans antialiased text-gemini-dark relative overflow-hidden">
            <style>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #f7f8fa;
        }
      `}</style>

            <BackgroundHexagon top="5%" left="0%" scale="0.9" className="opacity-40 hidden md:block" />
            <BackgroundHexagon bottom="10%" left="30%" scale="0.6" className="opacity-20 hidden md:block" />
            <main className="flex-grow flex justify-center pt-28 pb-12">
                <div className="container mx-auto flex flex-col md:flex-row md:min-h-[80vh] w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden">

                    <div className="w-full md:w-5/12 lg:w-4/12 flex items-center justify-center p-8 md:p-12 bg-white relative z-10 text-center md:text-left">
                        <div className="absolute top-8 left-8 text-2xl font-extrabold text-gemini-dark">
                            <span className="text-gemini-teal">Log</span>book
                        </div>

                        <div className="relative">
                            <BackgroundHexagon top="-50px" right="-50px" scale="0.8" className="opacity-70 text-gray-200" />

                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gemini-dark leading-tight z-20 relative">
                                Your Academic Journey, Organized
                            </h1>
                            <p className="mt-4 text-gray-600 text-lg">
                                Logbook helps you track every achievement, project, and course, turning your college experience into a dynamic portfolio.
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-7/12 lg:w-8/12 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gemini-light-bg">
                        <LoginForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
