import React, { useState, useEffect } from 'react';
import { 
    LogOut, ArrowLeft, Save, FileText, Link as LinkIcon, 
    Activity, AlertCircle, Loader2, Zap, Home, 
    NotebookText, Compass, PlusSquare, User, Menu, X 
} from 'lucide-react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Modular Sidebar import

const EditLog = ({ Logout }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        attachment: "",
        status: ""
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Sidebar ke liye mock user data (Dashboard se match karne ke liye)
    const user = { name: 'Student' };

    useEffect(() => {
        const fetchLog = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_URL}/log/${id}`, {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                    credentials: "include",
                });

                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Server error. Check backend route.");
                }

                if (!res.ok) throw new Error('Failed to fetch log details');

                const data = await res.json();
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    attachment: data.attachment || "",
                    status: data.status || "Pending"
                });
            } catch (err) {
                console.error(err);
                setError("Could not load log data. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchLog();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/log/update/${id}`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                navigate("/dashboard");
            } else {
                const errorData = await res.json();
                setError(errorData.message || "Failed to update log.");
            }
        } catch (err) {
            setError("Network error. Please ensure backend is running.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="flex h-screen bg-[#f0f2f5] font-sans overflow-hidden">
            
            {/* 1. SIDEBAR Integration */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
                user={user} 
                Logout={Logout} 
                profileLoading={false} 
            />

            {/* 2. MAIN CONTENT AREA - Responsive margin added */}
            <main className="flex-1 md:ml-0 overflow-y-auto relative bg-[#f7f8fa] custom-scrollbar">
                
                {/* Mobile Top Bar */}
                <header className="md:hidden bg-white/80 backdrop-blur-md p-4 sticky top-0 z-40 border-b flex justify-between items-center shadow-sm">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 rounded-xl">
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                </header>

                <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-8">
                    
                    {/* Navigation Header */}
                    <div className="flex items-center justify-end">
                        <StatusIndicator status={formData.status} />
                    </div>

                    {/* HERO CARD - Original Premium Design  */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#00B8D9] p-10 md:p-14 text-white relative">
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Modify Log</h2>
                                <p className="text-blue-100 font-medium text-lg max-w-md opacity-90 italic">
                                    Updating achievement details for community visibility.
                                </p>
                            </div>
                            <FileText className="absolute top-0 right-0 p-4 w-56 h-56 opacity-10 transform translate-x-10 -translate-y-10" />
                        </div>

                        {error && (
                            <div className="mx-8 mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" />
                                <p className="font-bold text-sm">{error}</p>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4">
                                <Loader2 className="w-12 h-12 text-[#00B8D9] animate-spin" />
                                <p className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Retrieving Log from Cloud...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                                
                                {/* Title & Status Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Achievement Title</label>
                                        <input 
                                            className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-2xl outline-none transition-all text-gray-800 font-bold shadow-sm"
                                            id="title"
                                            type="text"
                                            required
                                            onChange={handleChange}
                                            value={formData.title}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                        <div className="relative">
                                            <select 
                                                className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-2xl outline-none transition-all text-gray-800 font-bold cursor-pointer appearance-none shadow-sm"
                                                id="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="Completed">Completed</option>
                                                <option value="Pending">Pending</option>
                                                <option value="inComplete">Incomplete</option>
                                            </select>
                                            <Activity className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Task Breakdown / Description</label>
                                    <textarea 
                                        className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-[2rem] outline-none transition-all text-gray-700 font-medium min-h-[180px] shadow-sm resize-none"
                                        id="description"
                                        required
                                        onChange={handleChange}
                                        value={formData.description}
                                    />
                                </div>

                                {/* Attachment Link */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Evidence URL (Optional)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#00B8D9]">
                                            <LinkIcon className="w-5 h-5" />
                                        </div>
                                        <input 
                                            className="w-full py-4 pl-14 pr-6 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-2xl outline-none transition-all text-gray-600 font-bold shadow-sm"
                                            id="attachment"
                                            type="text"
                                            placeholder="https://github.com/..."
                                            onChange={handleChange}
                                            value={formData.attachment}
                                        />
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#00B8D9] text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-[#00B8D9]/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {saving ? "Processing..." : <><Save className="w-5 h-5" /> Update Log</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
        </div>
    );
}

const StatusIndicator = ({ status }) => {
    const colors = {
        Completed: 'bg-green-500',
        Pending: 'bg-yellow-500',
        inComplete: 'bg-red-500'
    };
    return (
        <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${colors[status] || 'bg-gray-300'}`}></div>
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Entry Status: {status}</span>
        </div>
    );
};

export default EditLog;