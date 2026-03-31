import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw, Terminal, AlertTriangle } from 'lucide-react';

const FunnyTech404 = () => {
  const navigate = useNavigate();
  const [currentJoke, setCurrentJoke] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [coffeeLevel, setCoffeeLevel] = useState(100);
  const [bugCount, setBugCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const techJokes = [
    "404: Page not found. Maybe it's taking a coffee break?",
    "Error 404: Page went to get some RAM and never came back.",
    "404: This page is in another castle... or server.",
    "Page not found. It might be stuck in an infinite loop somewhere.",
    "404: Our hamsters powering the server got tired.",
    "Error: Page.exe has stopped working. Have you tried turning it off and on again?"
  ];

  const consoleMessages = [
    "Searching for page in /dev/null...",
    "Checking if page exists in parallel universe...",
    "Running: sudo find . -name 'missing-page' -type awesome",
    "Stack Overflow says: 'This question is a duplicate'",
    "Deploying emergency cat pictures...",
    "Initializing coffee.exe..."
  ];

  // Rotate jokes
  useEffect(() => {
    const jokeInterval = setInterval(() => {
      setCurrentJoke((prev) => (prev + 1) % techJokes.length);
    }, 4000);
    return () => clearInterval(jokeInterval);
  }, []);

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Coffee drain
  useEffect(() => {
    const coffeeInterval = setInterval(() => {
      setCoffeeLevel((prev) => Math.max(0, prev - 1));
    }, 200);
    return () => clearInterval(coffeeInterval);
  }, []);

  // Typing cursor
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }, 3000);
    return () => clearInterval(typingInterval);
  }, []);

  const addBug = () => setBugCount(prev => prev + 1);

  const FloatingBug = ({ delay }) => (
    <div 
      className="absolute text-2xl animate-bounce transition-all duration-300 hover:scale-150 cursor-pointer"
      style={{
        animationDelay: `${delay}s`,
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 80 + 10}%`,
        opacity: 0.7
      }}
      onClick={(e) => {
        e.target.style.display = 'none';
        setBugCount(prev => Math.max(0, prev - 1));
      }}
    >
      🐛
    </div>
  );

  const LoadingBar = ({ label, value, color }) => (
    <div className="mb-3 group">
      <div className="flex justify-between text-xs font-mono text-gray-400 mb-1 group-hover:text-[#00B8D9] transition-colors">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    // UPDATED CLASS: fixed inset-0 z-[9999] makes it cover the entire screen over Header/Footer
    <div className="fixed inset-0 z-[9999] bg-[#0f172a] text-[#00B8D9] font-mono overflow-hidden selection:bg-[#00B8D9] selection:text-white">
      
      {/* Matrix Background (Brand Themed) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-[10px] animate-pulse leading-none"
            style={{
              left: `${i * 4}%`,
              top: `-${Math.random() * 20}%`,
              animation: `matrixRain ${2 + Math.random() * 5}s infinite linear`,
              opacity: Math.random()
            }}
          >
            {Array.from({ length: 30 }).map((_, j) => (
              <div key={j} className="my-1">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Floating Bugs */}
      {Array.from({ length: bugCount }).map((_, i) => (
        <FloatingBug key={i} delay={i * 0.5} />
      ))}

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center">
        
        {/* Main Terminal Window */}
        <div className={`w-full max-w-3xl bg-[#1e293b]/90 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all duration-100 ${isGlitching ? 'translate-x-1 -translate-y-1 skew-x-1 filter hue-rotate-90' : ''}`}>
          
          {/* Terminal Header */}
          <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer"></div>
            </div>
            <div className="text-xs text-gray-400 font-medium flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              system_crash_report.log
            </div>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-5 gap-8">
            
            {/* Left Col: The Error */}
            <div className="md:col-span-3 space-y-6">
              <div className="space-y-2">
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter opacity-90">
                  4<span className="text-[#00B8D9]">0</span>4
                </h1>
                <p className="text-xl text-gray-300 font-bold">
                  {isGlitching ? "SYSTEM_CRITICAL_FAILURE" : "Page Not Found"}
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border-l-2 border-[#00B8D9]">
                <div className="text-[#00B8D9] mb-2 text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Live Logs:
                </div>
                <div className="space-y-1 text-xs md:text-sm text-gray-400 font-mono h-24 overflow-hidden relative">
                  {consoleMessages.map((msg, i) => (
                    <div key={i} className={`${i === consoleMessages.length - 1 ? 'text-yellow-300' : ''}`}>
                      <span className="text-green-500 mr-2">➜</span>
                      {msg}
                      {i === consoleMessages.length - 1 && isTyping && <span className="animate-pulse">_</span>}
                    </div>
                  ))}
                  {/* Fade out bottom effect */}
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#151d29] to-transparent"></div>
                </div>
              </div>

              <div className="p-4 bg-[#00B8D9]/10 rounded-lg border border-[#00B8D9]/20">
                <p className="text-sm text-[#00B8D9] italic">
                  "{techJokes[currentJoke]}"
                </p>
              </div>
            </div>

            {/* Right Col: Stats & Actions */}
            <div className="md:col-span-2 flex flex-col justify-between space-y-6">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">
                  System Diagnostics
                </h3>
                <LoadingBar label="Stress Level" value={85} color="bg-red-500" />
                <LoadingBar label="Caffeine" value={coffeeLevel} color="bg-yellow-500" />
                <LoadingBar label="Bugs in Prod" value={bugCount * 12 + 4} color="bg-purple-500" />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 px-4 bg-[#00B8D9] hover:bg-[#009fb8] text-white font-bold rounded-lg shadow-lg shadow-[#00B8D9]/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Safe Mode (Home)
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCoffeeLevel(100)}
                    className="py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refill Coffee
                  </button>
                  <button
                    onClick={addBug}
                    className="py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    + Add Bug
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>Error Code: ID_10_T | Please replace user and try again.</p>
        </div>

      </div>

      <style>{`
        @keyframes matrixRain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FunnyTech404;