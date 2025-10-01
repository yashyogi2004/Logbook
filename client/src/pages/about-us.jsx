import React from 'react';
import { NotebookText, Users, Zap, Compass, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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


const AboutUs = ({ Logout }) => {
    const effectiveLogout = Logout || (() => console.log("Mock Logout"));

    return (
        <div className="min-h-screen bg-gemini-light-bg font-sans antialiased text-gemini-dark relative overflow-hidden">
            <style>{`
                /* Global font and background */
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f7f8fa;
                }
            `}</style>

            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <BackgroundHexagon top="5%" left="0%" scale="0.8" className="text-gemini-teal opacity-20" />
                <BackgroundHexagon bottom="10%" right="-5%" scale="1.0" className="text-gray-300 opacity-20" />
                <BackgroundHexagon top="30%" right="40%" scale="0.5" className="text-gemini-teal opacity-10 hidden sm:block" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

                <header className="text-center mb-16">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gemini-teal/10 text-gemini-teal mb-4">
                        <NotebookText className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gemini-dark mb-4">
                        The Story Behind <span className="text-gemini-teal">Logbook</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We are dedicated to transforming the way students track, showcase, and leverage their educational achievements.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">

                    <div className="bg-white p-8 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl border border-gray-100">
                        <Zap className="h-8 w-8 text-gemini-teal mb-4" />
                        <h2 className="text-2xl font-bold text-gemini-dark mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To empower every student to capture the full scope of their college experience—from logs of daily activities to major project milestones—creating a comprehensive, verifiable record of their growth and skills development.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl border border-gray-100">
                        <Compass className="h-8 w-8 text-gemini-teal mb-4" />
                        <h2 className="text-2xl font-bold text-gemini-dark mb-4">Our Vision</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To be the leading platform for academic portfolio management, where a student's Logbook becomes their primary tool for career transition, job applications, and lifelong professional reference.
                        </p>
                    </div>
                </div>

                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold text-gemini-dark mb-10 border-b border-gemini-teal/50 pb-2 inline-block">
                        Meet the Core Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        <TeamCard
                            name=""
                            role="Founder & Lead Developer"
                            bio="A former student who built Logbook out of personal necessity for better project tracking."
                        />

                        <TeamCard
                            name=""
                            role="Design & UX Specialist"
                            bio="Focuses on making complex data organization feel intuitive and aesthetically pleasing for all users."
                        />

                        <TeamCard
                            name=""
                            role="Community & Support Lead"
                            bio="Ensures Logbook is meeting the real-world needs of students and educators across the globe."
                        />
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        Ready to start logging your success?
                    </h3>
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-[#00BFA6] text-white font-bold rounded-full text-lg hover:bg-[#00BFA6]/90 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
                    >
                        <Star className="w-5 h-5" />
                        <span>Go to Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const TeamCard = ({ name, role, bio }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
        <Users className="h-10 w-10 text-gemini-teal mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gemini-dark mb-1">{name}</h3>
        <p className="text-sm font-medium text-gemini-teal mb-3">{role}</p>
        <p className="text-gray-500 text-sm">{bio}</p>
    </div>
);

export default AboutUs;
