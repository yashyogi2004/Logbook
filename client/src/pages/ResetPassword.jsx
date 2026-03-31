import React, { useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, ShieldCheck, Zap, Home, NotebookText, Compass, User, LogOut, Loader2, KeyRound } from "lucide-react";

// --- Background Component for Consistency ---
const BackgroundHexagon = ({ top, bottom, left, right, scale, className = 'opacity-30' }) => (
    <svg className={`fixed z-0 ${className}`} style={{ top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" transform="translate(25, 25) scale(0.5)" opacity="0.5" />
    </svg>
);

const SidebarLink = ({ icon: Icon, title, to }) => (
    <Link to={to} className="group flex items-center space-x-3 p-3 mx-2 rounded-xl transition-all duration-300 text-white/70 hover:bg-white/10 hover:text-white">
        <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        <span className="text-md font-medium tracking-wide">{title}</span>
    </Link>
);

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword({ Logout }) {
    const query = useQuery();
    const navigate = useNavigate();

    const token = query.get("token") || "";
    const email = query.get("email") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: "", message: "" });

        if (!token || !email) {
            setStatus({ type: "error", message: "Invalid reset link." });
            return;
        }

        if (newPassword.length < 6) {
            setStatus({ type: "error", message: "Password must be at least 6 characters." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ type: "error", message: "Passwords do not match." });
            return;
        }

        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_URL?.replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/resetPasswordWithToken`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, newPassword }),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Reset failed.");

            setStatus({ type: "success", message: "Password reset successful." });
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setStatus({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen font-sans bg-[#f7f8fa] relative overflow-hidden">
            {/* Background Texture */}
            <BackgroundHexagon top="-5%" right="-5%" scale="1.5" className="text-[#00B8D9] opacity-5" />
            <BackgroundHexagon bottom="10%" left="-5%" scale="1.2" className="text-gray-400 opacity-5" />

            {/* Main Content with Correct Alignment */}
            <main className="min-h-screen w-full relative z-10 flex items-center justify-center p-4">
                <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        
                        {/* Gradient Header Banner */}
                        <div className="bg-gradient-to-r from-[#00B8D9] to-[#00D1FF] p-8 text-white relative">
                            <h2 className="text-3xl font-black mb-2 relative z-10">Security</h2>
                            <p className="text-[#E0F7FA] font-medium opacity-90 relative z-10">Set a new password for <b>{email || "your account"}</b></p>
                            <Lock className="absolute top-0 right-0 p-4 w-32 h-32 opacity-10 transform translate-x-4 -translate-y-4" />
                        </div>

                        <div className="p-8 md:p-10">
                            {status.message && (
                                <div className={`mb-6 p-4 rounded-xl font-bold text-sm border ${
                                    status.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                    {status.message}
                                </div>
                            )}

                            {!token || !email ? (
                                <div className="text-center py-4">
                                    <p className="text-red-500 font-bold mb-4">Invalid reset link.</p>
                                    <Link to="/login" className="text-[#00B8D9] font-black underline">Back to Login</Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Password Input */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                className="w-full py-4 pl-12 pr-5 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-bold"
                                                placeholder="Enter 6+ characters"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                            <KeyRound className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                className="w-full py-4 pl-12 pr-5 bg-gray-50 border-2 border-transparent focus:border-[#00B8D9] focus:bg-white rounded-2xl outline-none transition-all text-gray-700 font-bold"
                                                placeholder="Repeat password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={loading}
                                            />
                                            <ShieldCheck className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-3 bg-[#00B8D9] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#00B8D9]/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}