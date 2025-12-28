import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { User, Mail, Lock, ArrowRight, Zap, CheckCircle, AlertCircle } from 'lucide-react';

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

// --- Reusable Form Input ---
const FormField = ({ id, name, label, type, placeholder, icon: Icon, value, onChange }) => (
  <div className="space-y-2 group">
    <label
      htmlFor={id}
      className="text-sm font-bold text-gray-700 ml-1 group-focus-within:text-[#00B8D9] transition-colors"
    >
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#00B8D9] transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <input
        id={id}
        name={name}
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

const API_BASE_URL = import.meta.env.VITE_URL || 'http://localhost:5000';

const Register = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    if (user.password !== user.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      setIsLoading(false);
      return;
    }

    const url = `${API_BASE_URL}/register`;
    console.log('Register API URL:', url);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ credentials removed for registration to avoid cookie/CORS issues
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password
        })
      });

      // Handle non-JSON responses safely
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : await res.text();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Account created successfully! Redirecting...' });
        setTimeout(() => navigate('/login'), 1200);
      } else {
        const msg = typeof data === 'string' ? data : (data?.message || 'Registration failed.');
        setStatus({ type: 'error', message: msg });
      }
    } catch (err) {
      console.error('Register request failed:', err);
      setStatus({
        type: 'error',
        message:
          'Network error. Backend reachable nahi hai ya CORS/URL issue hai. Check API URL in console.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center p-4 pt-24 md:pt-32 relative overflow-hidden font-sans text-[#212529]">
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <BackgroundHexagon top="-10%" left="-5%" scale="1.8" className="text-[#00B8D9] opacity-5" />
        <BackgroundHexagon bottom="-10%" right="-5%" scale="1.5" className="text-gray-400 opacity-5" />
      </div>

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse relative z-10 min-h-[600px] mb-20">
        <div className="hidden md:flex w-1/2 bg-gradient-to-bl from-[#00B8D9] to-[#1e3a8a] p-12 flex-col justify-between relative overflow-hidden text-white">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">Logbook</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Join the Community.</h1>
            <p className="text-teal-100 text-lg max-w-sm">
              Create your free account today and start building a portfolio that stands out.
            </p>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 opacity-20 rounded-full blur-3xl -ml-16 -mb-16"></div>

          <div className="relative z-10 text-sm text-white/60">&copy; 2025 Logbook Inc.</div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Sign up to get started with Logbook.</p>
          </div>

          {status.message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-fade-in border ${status.type === 'success'
                  ? 'bg-green-50 text-green-700 border-green-100'
                  : 'bg-red-50 text-red-700 border-red-100'
                }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p>{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              id="username"
              name="username"
              label="Username"
              type="text"
              placeholder="johndoe"
              icon={User}
              value={user.username}
              onChange={handleChange}
            />

            <FormField
              id="email"
              name="email"
              label="Email Address"
              type="email"
              placeholder="name@college.edu"
              icon={Mail}
              value={user.email}
              onChange={handleChange}
            />

            <FormField
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={user.password}
              onChange={handleChange}
            />

            <FormField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={CheckCircle}
              value={user.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#00B8D9] hover:bg-[#00A0BC] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <>
                  Register
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#00B8D9] hover:text-[#009fb8] hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
=======

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/v1/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password
                })
            });

            const data = await res.json();
            if (res.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen p-4'>
            <div className='w-full max-w-md p-8 bg-white shadow-xl rounded-2xl'>
                <h1 className='text-4xl font-bold text-center text-gray-800'>Register</h1>
                <p className='text-center text-gray-600 mt-2'>Create a new account!</p>
                <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
                    <input
                        type='text'
                        placeholder='Username'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='username'
                        value={user.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='email'
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='password'
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='confirmPassword'
                        value={user.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type='submit'
                        className='p-3 w-full bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed'
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                    <div className='text-center mt-2'>
                        <p className='text-gray-600 text-sm'>
                            Already have an account?{' '}
                            <Link to='/login' className='text-blue-500 hover:underline'>
                                Click here
                            </Link>
                        </p>
                    </div>
                </form>

                {error && (
                    <div className='mt-4 p-3 w-full bg-red-100 border border-red-400 text-red-700 rounded-md text-center'>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
