import React from 'react';
import { 
    Home, NotebookText, PlusSquare, User as UserIcon, 
    LogOut, Zap, Compass, X, ChevronRight, Settings 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Sub-component for individual links
const SidebarLink = ({ icon: Icon, title, isActive, to, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`group flex items-center justify-between p-3.5 mx-4 rounded-2xl transition-all duration-300 ${
            isActive 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/10' 
                : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span className="text-sm font-bold tracking-wide">{title}</span>
        </div>
        {isActive && <ChevronRight className="w-4 h-4 text-[#00B8D9]" />}
    </Link>
);

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, user, Logout, profileLoading }) => {
    const location = useLocation();

    const navItems = [
        { title: 'Overview', icon: Home, path: '/dashboard' },
        { title: 'Activity Feed', icon: NotebookText, path: '/feed' },
        { title: 'Explore People', icon: Compass, path: '/explore' },
        { title: 'Create Log', icon: PlusSquare, path: '/addlog' },
        { title: 'My Profile', icon: UserIcon, path: '/profile' },
        { title: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#0f172a] via-[#1e3a8a] to-[#00B8D9] z-50 transition-transform duration-500 ease-in-out shadow-2xl flex flex-col md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Brand Header */}
                <div className="p-8 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-lg">
                            <Zap className="w-6 h-6 text-[#00B8D9] fill-current" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase font-serif italic">Logbook</h1>
                    </div>
                    <button className="md:hidden text-white/50 hover:text-white" onClick={() => setIsSidebarOpen(false)}><X /></button>
                </div>

                {/* User Context Section */}
                <div className="px-6 py-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold uppercase">
                        {profileLoading ? "..." : (user.name ? user.name[0] : "S")}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white text-sm font-bold truncate">{profileLoading ? "Loading..." : user.name}</p>
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Active Member</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <SidebarLink 
                            key={item.path}
                            icon={item.icon}
                            title={item.title}
                            to={item.path}
                            isActive={location.pathname === item.path}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    ))}
                </nav>

                {/* Bottom Logout Section */}
                <div className="p-6 border-t border-white/5 bg-black/10">
                    <button 
                        onClick={Logout} 
                        className="flex items-center justify-center w-full gap-3 p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-black text-xs uppercase tracking-widest group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-40 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;