import React from 'react';
import { NotebookText, Users, Zap, Compass, Star, Code, PenTool, Heart } from 'lucide-react'; // Added generic icons for team roles
import { Link } from 'react-router-dom';

const BackgroundHexagon = ({ top, left, right, bottom, scale, className = 'opacity-30' }) => (
    <svg
        className={`absolute z-0 ${className}`}
        style={{ top, left, right, bottom, transform: `scale(${scale})`, pointerEvents: 'none' }}
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
    </svg>
);

const TeamCard = ({ name, role, bio, Icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center">
        <div className="p-3 bg-gray-50 rounded-full mb-4">
            <Icon className="h-8 w-8 text-[#00B8D9]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name || "Team Member"}</h3>
        <p className="text-sm font-semibold text-[#00B8D9] mb-3 uppercase tracking-wider">{role}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>
    </div>
);

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#f7f8fa] font-sans antialiased text-gray-900 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
                <BackgroundHexagon top="-5%" left="-5%" scale="1.5" className="text-[#00B8D9] opacity-10" />
                <BackgroundHexagon bottom="-10%" right="-5%" scale="2" className="text-gray-300 opacity-10" />
                <BackgroundHexagon top="40%" right="10%" scale="0.8" className="text-[#00B8D9] opacity-5 hidden lg:block" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section */}
                <header className="text-center mb-20">
                    <div className="h-8 w-20 mb-8 mx-auto invisible"></div>

                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        The Story Behind <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-teal-500">Logbook</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                        We are dedicated to transforming the way students <span className="font-semibold text-gray-800">track</span>, <span className="font-semibold text-gray-800">showcase</span>, and <span className="font-semibold text-gray-800">leverage</span> their educational achievements.
                    </p>
                </header>

                {/* Mission & Vision Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="h-24 w-24 text-[#00B8D9]" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-6">
                                <Zap className="h-6 w-6 text-[#00B8D9]" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                To empower every student to capture the full scope of their college experience—from logs of daily activities to major project milestones—creating a comprehensive, verifiable record of their growth and skills development.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Compass className="h-24 w-24 text-[#00B8D9]" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-6">
                                <Compass className="h-6 w-6 text-[#00B8D9]" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                To be the leading platform for academic portfolio management, where a student's Logbook becomes their primary tool for career transition, job applications, and lifelong professional reference.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Core Team</h2>
                        <div className="h-1 w-20 bg-[#00B8D9] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <TeamCard
                            name="Alex Dev"
                            role="Founder & Lead Developer"
                            bio="A former student who built Logbook out of personal necessity for better project tracking."
                            Icon={Code}
                        />
                        <TeamCard
                            name="Sarah Design"
                            role="Design & UX Specialist"
                            bio="Focuses on making complex data organization feel intuitive and aesthetically pleasing."
                            Icon={PenTool}
                        />
                        <TeamCard
                            name="Jordan Community"
                            role="Community & Support Lead"
                            bio="Ensures Logbook is meeting the real-world needs of students and educators across the globe."
                            Icon={Heart}
                        />
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center pb-8">
                    <div className="bg-[#00B8D9] rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-[#00B8D9] opacity-90"></div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 -mt-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 right-0 -mb-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to start logging your success?
                            </h3>
                            <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of students who are already taking control of their academic journey.
                            </p>
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center space-x-2 px-10 py-4 bg-white text-[#00B8D9] font-bold rounded-full text-lg hover:bg-gray-50 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Star className="w-5 h-5 fill-current" />
                                <span>Go to Dashboard</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;