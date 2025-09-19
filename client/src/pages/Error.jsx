import React, { useState, useEffect } from 'react';

const FunnyTech404 = () => {
  const [currentJoke, setCurrentJoke] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showBluScreen, setShowBluScreen] = useState(false);
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

  // Rotate jokes every 3 seconds
  useEffect(() => {
    const jokeInterval = setInterval(() => {
      setCurrentJoke((prev) => (prev + 1) % techJokes.length);
    }, 3000);
    return () => clearInterval(jokeInterval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Decrease coffee level over time
  useEffect(() => {
    const coffeeInterval = setInterval(() => {
      setCoffeeLevel((prev) => Math.max(0, prev - 1));
    }, 100);
    return () => clearInterval(coffeeInterval);
  }, []);

  // Typing animation effect
  useEffect(() => {
    const typingInterval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }, 3000);
    return () => clearInterval(typingInterval);
  }, []);

  const handleBluScreen = () => {
    setShowBluScreen(true);
    setTimeout(() => setShowBluScreen(false), 3000);
  };

  const addBug = () => {
    setBugCount(prev => prev + 1);
  };

  const FloatingBug = ({ delay, size = "text-2xl" }) => (
    <div 
      className={`absolute ${size} animate-bounce`}
      style={{
        animationDelay: `${delay}s`,
        left: `${Math.random() * 80}%`,
        top: `${Math.random() * 60 + 20}%`
      }}
    >
      🐛
    </div>
  );

  const LoadingBar = ({ label, value, color = "bg-green-500" }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-green-400 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  if (showBluScreen) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center text-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-4xl font-bold mb-4">BLUE SCREEN OF SADNESS</h1>
          <p className="text-xl mb-4">Windows has encountered a problem and needs to restart.</p>
          <p className="text-sm">Error: PAGE_NOT_FOUND_EXCEPTION</p>
          <div className="mt-8">
            <div className="animate-pulse">Collecting error info... please wait</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono overflow-hidden relative">
      
      {/* Floating Bugs */}
      {Array.from({ length: bugCount + 3 }).map((_, i) => (
        <FloatingBug key={i} delay={i * 0.5} />
      ))}

      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-xs animate-pulse"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {Array.from({ length: 50 }).map((_, j) => (
              <div key={j} className="mb-2">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-center min-h-screen">
        
        {/* Terminal Window */}
        <div className="bg-black border-2 border-green-500 rounded-lg shadow-2xl max-w-4xl w-full">
          
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-2 rounded-t-lg flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center text-gray-300 text-sm">
              Terminal - 404_error_handler.sh
            </div>
          </div>
          
          {/* Terminal Content */}
          <div className="p-6 space-y-4">
            
            {/* ASCII Art 404 */}
            <div className={`text-center mb-6 ${isGlitching ? 'animate-pulse text-red-500' : ''}`}>
              <pre className="text-sm md:text-base lg:text-lg leading-tight">
{`
 ██╗  ██╗ ██████╗ ██╗  ██╗
 ██║  ██║██╔═████╗██║  ██║
 ███████║██║██╔██║███████║
 ╚════██║████╔╝██║╚════██║
      ██║╚██████╔╝     ██║
      ╚═╝ ╚═════╝      ╚═╝
`}
              </pre>
            </div>

            {/* Rotating Jokes */}
            <div className="text-center mb-6">
              <div className="text-yellow-400 text-lg mb-2">
                {isGlitching ? "3RR0R: J0K3_N07_F0UND" : techJokes[currentJoke]}
              </div>
              <div className="text-xs text-gray-500">
                {isTyping && <span className="animate-pulse">▋</span>}
              </div>
            </div>

            {/* System Status */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Left Column - System Info */}
              <div className="space-y-4">
                <div className="text-green-300 border border-green-500 rounded p-4">
                  <h3 className="text-lg mb-3 flex items-center">
                    💻 System Status
                    {isGlitching && <span className="ml-2 text-red-500 animate-bounce">⚠️</span>}
                  </h3>
                  
                  <LoadingBar label="CPU Usage" value={85} color="bg-red-500" />
                  <LoadingBar label="RAM Usage" value={92} color="bg-yellow-500" />
                  <LoadingBar label="Coffee Level" value={coffeeLevel} color="bg-amber-600" />
                  <LoadingBar label="Motivation" value={12} color="bg-blue-500" />
                  
                  <div className="mt-4 text-xs">
                    <div>Uptime: 99.99% (except when it matters)</div>
                    <div>Bugs Found: {bugCount + 42} 🐛</div>
                    <div className="text-red-400">Last Backup: Never</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Console Output */}
              <div className="space-y-4">
                <div className="text-green-300 border border-green-500 rounded p-4">
                  <h3 className="text-lg mb-3 flex items-center">
                    📟 Console Output
                    {isTyping && <span className="ml-2 animate-pulse">▋</span>}
                  </h3>
                  
                  <div className="space-y-2 text-xs">
                    {consoleMessages.map((msg, i) => (
                      <div 
                        key={i}
                        className={`${i === consoleMessages.length - 1 ? 'text-yellow-400' : 'text-gray-400'}`}
                      >
                        <span className="text-green-500">$</span> {msg}
                        {i === consoleMessages.length - 1 && isTyping && (
                          <span className="animate-pulse ml-1">▋</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Details */}
            <div className="text-center space-y-4">
              <div className="text-red-400 text-sm">
                <div>Error Code: 404_PAGE_WENT_FOR_COFFEE</div>
                <div>Stack Trace: Too deep to display (probably infinite recursion)</div>
                <div>Suggested Fix: Have you tried unplugging the internet and plugging it back in?</div>
              </div>
              
              {/* Fun Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <button
                  onClick={handleBluScreen}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
                >
                  💀 Trigger BSoD
                </button>
                <button
                  onClick={addBug}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors duration-200"
                >
                  🐛 Add Bug (+1)
                </button>
                <button
                  onClick={() => setCoffeeLevel(100)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm transition-colors duration-200"
                >
                  ☕ Refill Coffee
                </button>
              </div>

              {/* Tech Joke Footer */}
              <div className="mt-8 text-xs text-gray-500 space-y-1">
                <div>🤖 "There are only 10 types of people: those who understand binary and those who don't."</div>
                <div>💡 Pro Tip: The best debugging tool is still console.log()</div>
                <div className="animate-pulse">🔧 Currently debugging the debugger that debugs the debug code...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnyTech404;