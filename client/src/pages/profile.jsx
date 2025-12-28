import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Mail, Calendar, Settings, NotebookText, Loader2, Globe,
    GraduationCap, Crown, Menu, MapPin, Clock, Award, ChevronRight, CircleDollarSign
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Profile = ({ Logout }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    const getData = async () => {
        try {
            setLoading(true);
            const endpoint = id ? `/users/${id}` : `/userProfile`;
            const baseUrl = import.meta.env.VITE_URL?.replace(/\/$/, "");

            const res = await fetch(`${baseUrl}${endpoint}`, {
                method: "GET",
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Backend connection failed.");
            }

            if (!res.ok) {
                if (res.status === 403) throw new Error("Private Profile: Follow to view achievements.");
                throw new Error("Failed to load profile.");
            }

            const data = await res.json();
            setUser(data);
            setError(null);
        } catch (err) {
            setError(err?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { getData(); }, [id]);

    const getDaysLeft = (expiry) => {
        if (!expiry) return null;
        const diff = new Date(expiry) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#f7f8fa]">
                <Loader2 className="animate-spin text-[#00B8D9] w-12 h-12 mb-4" />
                <p className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Syncing Profile...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f7f8fa] overflow-hidden font-sans">

            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
                user={{ name: user?.username || 'Member' }} 
                Logout={Logout} 
                profileLoading={loading} 
            />

            <main className="flex-1 md:ml-0 overflow-y-auto relative custom-scrollbar bg-[#f7f8fa]">
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="md:hidden fixed top-6 left-6 z-50 p-3 bg-white shadow-xl rounded-2xl text-[#00B8D9]"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-10 pb-20">

                    {/* PROFILE IDENTITY SECTION */}
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00B8D9]/10 to-transparent rounded-bl-full -mr-20 -mt-20"></div>
                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative z-10">
                            <div className="relative">
                                <div className="w-48 h-48 bg-gradient-to-br from-[#1e3a8a] to-[#00B8D9] rounded-[3.5rem] flex items-center justify-center text-8xl font-black text-white shadow-2xl">
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
                                    ) : user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl">
                                    <Award className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                </div>
                            </div>
                            <div className="flex-1 text-center lg:text-left pt-4">
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter">{user?.username}</h1>
                                    <div className="flex gap-2">
                                        {user?.accountType === 'Achiever Pro' ? (
                                            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase border border-teal-100 shadow-sm">
                                                <Crown className="w-3.5 h-3.5" /> Achiever Pro
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase border border-blue-100 shadow-sm">
                                                <GraduationCap className="w-3.5 h-3.5" /> Verified Student
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-400 font-bold text-xl mb-10 max-w-2xl leading-relaxed italic">
                                    "{user?.bio || "Focusing on consistent growth and academic excellence."}"
                                </p>
                                {/* Meta Stats Grid WITH COINS */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                            Intake Year
                                        </p>
                                        <p className="text-lg font-black text-gray-800">
                                            {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logs Shared</p>
                                        <p className="text-lg font-black text-gray-800">{user?.logs?.length || 0}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-lg font-black text-green-500">Active</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-[1.5rem] border border-yellow-100 text-center">
                                        <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">Trial Left</p>
                                        <p className="text-lg font-black text-yellow-700">
                                            {getDaysLeft(user?.trialExpirationDate) || 0} Days
                                        </p>
                                    </div>
                                    {/* COINS SECTION */}
                                    <div className="p-4 bg-yellow-50 rounded-[1.5rem] border border-yellow-100 text-center">
                                        <CircleDollarSign className="mx-auto text-yellow-700 mb-1" size={20}/>
                                        <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-1">Coins</p>
                                        <p className="text-lg font-black text-yellow-700">
                                            {user?.coins ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVITY HISTORY SECTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6">Contact Info</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="p-2 bg-[#00B8D9]/10 rounded-lg text-[#00B8D9]"><Mail size={18}/></div>
                                        <span className="font-bold text-sm truncate">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="p-2 bg-[#00B8D9]/10 rounded-lg text-[#00B8D9]"><MapPin size={18}/></div>
                                        <span className="font-bold text-sm">{user?.location || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500">
                                        <div className="p-2 bg-[#00B8D9]/10 rounded-lg text-[#00B8D9]"><Clock size={18}/></div>
                                        <span className="font-bold text-sm">Last Active: Today</span>
                                    </div>
                                </div>
                                {!id && (
                                    <button 
                                        onClick={() => navigate('/settings')}
                                        className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                                    >
                                        <Settings size={14} /> Update Settings
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Logs List Card */}
                        <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                    <NotebookText className="w-8 h-8 text-[#00B8D9]" /> Recent Achievements
                                </h3>
                            </div>
                            <div className="p-6 md:p-10 space-y-4">
                                {user?.logs?.length > 0 ? (
                                    user.logs.slice().reverse().map((log, index) => (
                                        <div 
                                            key={log._id}
                                            onClick={() => navigate(`/viewlog/${log._id}`)}
                                            className="group p-6 bg-white rounded-[2rem] border border-gray-100 flex items-center justify-between hover:shadow-xl hover:border-[#00B8D9]/20 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-[#00B8D9]/5 flex items-center justify-center text-[#00B8D9] group-hover:bg-[#00B8D9] group-hover:text-white transition-all">
                                                    <span className="font-black text-lg">
                                                        {user.logs.length - index}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 text-lg group-hover:text-[#00B8D9] transition-colors line-clamp-1">{log.task_title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-widest ${
                                                    log.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                    {log.status}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#00B8D9] transition-all group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-32 text-center opacity-40 grayscale flex flex-col items-center">
                                        <Globe className="w-16 h-16 mb-4" />
                                        <p className="font-black text-xs uppercase tracking-widest">No achievements published yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}
        </div>
    );
};

export default Profile;