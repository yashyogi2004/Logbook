import React from 'react';
import { 
    Zap, NotebookText, Compass, Search, 
    ShieldCheck, BarChart3, Users, Share2, 
    Home, PlusSquare, User, LogOut, LayoutGrid,
    Target, Cloud, Lock, MessageSquare, Award, FileUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Background Texture ---
const BackgroundHexagon = React.memo(({ top, bottom, left, right, scale, className = 'opacity-30' }) => {
    const style = { top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' };
    return (
        <svg
            className={`fixed z-0 ${className}`}
            style={style}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            aria-hidden="true"
        >
            <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" transform="translate(25, 25) scale(0.5)" opacity="0.5" />
        </svg>
    );
});

// --- Feature Card Component ---
const FeatureCard = React.memo(({ icon: Icon, title, desc }) => (
    <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
        <div className="w-14 h-14 bg-[#00B8D9]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00B8D9] group-hover:text-white transition-colors">
            <Icon className="w-7 h-7 text-[#00B8D9] group-hover:text-white" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-black text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
    </section>
));

const FEATURES = [
    // --- Original Features ---
    { icon: NotebookText, title: "Daily Logging", desc: "Capture your daily tasks and wins with a sleek editor designed for maximum speed." },
    { icon: BarChart3, title: "Stats Visualization", desc: "See your progress through dynamic charts that track consistency and completion rates." },
    { icon: Search, title: "Advanced Search", desc: "Find past logs instantly with our powerful search and status-based filtering tools." },
    { icon: Users, title: "Social Community", desc: "Follow other students, view their public logs, and get inspired by others." },
    { icon: ShieldCheck, title: "Secure Privacy", desc: "You control who sees your data with granular public or private visibility options." },
    { icon: Share2, title: "Portfolio Export", desc: "Turn your logs into a verifiable achievement record for career applications." },
    
    // --- NEW ADDED FEATURES ---
    { icon: Target, title: "Goal Tracking", desc: "Set academic milestones and track your progress toward achieving long-term goals." },
    { icon: Cloud, title: "Auto-Sync", desc: "Your data is always safe and synchronized across all your devices in real-time." },
    { icon: Lock, title: "Two-Factor Security", desc: "Protect your sensitive data with advanced two-factor authentication protocols." },
    { icon: MessageSquare, title: "Feedback Loop", desc: "Receive constructive comments and feedback from peers on your public achievements." },
    { icon: Award, title: "Skill Badges", desc: "Earn digital badges and rewards for maintaining long-term logging streaks." },
    { icon: FileUp, title: "Media Attachments", desc: "Upload screenshots, PDFs, and documents directly to your logs for proof-of-work." }
];

const Features = () => {
    return (
        <div className="flex flex-col min-h-screen font-sans bg-[#f7f8fa] relative overflow-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <BackgroundHexagon top="-5%" right="-5%" scale="1.5" className="text-[#00B8D9] opacity-5" />
                <BackgroundHexagon bottom="10%" left="-5%" scale="1.2" className="text-gray-400 opacity-5" />
            </div>

            {/* MAIN CONTENT - Perfectly Centered */}
            <main className="flex-1 flex flex-col items-center justify-center z-10 py-20 px-6">
                <div className="max-w-7xl w-full mx-auto">
                    <div className="h-8 w-20 mb-8 mx-auto invisible"></div>
                    {/* Header Section */}
                    <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
                            Advanced{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-teal-500">
                                Ecosystem
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
                            Everything you need to document your growth, collaborate with peers, and build a professional portfolio for your future career.
                        </p>
                    </header>

                    {/* Features Grid - 12 Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {FEATURES.map(f => (
                            <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
                        ))}
                    </div>

                    {/* CTA Footer Section */}
                    <footer className="bg-gradient-to-r from-[#1e3a8a] to-[#00B8D9] rounded-[3.5rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden max-w-5xl mx-auto">
                        <div className="relative z-10">
                            <h2 className="text-4xl font-black mb-4">Ready to Level Up?</h2>
                            <p className="text-teal-50 font-medium mb-10 opacity-90 text-lg">
                                Join our thriving community of students documenting their digital legacy.
                            </p>
                            <Link
                                to="/register"
                                className="bg-white text-[#1e3a8a] px-12 py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all duration-300 inline-block active:scale-95"
                            >
                                Get Started for Free
                            </Link>
                        </div>
                        <Zap className="absolute top-0 right-0 w-80 h-80 opacity-10 transform translate-x-16 -translate-y-16" aria-hidden="true" />
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Features;