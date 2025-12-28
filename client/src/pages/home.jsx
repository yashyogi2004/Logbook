import React, { useState } from 'react';
import { Menu, X, Briefcase, Zap, Settings, ArrowRight, CheckCircle, Star } from 'lucide-react';
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

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about-us' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-[#00B8D9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-2xl font-extrabold text-[#212529] tracking-tight">
                            Log<span className="text-[#00B8D9]">book</span>
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-600 font-medium hover:text-[#00B8D9] transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00B8D9] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="text-gray-600 font-semibold hover:text-[#00B8D9] transition-colors">
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-2.5 bg-[#00B8D9] text-white font-bold rounded-full hover:bg-[#009fb8] transition-all shadow-lg hover:shadow-teal-200 hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-[#00B8D9] hover:bg-gray-50 rounded-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-3">
                            <Link
                                to="/login"
                                className="block w-full text-center px-4 py-3 text-[#00B8D9] font-bold border-2 border-[#00B8D9] rounded-xl hover:bg-teal-50"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="block w-full text-center px-4 py-3 bg-[#00B8D9] text-white font-bold rounded-xl shadow-md"
                                onClick={() => setIsOpen(false)}
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div 
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-[#00B8D9]/30 hover:-translate-y-2 group relative overflow-hidden"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:from-teal-50 group-hover:to-teal-100 transition-colors"></div>
        
        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00B8D9] transition-colors duration-300">
            <Icon className="h-7 w-7 text-[#00B8D9] group-hover:text-white transition-colors duration-300" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
            {description}
        </p>
    </div>
);

const Home = () => {
    return (
        <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#212529] relative overflow-x-hidden">
            <Navbar />

            {/* Background Decorations */}
            <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
                <BackgroundHexagon top="15%" right="-5%" scale="1.8" className="text-[#00B8D9] opacity-5" />
                <BackgroundHexagon bottom="10%" left="-5%" scale="1.5" className="text-gray-400 opacity-5" />
                <div className="absolute top-40 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
            </div>

            <main className="relative z-10 pt-32 pb-16">
                
                {/* Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-[#00B8D9] font-semibold text-sm mb-8 border border-teal-100 shadow-sm animate-fade-in-up">
                            <Star className="w-4 h-4 fill-current" />
                            <span>Trusted by 10,000+ Students</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-teal-500">Academic Journey</span> Like a Pro
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Logbook is the ultimate portfolio tool for students. Capture progress, showcase projects, and streamline your path to success.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/register"
                                className="px-10 py-4 bg-[#00B8D9] text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:bg-[#00A0BC] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                Start Logging Now
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/about-us"
                                className="px-10 py-4 bg-white text-gray-700 text-lg font-bold rounded-full shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                            >
                                Learn More
                            </Link>
                        </div>

                        {/* Social Proof / Stats */}
                        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Active Users', value: '10k+' },
                                { label: 'Logs Created', value: '1M+' },
                                { label: 'Universities', value: '50+' },
                                { label: 'Career Rating', value: '4.9/5' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wide mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Logbook?</h2>
                        <div className="w-20 h-1.5 bg-[#00B8D9] rounded-full mx-auto"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Briefcase}
                            title="Digital Portfolio"
                            description="Automatically compile your daily logs into a professional portfolio ready for job applications and internships."
                            delay={100}
                        />
                        <FeatureCard
                            icon={Settings}
                            title="Faculty Tools"
                            description="Advisors can monitor student progress in real-time, providing targeted feedback without the email clutter."
                            delay={200}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Smart Analytics"
                            description="Visualize your productivity with built-in charts. See exactly where your time goes and optimize your study habits."
                            delay={300}
                        />
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#212529] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                        {/* Abstract shapes */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-[#00B8D9] opacity-10 rounded-full blur-3xl -ml-20 -mt-20"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-400 opacity-10 rounded-full blur-3xl -mr-20 -mb-20"></div>
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Ready to Take Control of Your Future?
                            </h2>
                            <p className="text-gray-400 text-lg mb-10">
                                Join the community of students who are turning their daily efforts into tangible career success.
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center px-12 py-5 bg-[#00B8D9] text-white font-bold text-xl rounded-full hover:bg-[#00a0bc] transition-all transform hover:scale-105 shadow-xl hover:shadow-teal-900/50"
                            >
                                Join For Free
                                <CheckCircle className="ml-2 w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            
        </div>
    );
};

export default Home;