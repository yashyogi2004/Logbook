import React from 'react';

const SupportBanner = ({ showHumanSupport = false }) => {
  // Launch Gemini AI chat
  const handleStartAIChat = () => {
    const event = new Event('openChat');
    window.dispatchEvent(event);
  };

  // Launch Tawk.to Human chat
  const handleStartHumanChat = () => {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
      window.Tawk_API.maximize();
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#00B8D9] rounded-3xl p-8 text-white shadow-xl h-full flex flex-col justify-center">
      {/* Decorative Background Hexagon */}
      <div className="absolute -right-16 -top-16 text-white opacity-10 pointer-events-none">
        <svg width="250" height="250" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M50 2 L98 27 V73 L50 98 L2 73 V27 Z" />
          <path d="M50 25 L75 37.5 V62.5 L50 75 L25 62.5 V37.5 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-extrabold mb-3">AI Assistant</h3>
        <p className="text-teal-50 text-sm mb-8 leading-relaxed max-w-[80%]">
          Have a question about the app? Our <span className="font-bold">Gemini AI assistant</span> can help instantly!
        </p>

        <div className="flex gap-4 flex-col sm:flex-row">
          {/* Ask AI Button */}
          <button
            onClick={handleStartAIChat}
            className="bg-white text-[#00B8D9] font-bold py-3 px-6 rounded-xl shadow-md hover:bg-gray-50 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Ask Gemini AI
          </button>

          {/* Optional: Human support via Tawk.to */}
          {showHumanSupport &&
            <button
              onClick={handleStartHumanChat}
              className="bg-[#fff9] text-[#00B8D9] font-bold py-3 px-6 rounded-xl shadow hover:bg-[#e1fbff] transition-all border border-white"
            >
              Live Human Chat
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default SupportBanner;