import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, AtSign, User, Mail, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Reusing the Hexagon from your About Us page for consistency
const BackgroundHexagon = ({ top, bottom, left, right, scale, className = 'opacity-30' }) => (
    <svg
        className={`absolute z-0 ${className}`}
        style={{ top, bottom, left, right, transform: `scale(${scale})`, pointerEvents: 'none' }}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
    >
        <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 0L100 25V75L50 100L0 75V25Z" fill="none" stroke="currentColor" strokeWidth="2" transform="translate(25, 25) scale(0.5)" opacity="0.5" />
    </svg>
);

const ContactInfoCard = ({ icon: Icon, title, content, subContent, delay }) => (
    <div
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="p-4 bg-teal-50 rounded-2xl flex-shrink-0 text-[#00B8D9]">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm font-bold text-[#00B8D9] uppercase tracking-wider mb-1">{title}</p>
            <p className="text-lg font-bold text-gray-900">{content}</p>
            {subContent && <p className="text-sm text-gray-500 mt-1">{subContent}</p>}
        </div>
    </div>
);

const FormField = ({ id, label, type, placeholder, icon: Icon, isTextArea = false, value, onChange }) => (
    <div className="space-y-2 group">
        <label htmlFor={id} className="text-sm font-semibold text-gray-700 block transition-colors group-focus-within:text-[#00B8D9]">
            {label}
        </label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#00B8D9] transition-colors duration-200">
                {Icon && <Icon className={`w-5 h-5 ${isTextArea ? '-mt-10' : ''}`} />}
            </div>

            {isTextArea ? (
                <textarea
                    id={id}
                    name={id}
                    rows="4"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required
                    className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B8D9]/50 focus:border-[#00B8D9] outline-none transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                ></textarea>
            ) : (
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required
                    className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B8D9]/50 focus:border-[#00B8D9] outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
            )}
        </div>
    </div>
);

const ContactUs = () => {
    // 1. STATE FOR FORM DATA
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // 2. STATE FOR STATUS
    const [status, setStatus] = useState({
        submitting: false,
        success: false,
        error: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name.replace('contact-', '')]: value // Cleaning 'contact-name' to 'name'
        }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, success: false, error: null });

        try {
            // FIX: Ensure this endpoint exists in your Backend routes
            const res = await fetch(`${import.meta.env.VITE_URL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            // Check if response is JSON (Avoiding the SyntaxError '<' token)
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server Error: Received HTML instead of JSON. Check your backend route.");
            }

            if (res.ok) {
                setStatus({ submitting: false, success: true, error: null });
                setFormData({ name: '', email: '', message: '' }); // Clear form
            } else {
                const data = await res.json();
                throw new Error(data.message || "Failed to send message.");
            }
        } catch (err) {
            console.error(err);
            setStatus({ submitting: false, success: false, error: err.message });
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] font-sans text-gray-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
                <BackgroundHexagon top="-5%" left="-5%" scale="1.5" className="text-[#00B8D9] opacity-10" />
                <BackgroundHexagon bottom="-10%" right="-5%" scale="1.2" className="text-gray-400 opacity-10" />
                <BackgroundHexagon top="40%" right="5%" scale="0.6" className="text-[#00B8D9] opacity-5" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="h-8 w-20 mb-8 mx-auto invisible"></div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B8D9] to-teal-500">Conversation</span>
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Have questions about Logbook? Need support or just want to give feedback? We are here to listen and help you move forward.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Left Column: Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <ContactInfoCard icon={AtSign} title="Email Us" content="support@logbook.com" subContent="We usually reply within 24 hours." delay={100} />
                        <ContactInfoCard icon={Phone} title="Call Us" content="+1 (555) 123-4567" subContent="Mon-Fri, 9am to 6pm EST." delay={200} />
                        <ContactInfoCard icon={MapPin} title="Visit Us" content="Logbook HQ" subContent="123 Innovation Dr, Kota, Rajasthan" delay={300} />

                        {/* Decor box */}
                        <div className="bg-gradient-to-br from-[#00B8D9] to-teal-600 rounded-2xl p-8 text-white shadow-xl mt-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-2">Need Live Support?</h3>
                                <p className="text-teal-100 text-sm mb-4">Our team is available for live chat during business hours.</p>
                                <button className="text-sm font-bold bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors">
                                    Start Chat
                                </button>
                            </div>
                            <BackgroundHexagon bottom="-20px" right="-20px" scale="0.8" className="text-white opacity-20 absolute" />
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00B8D9] to-teal-500"></div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>

                            {/* Status Messages */}
                            {status.success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Thank you! Your message has been sent successfully.</span>
                                </div>
                            )}

                            {status.error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in shake duration-300">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-semibold">{status.error}</span>
                                </div>
                            )}

                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        id="contact-name"
                                        label="Your Name"
                                        type="text"
                                        placeholder="John Doe"
                                        icon={User}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <FormField
                                        id="contact-email"
                                        label="Your Email"
                                        type="email"
                                        placeholder="john@example.com"
                                        icon={Mail}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <FormField
                                    id="contact-message"
                                    label="Message"
                                    placeholder="How can we help you today?"
                                    icon={MessageCircle}
                                    isTextArea={true}
                                    value={formData.message}
                                    onChange={handleChange}
                                />

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={status.submitting}
                                        className={`w-full md:w-auto px-8 py-4 bg-[#00B8D9] text-white font-bold rounded-xl text-lg transition duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center space-x-2 group ${status.submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#009fb8]'}`}
                                    >
                                        {status.submitting ? (
                                            <>
                                                <span>Sending...</span>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;