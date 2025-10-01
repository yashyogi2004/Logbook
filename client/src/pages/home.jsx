import React, { useState } from 'react';
import UserPreference from '../components/UserPreference';
import { Menu, X, Briefcase, Zap, Settings } from 'lucide-react';

const COLORS = {
    'gemini-teal': '#00B8D9',
    'gemini-cta': '#00A88E',
    'gemini-dark': '#212529',
    'gemini-light-bg': '#f7f8fa',
};

const customTailwindConfig = {
    theme: {
        extend: {
            colors: {
                'gemini-teal': COLORS['gemini-teal'],
                'gemini-cta': COLORS['gemini-cta'],
                'gemini-dark': COLORS['gemini-dark'],
                'gemini-light-bg': COLORS['gemini-light-bg'],
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
};

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
];

const BackgroundHexagon = ({ top, bottom, left, right, scale, className = 'opacity-30' }) => (
    <svg
        className={`absolute z-0 ${className}`} 
        style={{ top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M50 0L100 25V75L50 100L0 75V25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
        />
        <path
            d="M50 0L100 25V75L50 100L0 75V25Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            transform="translate(15, -15) scale(0.6)"
            opacity="0.5"
        />
    </svg>
);

const NetworkIllustration = ({ className = "h-24 w-24" }) => (
    <svg
        className={`text-gemini-teal ${className}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
        <path d="M17 10L12 15L7 10" />
        <path d="M12 2v20" />
        <path d="M2 7l10 5l10-5" />
        <circle cx="12" cy="15" r="3" fill="currentColor" className={`text-gemini-teal/50`} />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" className={`text-gemini-teal`} />
        <path d="M7 10l-5 3" />
        <path d="M17 10l5 3" />
    </svg>
);

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`);
        setIsOpen(false);
    };

    return (
        <header className='fixed top-0 left-0 w-full z-30 bg-white shadow-lg'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16 md:h-20'>
                    <div onClick={() => handleNavigation('/')} className='flex items-center space-x-2 cursor-pointer'>
                        <Zap className='h-6 w-6 text-gemini-teal' />
                        <span className='text-xl md:text-2xl font-extrabold text-gemini-dark'>
                            <span className="text-gemini-teal">Log</span>book
                        </span>
                    </div>

                    <nav className='hidden md:flex space-x-8'>
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className='text-gemini-dark font-medium text-lg hover:text-gray-600 transition duration-150 cursor-pointer relative group'
                            >
                                {item.name}
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gemini-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                            </div>
                        ))}
                    </nav>

                    <div className='hidden md:flex items-center space-x-3'>
                        <div
                            onClick={() => handleNavigation('/sign-up')}
                            className='block text-center px-6 py-2 border-2 border-gemini-teal text-white font-semibold rounded-full bg-gemini-teal transition duration-300 hover:opacity-90 cursor-pointer'
                        >
                            Sign Up
                        </div>
                        <div
                            onClick={() => handleNavigation('/sign-in')}
                            className='block text-center px-6 py-2 border-2 border-gemini-teal text-gemini-teal font-semibold rounded-full hover:bg-gemini-teal hover:text-white transition duration-300 cursor-pointer'
                        >
                            Sign In
                        </div>
                    </div>


                    <div className='flex md:hidden'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='inline-flex items-center justify-center p-2 rounded-md text-gemini-dark hover:text-gemini-teal hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gemini-teal'
                            aria-expanded='false'
                        >
                            <span className='sr-only'>Open main menu</span>
                            {isOpen ? (
                                <X className='block h-6 w-6' aria-hidden='true' />
                            ) : (
                                <Menu className='block h-6 w-6' aria-hidden='true' />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className='md:hidden bg-white shadow-xl pb-3'>
                    <div className='pt-2 pb-3 space-y-1 px-2'>
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className='block px-3 py-2 rounded-md text-base font-medium text-gemini-dark hover:bg-gray-50 hover:text-gemini-teal transition duration-150 cursor-pointer'
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                    <div className="px-5 pt-4 pb-4 space-y-3">
                        <div
                            onClick={() => handleNavigation('/sign-up')}
                            className="block w-full text-center px-4 py-2 border-2 border-gemini-teal text-white font-semibold rounded-full bg-gemini-teal transition duration-300 hover:opacity-90 cursor-pointer"
                        >
                            Sign Up
                        </div>
                        <div
                            onClick={() => handleNavigation('/sign-in')}
                            className="block w-full text-center px-4 py-2 border-2 border-gemini-teal text-gemini-teal font-semibold rounded-full hover:bg-gemini-teal hover:text-white transition duration-300 cursor-pointer"
                        >
                            Sign In
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const Navigation = ({ title, isActive, to }) => (
    <div
        onClick={() => console.log(`Navigating to: ${to}`)}
        className={`py-2 px-3 text-gemini-dark font-medium transition duration-300 hover:text-gemini-teal relative group ${isActive ? `border-b-2 border-gemini-teal` : ''} cursor-pointer`}
    >
        {title}
        {!isActive && (
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gemini-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
        )}
    </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div
        className={`bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-gemini-teal transform hover:-translate-y-1`}
    >
        <div className="flex items-center mb-4">
            <Icon className={`h-8 w-8 text-gemini-teal stroke-[1.5]`} />
            <h3 className={`text-xl font-bold text-gemini-dark ml-3`}>{title}</h3>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
            {description}
        </p>
    </div>
);

const HeroSection = () => (
    <section className={`bg-gemini-light-bg pt-24 pb-12 md:pt-32 md:pb-16 flex items-center justify-center min-h-screen`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
            <h1 className={`text-5xl md:text-6xl font-extrabold text-gemini-dark mb-4 leading-tight`}>
                About Our Mission
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
                Streamlining Academic Progress
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                Empowering college students and faculty with course logging, progress tracking, and collaboration tools.
            </p>
        </div>
    </section>
);

const FeaturesSection = () => {
    const features = [
        {
            icon: Briefcase,
            title: "Course Portfolio",
            description:
                "Comprehensive logging for projects, research, and coursework. Build a professional portfolio for career readiness and job applications.",
        },
        {
            icon: Settings,
            title: "Faculty/Admin Tools",
            description:
                "Robust dashboards for course monitoring, student performance tracking, and streamlined advising and departmental reporting.",
        },
        {
            icon: Zap,
            title: "Advising AI",
            description:
                "Data-driven recommendations for personalized degree paths and optimized resource allocation across college departments.",
        },
    ];

    return (
        <section className={`bg-gemini-light-bg pt-8 pb-16 md:pt-12 md:pb-20`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className={`text-2xl font-bold text-gemini-dark mb-8 pl-4 md:pl-0`}>
                    Our Vision
                </h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FooterCTA = () => (
    <section className="py-20 md:py-24 text-center bg-white">
        <div
            onClick={() => navigate('/login')}
            className="inline-block px-8 py-4 rounded-full font-bold text-lg text-white bg-[#00BFA6] transition duration-300 hover:bg-[#00BFA6]/80 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] cursor-pointer"
        >
            Join Our College Community
        </div>
    </section>
);

const App = () => {
    return (
        <div className={`min-h-screen bg-white font-sans antialiased text-gemini-dark`}>
            <script src="https://cdn.tailwindcss.com"></script>
            <script>{`
                tailwind.config = ${JSON.stringify(customTailwindConfig)};
            `}</script>

            <style>{`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: ${COLORS.DARK}; 
                }
            `}</style>

            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none text-sky-400">
                <BackgroundHexagon top="10%" left="5%" scale="0.7" className="hidden lg:block opacity-50" />
                <BackgroundHexagon top="50%" right="2%" scale="0.5" className="hidden lg:block opacity-30" />
                <BackgroundHexagon bottom="-10%" left="50%" scale="1.0" className="opacity-10" />

                <BackgroundHexagon 
                    top="50%" 
                    left="50%" 
                    scale="1.5" 
                    className="text-gemini-dark transform -translate-x-1/2 -translate-y-1/2 opacity-[0.05] hidden sm:block" 
                />
            </div>

            <main className="relative z-10">
                <HeroSection />
                <FeaturesSection />
                <FooterCTA />
            </main>
        </div>
    );
};

export default App;
