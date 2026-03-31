import React, { useState, useEffect } from 'react';
import { User, Menu, Heart, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Feed = ({ Logout }) => {
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: 'Student' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [attachmentModal, setAttachmentModal] = useState(null);
    const [showLikesFor, setShowLikesFor] = useState(null);

    // --- New: filter input for username ---
    const [userFilter, setUserFilter] = useState("");

    // --- Fetch User Profile ---
    const fetchProfile = async () => {
        setProfileLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/userProfile`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser({ name: data.username, id: data.id || data._id });
            }
        } catch (err) { console.error(err); }
        finally { setProfileLoading(false); }
    };

    // --- Fetch Feed Logs ---
    const fetchFeed = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/feed`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchFeed();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'inComplete': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    // --- LIKE ---
    const handleLike = async (e, log) => {
        e.stopPropagation();
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/log/like/${log._id}`, {
                method: 'PUT',
                credentials: 'include'
            });
            if (res.ok) {
                const updated = await res.json();
                setLogs(currLogs => currLogs.map(l => l._id === log._id ? { ...l, likes: updated } : l));
            }
        } catch (error) {
            console.error('Like failed', error);
        }
    };

    const isLikedByMe = (log) => {
        return (log.likes || []).some(u => u._id === user.id);
    };

    // ------------ FILTER LOGS BY USERNAME ---------------
    const filteredLogs = logs.filter(log =>
        !userFilter ||
        log.user?.username?.toLowerCase().includes(userFilter.toLowerCase())
    );

    return (
        <div className="flex h-screen font-sans bg-[#f7f8fa] relative overflow-hidden">
            {/* SIDEBAR */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                user={user}
                Logout={Logout}
                profileLoading={profileLoading}
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                <div className="p-4 md:p-8 max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm md:bg-transparent md:shadow-none md:p-0">
                        <div className="flex items-center gap-4">
                            <button className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Activity Feed</h1>
                                <p className="text-gray-500 text-sm md:text-base">See what your network is achieving today.</p>
                            </div>
                        </div>
                    </header>

                    {/* NEW: Filter for logs by user */}
                    <div className="mb-6 flex gap-3 items-center">
                        <label className="font-semibold text-gray-700">Filter by User:</label>
                        <input
                            type="text"
                            placeholder="Type username..."
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/30"
                            value={userFilter}
                            onChange={e => setUserFilter(e.target.value)}
                            style={{ minWidth: 180 }}
                        />
                    </div>

                    {/* Feed */}
                    {loading ? (
                        <div className="flex justify-center pt-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00B8D9]"></div>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No logs found</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto px-4">
                                {userFilter ? "No logs found for this user." : "It looks like you aren't following anyone yet, or they haven't posted any logs."}
                            </p>
                            <Link to="/explore" className="mt-6 inline-block bg-[#00B8D9] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#009fb8] transition-colors shadow-lg shadow-cyan-500/20">
                                Find People to Follow
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6 pb-10">
                            {filteredLogs.map(log => (
                                <div
                                    key={log._id}
                                    onClick={() => navigate(`/viewlog/${log._id}`)}
                                    className="bg-white p-5 md:p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer group relative"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        {log.user?.profilePic ? (
                                            <img
                                                src={log.user.profilePic}
                                                alt={log.user.username}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-[#00B8D9] bg-white"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                                                {log.user?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-gray-900 leading-tight">{log.user?.username || 'Unknown User'}</p>
                                                {log.user?.accountType && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black uppercase rounded">{log.user.accountType}</span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-wider ${getStatusColor(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#00B8D9] transition-colors">
                                            {log.task_title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {log.task_description}
                                        </p>
                                        {log.attachment && (
                                            <div
                                                className="h-48 md:h-64 w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer flex items-center justify-center"
                                                onClick={e => { e.stopPropagation(); setAttachmentModal(log); }}
                                            >
                                                {log.attachment.endsWith('.pdf') ? (
                                                    <div className="text-blue-500 font-bold">PDF Attachment (Click to View)</div>
                                                ) : (
                                                    <img src={log.attachment} alt="Proof" className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                        )}
                                        {attachmentModal && (
                                            <div
                                                className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
                                                onClick={() => setAttachmentModal(null)}
                                            >
                                                <div
                                                    className="bg-white p-2 rounded-xl shadow-xl relative flex items-center justify-center"
                                                    style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    {attachmentModal.attachment.endsWith('.pdf') ? (
                                                        <iframe
                                                            src={attachmentModal.attachment}
                                                            title="PDF"
                                                            className="w-[80vw] h-[80vh] rounded"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={attachmentModal.attachment}
                                                            alt="Attachment"
                                                            className="max-w-[80vw] max-h-[80vh] rounded-xl"
                                                        />
                                                    )}
                                                    <button
                                                        onClick={() => setAttachmentModal(null)}
                                                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {/* Footer: Likes/Comments */}
                                        <div className="flex items-center gap-6 text-gray-400 text-xs font-bold uppercase tracking-widest pt-4 border-t border-gray-50">
                                            <button
                                                onClick={e => handleLike(e, log)}
                                                className="flex items-center gap-2 hover:text-pink-500 transition-colors focus:outline-none"
                                            >
                                                <Heart className={`w-4 h-4 ${isLikedByMe(log) ? 'fill-pink-500 text-pink-500' : ''}`} />
                                                {log.likes?.length || 0} Likes
                                            </button>
                                            {/* WHO liked? */}
                                            {log.likes?.length > 0 && (
                                                <span
                                                    className="ml-0 text-blue-500 underline cursor-pointer"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        setShowLikesFor(log._id === showLikesFor ? null : log._id);
                                                    }}
                                                >
                                                    See who
                                                </span>
                                            )}
                                            {showLikesFor === log._id && (
                                                <div className="absolute z-20 top-16 left-3 rounded-xl bg-white shadow-lg border px-4 py-2 flex flex-wrap gap-2 w-60">
                                                    {log.likes.map(u => (
                                                        <div key={u._id} className="flex items-center gap-2 border-b py-1 w-full">
                                                            <img src={u.profilePic || '/user.png'} alt={u.username} className="w-6 h-6 rounded-full" />
                                                            <span className="text-sm text-gray-700">{u.username}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div
                                                className="flex items-center gap-2 hover:text-blue-500 transition-colors cursor-pointer"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    navigate(`/viewlog/${log._id}#comments`);
                                                }}
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                {log.comments?.length || 0} Comments
                                            </div>
                                            {/* (You can add comment viewing inline/modal if you want!) */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Feed;