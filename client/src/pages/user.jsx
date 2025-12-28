import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Mail, Calendar, Settings, Zap, NotebookText,
    PlusSquare, Loader2, Globe, GraduationCap, Crown, Menu,
    MapPin, ChevronRight, UserPlus, UserCheck, Users
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

// Utility to check if an array contains a user id (array can be string[], object[], or mix)
function containsId(arr, id) {
    if (!Array.isArray(arr) || !id) return false;
    return arr.some(u => (typeof u === "object" ? u._id : u) === id);
}

const User = ({ Logout }) => {
    const [user, setUser] = useState(null);
    const [myProfile, setMyProfile] = useState(null); // To check follow status
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const viewingOwnProfile = !id;

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const baseUrl = import.meta.env.VITE_URL?.replace(/\/$/, "");

            // Target user
            const endpoint = id ? `/users/${id}` : `/userProfile`;
            const res = await fetch(`${baseUrl}${endpoint}`, {
                method: "GET",
                credentials: "include",
                headers: { "Accept": "application/json" }
            });

            // My own profile
            const myRes = await fetch(`${baseUrl}/userProfile`, {
                credentials: "include",
                headers: { "Accept": "application/json" }
            });

            if (res.ok && myRes.ok) {
                const data = await res.json();
                const myData = await myRes.json();
                setUser(data);
                setMyProfile(myData);
            } else {
                if (res.status === 403) throw new Error("Private Profile: Follow this scholar to view their progress.");
                throw new Error("Failed to load profile.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleFollowToggle = async () => {
        if (!user || followLoading) return;
        setFollowLoading(true);

        const isFollowing = containsId(myProfile?.following, user._id);
        const endpoint = isFollowing ? `/unfollow/${user._id}` : `/follow/${user._id}`;
        try {
            const res = await fetch(`${import.meta.env.VITE_URL.replace(/\/$/, "")}${endpoint}`, {
                method: "POST",
                credentials: "include"
            });
            if (res.ok) {
                // Refresh data after follow/unfollow
                await fetchData();
            }
        } catch (err) {
            console.error("Follow error:", err);
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#f7f8fa]">
            <Loader2 className="animate-spin text-[#00B8D9] w-12 h-12 mb-4" />
            <p className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Loading Scholar Data...</p>
        </div>
    );

<<<<<<< HEAD
    if (error)
        return (
            <div className="h-screen flex items-center justify-center bg-[#f7f8fa]">
                <div className="bg-white rounded-3xl p-10 text-center shadow-2xl border border-red-50">
                    <Globe className="w-16 h-16 text-red-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-gray-800 mb-2">Access Limited</h2>
                    <p className="text-gray-400 font-medium mb-8 max-w-sm mx-auto leading-relaxed">{error}</p>
                    <button onClick={() => navigate('/explore')} className="bg-[#00B8D9] text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00B8D9]/30 hover:scale-105 active:scale-95 transition-all">
                        Explore Others
                    </button>
                </div>
=======
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={getData}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && user && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-white mb-4">{user.username}</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <FileText className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">
                        {user.Logs?.length || 0} {user.Logs?.length === 1 ? 'Log' : 'Logs'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Calendar className="h-5 w-5 text-red-400" />
                      <span className="text-gray-300">Joined on {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
            </div>
        );

<<<<<<< HEAD
    // ---- DEFINE counts here ----
    const isFollowing = containsId(myProfile?.following, user?._id);
    const followersCount = Array.isArray(user?.followers) ? user.followers.length : 0;
    const logsCount = Array.isArray(user?.logs) ? user.logs.length : 0;
=======
            <div className="bg-white/10 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-400" />
                  <span>Activity Logs</span>
                </h3>
              </div>
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80

    return (
        <div className="flex h-screen bg-[#f7f8fa] overflow-hidden font-sans">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                user={{ name: myProfile?.username || 'Member' }}
                Logout={Logout}
                profileLoading={loading}
            />

            <main className="flex-1 md:ml-0 overflow-y-auto relative custom-scrollbar bg-[#f8fafc]">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-6 left-6 z-50 p-3 bg-white shadow-2xl rounded-2xl text-[#00B8D9]">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-10 pb-32">

                    {/* Header Actions */}
                    <div className="flex justify-between items-center">
                        <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-gray-400 hover:text-gray-900 transition-all">

                        </button>

                        {!viewingOwnProfile && (
                            <button
                                onClick={handleFollowToggle}
                                disabled={followLoading}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isFollowing
                                    ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                                    : 'bg-[#00B8D9] text-white shadow-[#00B8D9]/30 hover:bg-[#00A0BC]'
                                    }`}
                            >
                                {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                    isFollowing ? <><UserCheck className="w-4 h-4" /> Unfollow</> : <><UserPlus className="w-4 h-4" /> Follow Scholar</>}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Profile Details */}
                        <div className="lg:col-span-8 space-y-10">
                            <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#00B8D9]/5 to-transparent rounded-bl-full -mr-20 -mt-20"></div>

                                <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                                    <div className="w-48 h-48 bg-gradient-to-br from-[#1e3a8a] to-[#00B8D9] rounded-[4rem] flex items-center justify-center text-8xl font-black text-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                                        {user?.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" alt={user?.username || "avatar"} /> : user?.username?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 text-center md:text-left pt-4">
                                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                            <h1 className="text-6xl font-black text-gray-900 tracking-tighter">{user?.username}</h1>
                                            <MembershipBadge type={user?.accountType} />
                                        </div>
                                        <p className="text-gray-400 font-bold text-xl mb-10 italic">"{user?.bio || "Success is a series of small wins daily."}"</p>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                            <StatPill icon={Users} label="Followers" value={isNaN(followersCount) ? 0 : followersCount} />
                                            <StatPill icon={NotebookText} label="Total Logs" value={isNaN(logsCount) ? 0 : logsCount} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Achievements Section */}
                            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                                <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                                    <h3 className="text-2xl font-black text-gray-800 flex items-center gap-4">
                                        <NotebookText className="w-8 h-8 text-[#00B8D9]" /> Recent Progress
                                    </h3>
                                </div>
                                <div className="p-8 space-y-6">
                                    {Array.isArray(user?.logs) && user.logs.length > 0 ? (
                                        user.logs.slice().reverse().map((log, i) => (
                                            <div
                                                key={log._id}
                                                onClick={() => navigate(`/viewlog/${log._id}`)}
                                                className="group p-8 bg-gray-50/50 rounded-[3rem] border border-transparent hover:bg-white hover:shadow-2xl hover:border-[#00B8D9]/20 transition-all duration-500 cursor-pointer flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-8">
                                                    <span className="text-4xl font-black text-gray-100 group-hover:text-[#00B8D9]/10 transition-colors">
                                                        0{user.logs.length - i}
                                                    </span>
                                                    <div>
                                                        <p className="font-black text-gray-800 text-xl mb-1 group-hover:text-[#00B8D9] transition-colors">
                                                            {log.task_title}
                                                        </p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            {new Date(log.createdAt).toDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-[#00B8D9] group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center">
                                            <p className="text-gray-300 font-black text-sm uppercase tracking-widest">
                                                {Array.isArray(user?.logs)
                                                    ? "No achievements found"
                                                    : user?.isPrivate
                                                        ? "This profile's logs are private!"
                                                        : "No achievements found"
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] mb-8">Information</h3>
                                <div className="space-y-8">
                                    {/* Hide email if not following/not own profile */}
                                    <InfoItem
                                        icon={Mail}
                                        label="Email"
                                        value={isFollowing || viewingOwnProfile
                                            ? (user?.email || "••••@••••.com")
                                            : "••••@••••.com"
                                        }
                                    />

                                    <InfoItem
                                        icon={MapPin}
                                        label="Location"
                                        value={user?.location || "Not Set"}
                                    />

                                    <InfoItem
                                        icon={Calendar}
                                        label="Member Since"
                                        value={
                                            user?.createdAt
                                                ? String(new Date(user.createdAt).getFullYear())
                                                : "Year Unknown"
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Components
const MembershipBadge = ({ type }) => (
    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-sm ${type === 'Achiever Pro' ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
        {type === 'Achiever Pro' ? <Crown size={14} /> : <GraduationCap size={14} />}
        {type || "Scholar"}
    </div>
);

const StatPill = ({ icon: Icon, label, value }) => (
    <div className="px-6 py-4 bg-gray-50 rounded-[2rem] border border-gray-100 text-center min-w-[120px]">
        <Icon className="w-4 h-4 text-[#00B8D9] mx-auto mb-2 opacity-50" />
        <p className="text-xl font-black text-gray-800">{isNaN(value) ? 0 : value}</p>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{label}</p>
    </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-5">
        <div className="p-3 bg-[#00B8D9]/5 rounded-2xl text-[#00B8D9]"><Icon size={20} /></div>
        <div>
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-black text-gray-700 truncate">{value}</p>
        </div>
    </div>
);

export default User;