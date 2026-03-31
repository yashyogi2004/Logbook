import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your Logbook AI assistant. Ask me anything about tracking your progress!",
            sender: 'bot'
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the last message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // To handle external “openChat” events
    useEffect(() => {
        const handleOpenEvent = () => setIsOpen(true);
        window.addEventListener('openChat', handleOpenEvent);
        return () => window.removeEventListener('openChat', handleOpenEvent);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        try {
            // Call BACKEND OpenAI proxy
            const response = await fetch(
                "/openai-chat",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        // OpenAI expects role, but just sending user msg for now
                        messages: [{ sender: 'user', text: userMsg.text }]
                    })
                }
            );

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error("Network/server error (non-JSON)");
            }

            // If backend returns error (e.g., { message: '...' })
            if (!response.ok) {
                throw new Error(data.message || "AI error");
            }

            // Extract OpenAI chat response
            const aiText =
                data.result ||
                data.message ||
                "I'm having trouble connecting to the AI right now.";

            setMessages(prev => [
                ...prev,
                { id: Date.now() + 1, text: aiText, sender: 'bot' }
            ]);

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Sorry, I encountered an error. Please try again.",
                    sender: 'bot'
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-slide-up h-[500px]">
                    {/* Header */}
                    <div className="bg-[#00B8D9] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">AI Support</h3>
                                <p className="text-xs text-teal-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.sender === 'user'
                                        ? 'bg-[#00B8D9] text-white rounded-br-none'
                                        : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            placeholder="Ask AI..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B8D9]"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || isTyping}
                            className="bg-[#00B8D9] text-white p-2.5 rounded-xl hover:bg-[#009fb8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all transform hover:scale-110 ${
                    isOpen ? 'bg-gray-200 text-gray-600' : 'bg-[#00B8D9] text-white'
                }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default AIChatWidget;