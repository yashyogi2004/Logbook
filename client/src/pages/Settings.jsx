import React, { useState, useEffect, useCallback } from 'react';
import {
    Globe, User, Mail, Shield, Save, NotebookText, Compass, PlusSquare, Menu, ShieldCheck, MapPin,
    Image as ImageIcon, CalendarDays, CreditCard, Lock, Award, Coins, Users
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const BRAND_COLOR = "#00B8D9";

const navItems = [
    { title: 'Overview', icon: NotebookText, path: '/dashboard' },
    { title: 'Activity Feed', icon: NotebookText, path: '/feed' },
    { title: 'Explore People', icon: Compass, path: '/explore' },
    { title: 'Create Log', icon: PlusSquare, path: '/addlog' },
    { title: 'My Profile', icon: User, path: '/profile' },
    { title: 'Settings', icon: Shield, path: '/settings' },
];

const Settings = ({ Logout }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
        location: "",
        isPrivate: false,
    });
    const [uploadingPic, setUploadingPic] = useState(false);

    // Fetch user profile once at mount and after save
    const fetchUserData = useCallback(async () => {
        setProfileLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/userProfile`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData({
                    username: data.username ?? "",
                    bio: data.bio ?? "",
                    location: data.location ?? "",
                    isPrivate: data.isPrivate ?? false,
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, []);

    // Dummy handler for profile photo
    const handlePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingPic(true);
        setTimeout(() => {
            setUploadingPic(false);
            alert("Photo upload logic would trigger here.");
        }, 1000);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}/updateProfile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Server Error Details:", {
                    status: res.status,
                    message: errorData.message || "No error message provided"
                });
                alert(`Update failed: ${res.status} ${errorData.message || ""}`);
            } else {
                alert("Settings updated successfully!");
                await fetchUserData();
            }
        } catch (err) {
            console.error("Network or Catch Error:", err);
            alert("Update failed. Check your internet or server connection.");
        } finally {
            setLoading(false);
        }
    };

    // --- UI Helper Components ---
    const SectionCard = ({ children, title, icon: Icon, className = "" }) => (
        <section className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                    {Icon && <Icon className={`w-5 h-5 text-[${BRAND_COLOR}]`} />}
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                </div>
            )}
            <div className="p-6">{children}</div>
        </section>
    );

    const InputLabel = ({ label }) => (
        <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">{label}</label>
    );

    const ReadOnlyField = ({ icon: Icon, label, value }) => (
        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <dt className="text-sm font-medium text-slate-500 mb-1">{label}</dt>
                <dd className="text-slate-900 font-semibold">{value}</dd>
            </div>
        </div>
    );

    const StatItem = ({ icon: Icon, value, label, colorClass = "text-slate-800" }) => (
        <div className="flex flex-col items-center justify-center p-4">
            <Icon className={`w-6 h-6 mb-2 ${colorClass}`} />
            <span className={`text-2xl font-black ${colorClass}`}>{value}</span>
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={{ name: user?.username || 'Student', profilePic: user?.profilePic || '' }}
                navItems={navItems}
                onLogout={Logout}
                activePath={location.pathname}
            />
            <main className="flex-1 md:ml-0 overflow-y-auto relative custom-scrollbar bg-slate-50/80 font-inter">
                {/* Mobile Menu Btn */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`md:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-xl text-[${BRAND_COLOR}]`}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="max-w-5xl mx-auto pt-8 pb-32 px-4 sm:px-6 md:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
                            <p className="text-slate-500 mt-2">Manage your profile details and account preferences.</p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full font-bold text-xs uppercase tracking-wider border border-teal-100">
                            <ShieldCheck className={`w-4 h-4 text-[${BRAND_COLOR}]`} />
                            {user?.accountType || 'User'} • Secured
                        </div>
                    </div>
                    {profileLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[${BRAND_COLOR}]`}></div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <SectionCard className="relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[${BRAND_COLOR}] to-cyan-400 opacity-10`}></div>
                                <div className="relative flex flex-col md:flex-row items-center gap-8 pt-4">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0 group">
                                        <div className={`h-28 w-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 flex items-center justify-center ring-4 ring-[${BRAND_COLOR}]/20`}>
                                            {user?.profilePic ? (
                                                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-12 h-12 text-slate-300" />
                                            )}
                                        </div>
                                        <label className={`absolute bottom-1 right-1 bg-[${BRAND_COLOR}] hover:bg-cyan-600 cursor-pointer rounded-full p-2.5 border-2 border-white shadow-sm transition-transform group-hover:scale-110`}>
                                            {uploadingPic ? (
                                                <span className="animate-spin block w-5 h-5 border-2 border-t-transparent border-white rounded-full"></span>
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-white" />
                                            )}
                                            <input type="file" accept="image/*" onChange={handlePicChange} className="hidden" />
                                        </label>
                                    </div>
                                    {/* Editable Fields */}
                                    <div className="flex-1 text-center md:text-left space-y-3">
                                        <div>
                                            <InputLabel label="Username" />
                                            <div className="relative max-w-xs mx-auto md:mx-0">
                                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <User className="w-5 h-5" />
                                                </span>
                                                <input
                                                    className={`w-full pl-10 pr-4 py-3 bg-slate-100 border-0 focus:ring-2 focus:ring-[${BRAND_COLOR}] rounded-xl font-bold text-slate-800`}
                                                    value={formData.username}
                                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                    placeholder="Enter username"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* User Stats */}
                                    <div className="flex divide-x divide-slate-100 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                        <StatItem icon={Coins} value={user?.coins ?? 0} label="Coins" colorClass={`text-[${BRAND_COLOR}]`} />
                                        <StatItem icon={Award} value={user?.badges?.length ?? 0} label="Badges" colorClass="text-amber-500" />
                                        <StatItem icon={Users} value={user?.followers?.length ?? 0} label="Followers" />
                                    </div>
                                </div>
                            </SectionCard>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-8">
                                    <SectionCard title="Public Profile Details" icon={NotebookText}>
                                        <div className="space-y-6">
                                            <div>
                                                <InputLabel label="Bio" />
                                                <textarea
                                                    className={`w-full p-4 bg-slate-100 border-0 focus:ring-2 focus:ring-[${BRAND_COLOR}] rounded-xl font-medium text-slate-700 min-h-[120px] resize-none`}
                                                    value={formData.bio}
                                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                    placeholder="Tell us a little bit about yourself..."
                                                />
                                                <p className="text-xs text-slate-500 mt-2 text-right">{formData.bio.length}/200 characters</p>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <InputLabel label="Location" />
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                            <MapPin className="w-5 h-5" />
                                                        </span>
                                                        <input
                                                            className={`w-full pl-10 pr-4 py-3 bg-slate-100 border-0 focus:ring-2 focus:ring-[${BRAND_COLOR}] rounded-xl font-semibold text-slate-800`}
                                                            value={formData.location}
                                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                            placeholder="e.g. Delhi, India"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${formData.isPrivate ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                                                            {formData.isPrivate ? <Lock className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm">{formData.isPrivate ? "Private Account" : "Public Account"}</p>
                                                            <p className="text-xs text-slate-500">{formData.isPrivate ? "Only followers see activity." : "Anyone can see activity."}</p>
                                                        </div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={formData.isPrivate} onChange={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })} className="sr-only peer" />
                                                        <div className={`w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[${BRAND_COLOR}] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[${BRAND_COLOR}]`}></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </SectionCard>
                                </div>
                                <div className="md:col-span-1 space-y-8">
                                    <SectionCard title="Account Information" icon={Shield}>
                                        <div className="space-y-2">
                                            <ReadOnlyField icon={Mail} label="Email Address" value={user?.email || "N/A"} />
                                            <ReadOnlyField icon={CreditCard} label="Plan Type" value={user?.accountType || "Free Tier"} />
                                            <ReadOnlyField icon={ShieldCheck} label="Student Status" value={user?.isStudentVerified ? "Verified Student" : "Not Verified"} />
                                            <ReadOnlyField icon={CalendarDays} label="Pro Expiry Date" value={user?.trialExpirationDate ? new Date(user.trialExpirationDate).toLocaleDateString() : "N/A"} />
                                        </div>
                                    </SectionCard>
                                    <SectionCard title="Earned Badges" icon={Award}>
                                        {user?.badges?.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {user.badges.map((badge, idx) => (
                                                    <div key={idx} className="flex flex-col items-center p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
                                                        <Award className="w-8 h-8 text-amber-500 mb-2" />
                                                        <span className="text-xs font-bold text-amber-800 leading-tight">{badge}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 text-slate-400 italic">
                                                No badges earned yet. Keep going!
                                            </div>
                                        )}
                                    </SectionCard>
                                </div>
                            </div>
                            <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-10">
                                <div className="max-w-5xl mx-auto flex items-center justify-between">
                                    <p className="text-sm text-slate-500 hidden sm:block">Some changes may require a fresh login.</p>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex items-center gap-2 bg-[${BRAND_COLOR}] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[${BRAND_COLOR}]/20 hover:bg-cyan-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed ml-auto sm:ml-0`}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="animate-spin block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <><Save className="w-5 h-5" />Save Changes</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </main>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}>
                </div>
            )}
        </div>
    );
};

export default Settings;