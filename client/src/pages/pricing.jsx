import React, { useState } from 'react';
import { 
    Check, Zap, ShieldCheck, Star, 
    Rocket, Crown, Building2, ArrowLeft, GraduationCap, Loader2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- Reusable Background Texture ---
const BackgroundHexagon = React.memo(({ top, bottom, left, right, scale, className = 'opacity-30' }) => {
    const style = { top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' };
    return (
        <svg className={`fixed z-0 ${className}`} style={style} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" transform="translate(25, 25) scale(0.5)" opacity="0.5" />
        </svg>
    );
});

const PricingCard = ({ tier, price, subtext, icon: Icon, features, popular, buttonText, isStudent, onSelect, loading }) => (
    <div className={`bg-white p-8 rounded-[2.5rem] shadow-xl border ${popular ? 'border-[#00B8D9] border-2 scale-105' : 'border-gray-100'} hover:shadow-2xl transition-all duration-300 relative flex flex-col`}>
        {popular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00B8D9] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Most Popular
            </div>
        )}
        
        <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-2xl ${popular ? 'bg-[#00B8D9] text-white' : 'bg-[#00B8D9]/10 text-[#00B8D9]'}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-800 tracking-tight">{tier}</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Plan</p>
            </div>
        </div>

        <div className="mb-4">
            <span className="text-4xl font-black text-gray-900">{price}</span>
            <span className="text-gray-400 font-bold text-sm"> {subtext}</span>
        </div>

        {isStudent && (
            <div className="mb-6 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-xs font-bold">
                <GraduationCap className="w-4 h-4" />
                Verified Student Discount Applied
            </div>
        )}

        <ul className="space-y-4 mb-10 flex-1">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600 text-sm font-medium">
                    <Check className="w-5 h-5 text-[#00B8D9] shrink-0" />
                    {feature}
                </li>
            ))}
        </ul>

        <button
            onClick={onSelect}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 ${
                popular 
                ? 'bg-[#00B8D9] text-white shadow-xl shadow-[#00B8D9]/30 hover:scale-[1.02]' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            } disabled:opacity-50`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
        </button>
    </div>
);

const Pricing = () => {
    const navigate = useNavigate();
    const [loadingTier, setLoadingTier] = useState(null);

    // --- FUNCTION: Handle Plan Activation ---
    const handlePlanAction = async (planType) => {
        setLoadingTier(planType);
        const endpoint = planType === 'Student' ? '/verify-student' : '/activate-trial';
        
        try {
            const res = await fetch(`${import.meta.env.VITE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Plan updated successfully!");
                navigate('/profile'); // Redirect to profile to see the new badge
            } else {
                // If user is not logged in, fetch will return error (redirect to login)
                if (res.status === 401) {
                    navigate('/login');
                } else {
                    alert(data.message || "Action failed.");
                }
            }
        } catch (err) {
            console.error("Pricing Error:", err);
            alert("Connection error. Please try again.");
        } finally {
            setLoadingTier(null);
        }
    };

    const PLANS = [
        {
            tier: "Student",
            price: "Free",
            subtext: "Forever",
            icon: GraduationCap,
            features: ["Unlimited Logs for Students", "Basic Stats Charts", "Public Profile View", "Academic Portfolio Export", "Community Access"],
            buttonText: "Claim Student Access",
            popular: false,
            isStudent: true,
            action: () => handlePlanAction('Student')
        },
        {
            tier: "Achiever Pro",
            price: "Free",
            subtext: "for 1 Year",
            icon: Crown,
            features: ["Advanced Analytics", "Private Log Security", "Profile Badges", "Priority Support", "PDF Portfolio Export", "Custom Goal Tracking"],
            buttonText: "Start 12-Month Trial",
            popular: true,
            isStudent: false,
            action: () => handlePlanAction('Pro')
        },
        {
            tier: "Campus",
            price: "$29",
            subtext: "/ month",
            icon: Building2,
            features: ["Everything in Pro", "Institutional Collaboration", "Custom Branding", "Bulk User Export", "Institutional API Access"],
            buttonText: "Contact Sales",
            popular: false,
            isStudent: false,
            action: () => window.location.href = "mailto:support@logbook.com"
        }
    ];

    return (
        <div className="min-h-screen font-sans bg-[#f7f8fa] relative overflow-x-hidden">
            <BackgroundHexagon top="-5%" right="-5%" scale="1.5" className="text-[#00B8D9] opacity-5" />
            <BackgroundHexagon bottom="10%" left="-5%" scale="1.2" className="text-gray-400 opacity-5" />

            <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#00B8D9] font-bold transition-all bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-[#00B8D9] fill-current" />
                    <span className="text-xl font-black text-gray-900 tracking-tighter">Logbook</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center relative z-10">
                <header className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-teal-500">Students</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Logbook is free for verified students and offers extended trials for professional portfolios.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 w-full animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    {PLANS.map((plan) => (
                        <PricingCard 
                            key={plan.tier} 
                            {...plan} 
                            onSelect={plan.action} 
                            loading={loadingTier === (plan.tier === 'Student' ? 'Student' : 'Pro')} 
                        />
                    ))}
                </div>

                <div className="max-w-4xl w-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-left">
                        <div className="bg-[#00B8D9]/10 p-3 rounded-2xl">
                            <ShieldCheck className="w-6 h-6 text-[#00B8D9]" />
                        </div>
                        <div>
                            <p className="font-black text-gray-800">Verified Access</p>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Active Academic Status</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium text-center md:text-left flex-1 px-4 leading-relaxed">
                        Free Student accounts are active as long as you have a valid institutional ID. Trial users can upgrade to Pro at any time.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Pricing;