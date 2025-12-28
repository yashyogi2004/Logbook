import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageSquare, Calendar, User, Send, Download } from 'lucide-react';

const LogDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // --- FETCH LOG DETAILS ---
    const fetchLog = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/log/${id}`, {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setLog(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- FETCH CURRENT USER (To check if I liked the post) ---
    const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/userProfile`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchLog();
        fetchCurrentUser();
    }, [id]);

    // --- HANDLE LIKE ---
    const handleLike = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/log/like/${id}`, {
                method: "PUT",
                credentials: "include"
            });
            if (res.ok) {
                const updatedLikes = await res.json();
                setLog(prev => ({ ...prev, likes: updatedLikes }));
            }
        } catch (err) { console.error(err); }
    };

    // --- HANDLE COMMENT ---
    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/log/comment/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ text: commentText })
            });

            if (res.ok) {
                const updatedComments = await res.json();
                setLog(prev => ({ ...prev, comments: updatedComments }));
                setCommentText(""); // Clear input
            }
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D9]"></div></div>;
    if (!log) return <div className="text-center p-10">Log not found</div>;

    const isLiked = currentUser && log.likes.includes(currentUser._id);

    return (
        <div className="min-h-screen bg-[#f7f8fa] font-sans text-[#212529] py-8 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Header / Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-[#00B8D9] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
                    
                    {/* Status Banner */}
                    <div className={`h-2 w-full ${
                        log.status === 'Completed' ? 'bg-green-500' : 
                        log.status === 'inComplete' ? 'bg-red-500' : 'bg-yellow-400'
                    }`}></div>

                    <div className="p-8 md:p-12">
                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                                <Calendar className="w-4 h-4" />
                                {new Date(log.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                                <User className="w-4 h-4" />
                                {log.user?.username || 'Unknown'}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                log.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                                log.status === 'inComplete' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {log.status}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                            {log.title}
                        </h1>

                        <div className="prose max-w-none text-gray-600 leading-relaxed mb-8">
                            <p>{log.description}</p>
                        </div>

                        {/* ATTACHMENT DISPLAY */}
                        {log.attachment && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Attachment</h3>
                                {log.attachment.endsWith('.pdf') ? (
                                    <a href={log.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors group">
                                        <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                                            <Download className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-700">View PDF Document</p>
                                            <p className="text-xs text-gray-400">Click to open</p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={log.attachment} alt="Attachment" className="w-full object-cover max-h-[500px]" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ACTION BUTTONS (Like) */}
                        <div className="flex items-center gap-6 border-t border-gray-100 pt-6">
                            <button 
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                                    isLiked 
                                        ? 'bg-pink-50 text-pink-600' 
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="font-bold">{log.likes.length} Likes</span>
                            </button>
                            
                            <div className="flex items-center gap-2 text-gray-500 px-4 py-2">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-bold">{log.comments.length} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COMMENT SECTION */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion</h3>
                    
                    {/* Input */}
                    <form onSubmit={handleComment} className="flex gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-grow p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B8D9] transition-all"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button 
                            type="submit"
                            disabled={!commentText.trim()}
                            className="bg-[#00B8D9] text-white p-4 rounded-xl hover:bg-[#009fb8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {log.comments.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No comments yet. Be the first to say something!</p>
                        ) : (
                            log.comments.map((comment, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 font-bold text-gray-500 uppercase">
                                        {comment.user?.username?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">{comment.user?.username || 'Unknown User'}</span>
                                            <span className="text-xs text-gray-400">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg rounded-tl-none inline-block">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LogDetails;