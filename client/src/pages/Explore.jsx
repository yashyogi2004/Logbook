import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, Check, X, Menu, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Explore = ({ Logout }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [followingIds, setFollowingIds] = useState([]);
    const [requestedIds, setRequestedIds] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: 'Student', id: undefined });
    const [relationFilter, setRelationFilter] = useState("all");
    const [profileJump, setProfileJump] = useState(""); // For jump-to-profile

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await fetch(`${import.meta.env.VITE_URL}/users`, { credentials: "include" });
                const usersData = await usersRes.json();

                const myRes = await fetch(`${import.meta.env.VITE_URL}/userProfile`, { credentials: "include" });
                const myData = await myRes.json();

                if (usersRes.ok && myRes.ok) {
                    setUsers(usersData);
                    setCurrentUser({ name: myData.username, id: myData.id || myData._id || "" });
                    setFollowingIds(
                        myData.following?.map(u => (typeof u === 'object' ? u._id : u)) || []
                    );
                    setRequestedIds(
                        myData.requested?.map(u => (typeof u === 'object' ? u._id : u)) || []
                    );
                    setIncomingRequests(
                        myData.followRequests?.map(u => (typeof u === 'object' ? u._id : u)) || []
                    );
                }
            } catch (err) {
                console.error("Explore Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- Handle request/accept/unfollow/cancel ---
    const handleAction = async (action, userId) => {
        let endpoint;
        if (action === 'request') endpoint = `/request-follow/${userId}`;
        if (action === 'accept') endpoint = `/accept-follow/${userId}`;
        if (action === 'unfollow') endpoint = `/unfollow/${userId}`;
        if (action === 'cancel') endpoint = `/cancel-follow-request/${userId}`;

        try {
            const res = await fetch(`${import.meta.env.VITE_URL}${endpoint}`, {
                method: "POST",
                credentials: "include"
            });
            if (res.ok) {
                setFollowingIds(prev =>
                    action === 'unfollow'
                        ? prev.filter(id => id !== userId)
                        : action === 'accept'
                        ? [...prev, userId]
                        : prev
                );
                setRequestedIds(prev =>
                    action === 'request'
                        ? [...prev, userId]
                        : action === 'cancel'
                        ? prev.filter(id => id !== userId)
                        : action === 'accept'
                        ? prev.filter(id => id !== userId)
                        : prev
                );
                setIncomingRequests(prev =>
                    action === 'accept' || action === 'cancel'
                        ? prev.filter(id => id !== userId)
                        : prev
                );
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // -- RELATIONSHIP FILTER LOGIC --
    const myId = currentUser.id || currentUser._id || "";

    const filteredUsers = users.filter(user => {
        // Search
        if (!user.username.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        // Relationship filter
        if (relationFilter === "following") {
            return followingIds.includes(user._id);
        }
        if (relationFilter === "followers") {
            return Array.isArray(user.followers) && user.followers.includes(myId);
        }
        if (relationFilter === "notFollowing") {
            return !followingIds.includes(user._id);
        }
        return true; // "all"
    });

    return (
        <div className="flex h-screen font-sans bg-[#f7f8fa] relative overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                user={currentUser}
                Logout={Logout}
                profileLoading={loading}
            />
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">

                    {/* Top Bar */}
                    <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-30 md:bg-transparent md:shadow-none md:p-0">
                        <div className="flex items-center gap-4">
                            <button className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="w-6 h-6" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-800">Explore Community</h2>
                        </div>
                        <div className="hidden sm:block text-sm font-bold text-[#00B8D9] bg-[#00B8D9]/5 px-4 py-2 rounded-xl">
                            {users.length} Users Registered
                        </div>
                    </header>

                    {/* Optional: Incoming Requests Section */}
                    {incomingRequests.length > 0 && (
                        <div className="mb-8">
                            <h4 className="text-[#00B8D9] font-bold text-lg mb-2">Follow Requests</h4>
                            <div className="flex flex-wrap gap-4">
                                {users.filter(u => incomingRequests.includes(u._id)).map(u => (
                                    <div key={u._id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-4 shadow border">
                                        <span className="font-bold">{u.username}</span>
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                                            onClick={() => handleAction('accept', u._id)}
                                        >
                                            <Check size={16} />Accept
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                                            onClick={() => handleAction('cancel', u._id)}
                                        >
                                            <X size={16} />Decline
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative mb-6 group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#00B8D9] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find students by username..."
                            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 focus:outline-none focus:ring-4 focus:ring-[#00B8D9]/10 transition-all font-medium text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Profile quick jump */}
                    <div className="flex gap-2 items-center mb-4">
                        <label htmlFor="jumpUser" className="font-semibold text-gray-700">
                            Go to Profile:
                        </label>
                        <select
                            id="jumpUser"
                            className="border px-3 py-2 rounded-lg"
                            value={profileJump}
                            onChange={e => setProfileJump(e.target.value)}
                            style={{ minWidth: 170 }}
                        >
                            <option value="">-- Select --</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>{u.username}</option>
                            ))}
                        </select>
                        <button
                            className="px-3 py-2 bg-[#00B8D9] text-white rounded-lg font-bold"
                            disabled={!profileJump}
                            onClick={() => navigate(`/users/${profileJump}`)}
                        >
                            Go
                        </button>
                    </div>

                    {/* Relationship filter bar */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        <button
                            onClick={() => setRelationFilter('all')}
                            className={`px-4 py-1 rounded-xl font-bold text-sm ${relationFilter === 'all' ? 'bg-[#00B8D9] text-white' : 'bg-gray-100 text-gray-700'}`}
                        >All</button>
                        <button
                            onClick={() => setRelationFilter('following')}
                            className={`px-4 py-1 rounded-xl font-bold text-sm ${relationFilter === 'following' ? 'bg-[#00B8D9] text-white' : 'bg-gray-100 text-gray-700'}`}
                        >Following</button>
                        <button
                            onClick={() => setRelationFilter('followers')}
                            className={`px-4 py-1 rounded-xl font-bold text-sm ${relationFilter === 'followers' ? 'bg-[#00B8D9] text-white' : 'bg-gray-100 text-gray-700'}`}
                        >Followers</button>
                        <button
                            onClick={() => setRelationFilter('notFollowing')}
                            className={`px-4 py-1 rounded-xl font-bold text-sm ${relationFilter === 'notFollowing' ? 'bg-[#00B8D9] text-white' : 'bg-gray-100 text-gray-700'}`}
                        >Not Following</button>
                    </div>

                    {/* Main Users Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20 text-[#00B8D9]">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
                            {filteredUsers.map(user => {
                                const isFollowing = followingIds.includes(user._id);
                                const isRequested = requestedIds.includes(user._id);
                                const hasRequestToMe = incomingRequests.includes(user._id);

                                return (
                                    <div key={user._id} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden">
                                        {/* Avatar etc. */}
                                        <div
                                            onClick={() => navigate(`/users/${user._id}`)}
                                            className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-gradient-to-br from-[#1e3a8a] to-[#00B8D9] mb-4 flex items-center justify-center text-3xl font-black text-white shadow-xl rotate-3 group-hover:rotate-0 transition-all cursor-pointer overflow-hidden"
                                        >
                                            {user.profilePic
                                                ? <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                                                : user.username[0]?.toUpperCase() || ''
                                            }
                                        </div>
                                        <h3 className="text-xl font-black text-gray-800 mb-1 group-hover:text-[#00B8D9] transition-colors">{user.username}</h3>
                                        {/* REMOVE EMAIL */}
                                        {/* <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 truncate w-full px-2">{user.email}</p> */}
                                        <div className="mb-4 flex flex-col gap-1">
                                            {user.accountType && <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded uppercase font-bold">{user.accountType}</span>}
                                            {user.location && <span className="text-xs text-gray-500">{user.location}</span>}
                                            {user.bio && <span className="text-xs text-gray-400 line-clamp-1 italic">"{user.bio}"</span>}
                                        </div>

                                        {isFollowing ? (
                                            <button
                                                onClick={() => handleAction('unfollow', user._id)}
                                                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
                                            >
                                                <UserCheck className="w-4 h-4" /> Following
                                            </button>
                                        ) : isRequested ? (
                                            <button
                                                onClick={() => handleAction('cancel', user._id)}
                                                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                            >
                                                <UserPlus className="w-4 h-4" /> Requested
                                            </button>
                                        ) : hasRequestToMe ? (
                                            <span className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-green-100 text-green-700 flex items-center justify-center gap-2">Requested You</span>
                                        ) : (
                                            <button
                                                onClick={() => handleAction('request', user._id)}
                                                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-[#00B8D9] text-white shadow-lg shadow-[#00B8D9]/30"
                                            >
                                                <UserPlus className="w-4 h-4" /> Follow
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Explore;