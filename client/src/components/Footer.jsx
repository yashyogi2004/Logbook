import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 text-center md:text-left">
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <div className="w-8 h-8 bg-[#00B8D9] rounded-lg flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-gray-900">Logbook</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering students to track their journey, one log at a time. Build your future portfolio today.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-[#00B8D9]">Home</Link></li>
              <li><Link to="/features" className="hover:text-[#00B8D9]">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-[#00B8D9]">Pricing</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/about-us" className="hover:text-[#00B8D9]">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#00B8D9]">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#00B8D9]">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://twitter.com/YOUR_HANDLE" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-[#00B8D9] hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/YOUR_PROFILE" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-[#00B8D9] hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/YOUR_PROFILE" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-[#00B8D9] hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Logbook Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;