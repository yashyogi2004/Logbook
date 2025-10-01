import React, { useState } from 'react';
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
