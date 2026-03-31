import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = ({ Logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null); // Store user object instead of just boolean
  const location = useLocation();

  // Check login status and get User Details on navigation
  useEffect(() => {
    const storedUser = localStorage.getItem("admin");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 bg-[#00B8D9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-extrabold text-[#212529] tracking-tight">
              Log<span className="text-[#00B8D9]">book</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-wide transition-colors relative group ${
                  location.pathname === link.path ? 'text-[#00B8D9]' : 'text-gray-500 hover:text-[#00B8D9]'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#00B8D9] transform transition-transform origin-left ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Hi, {user.username || "User"}
                </span>
                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-gray-700 font-bold hover:text-[#00B8D9] transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={Logout}
                  className="px-5 py-2.5 bg-red-50 text-red-500 font-bold rounded-full hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 font-bold hover:text-[#00B8D9] transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-[#00B8D9] text-white font-bold rounded-full hover:bg-[#009fb8] transition-all shadow-lg hover:shadow-teal-200 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-2xl animate-fade-in-down">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 text-base font-bold rounded-xl transition-colors ${
                   location.pathname === link.path 
                   ? 'bg-teal-50 text-[#00B8D9]' 
                   : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-px bg-gray-100 my-4"></div>

            {user ? (
              <div className="space-y-3">
                <div className="px-4 text-sm text-gray-500 font-semibold">
                    Signed in as: <span className="text-[#00B8D9]">{user.username}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="block w-full text-center px-4 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { Logout(); setIsOpen(false); }}
                  className="block w-full text-center px-4 py-3 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 text-[#00B8D9] font-bold border-2 border-[#00B8D9] rounded-xl hover:bg-teal-50"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-3 bg-[#00B8D9] text-white font-bold rounded-xl shadow-md"
                  onClick={() => setIsOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;