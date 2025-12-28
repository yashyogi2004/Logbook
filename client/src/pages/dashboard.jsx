import React, { useState, useEffect } from 'react';
import { Home, NotebookText, PlusSquare, User as UserIcon, LogOut, Menu, Zap, Search, Filter, Compass, Edit2, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StatsChart from '../components/StatsChart';
import Sidebar from '../components/Sidebar'; // Alag file se import

const Dashboard = ({ Logout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [user, setUser] = useState({ name: '', profilePic: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    // --- FETCH LOGS ---
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search: searchTerm,
                status: statusFilter
            }).toString();

            const res = await fetch(`${import.meta.env.VITE_URL}/log?${queryParams}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error("Failed to fetch logs:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- FETCH PROFILE ---
    const fetchProfile = async () => {
        setProfileLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/userProfile`, {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setUser({
                    name: data.username || "",
                    profilePic: data.profilePic || ""
                });
            }
        } catch (err) { 
            console.log(err); 
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, statusFilter]);

    const handleEdit = (e, id) => {
        e.stopPropagation();
        navigate(`/editlog/${id}`);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this log?")) {
            await fetch(`${import.meta.env.VITE_URL}/log/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            fetchLogs();
        }
    };

    return (
        <div className="flex h-screen font-sans bg-[#f7f8fa] relative overflow-hidden">
            
            {/* 1. SIDEBAR (Alag file se handle ho raha hai) */}
            <Sidebar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
                user={user} 
                Logout={Logout} 
                profileLoading={profileLoading} 
            />

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">

                    {/* Top Bar - Mobile Menu Button added */}
                    <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            {/* Hamburger Button for Mobile */}
                            <button className="md:hidden text-gray-600 p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsSidebarOpen(true)}>
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 hidden md:block">Overview</h2>
                                <p className="text-xs text-gray-500 font-medium md:hidden">{today}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-xs text-gray-400 font-semibold uppercase">Current Status</p>
                                <p className="text-sm font-bold text-[#00B8D9]">Active Session</p>
                            </div>
                            {/* Mobile User Avatar logic remains same */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00B8D9] to-teal-400 flex items-center justify-center text-white font-bold uppercase overflow-hidden shadow-md">
                                {user.profilePic ? <img src={user.profilePic} className="w-full h-full object-cover" /> : (user.name ? user.name[0] : "?")}
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content - Layout Unchanged */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-[#00B8D9] to-teal-500 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold mb-2">Track Your Progress</h2>
                                    <p className="text-teal-100 text-lg max-w-lg">Consistency is key. Manage your logs efficiently with our search and filter tools.</p>
                                </div>
                                <Link to="/addlog" className="px-8 py-4 bg-white text-[#00B8D9] font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <PlusSquare className="w-5 h-5" />
                                    <span>Create New Log</span>
                                </Link>
                            </div>
                        </div>

                        {/* Grid Logic: Desktop side-by-side, Mobile stacked */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[350px]">
                                <StatsChart logs={logs} />
                            </div>

                            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 min-h-[500px] flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                                        <h3 className="text-xl font-bold text-[#212529] flex items-center gap-2">
                                            <NotebookText className="w-5 h-5 text-[#00B8D9]" /> Recent Logs
                                        </h3>
                                        <span className="text-sm text-gray-400 font-medium">{logs.length} entries found</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="relative flex-grow">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input type="text" placeholder="Search logs..." className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D9]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                        </div>
                                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="pl-4 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none">
                                            <option value="All">All Status</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Pending">Pending</option>
                                            <option value="inComplete">Failed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-grow overflow-x-auto">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B8D9]"></div></div>
                                    ) : (
                                        <table className="min-w-full">
                                            <thead className="bg-gray-50">
                                                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    <th className="py-3 px-6">Title</th>
                                                    <th className="py-3 px-6 text-center hidden sm:table-cell">Date</th>
                                                    <th className="py-3 px-6 text-right">Status</th>
                                                    <th className="py-3 px-6 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {logs.map((log) => (
                                                    <tr key={log._id} onClick={() => navigate(`/viewlog/${log._id}`)} className="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                                                        <td className="py-4 px-6 text-sm font-semibold text-gray-700">{log.title}</td>
                                                        <td className="py-4 px-6 text-sm text-gray-500 text-center hidden sm:table-cell">{new Date(log.createdAt).toLocaleDateString()}</td>
                                                        <td className="py-4 px-6 text-right">
                                                            {/* Yahan aapka StatusBadge logic */}
                                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">{log.status}</span>
                                                        </td>
                                                        <td className="py-4 px-6 text-right whitespace-nowrap">
                                                            <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg mr-2" onClick={e => handleEdit(e, log._id)}><Edit2 className="w-4 h-4" /></button>
                                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={e => handleDelete(e, log._id)}><Trash2 className="w-4 h-4" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;