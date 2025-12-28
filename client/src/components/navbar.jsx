import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

// Define the colors for consistency with other components
const COLORS = {
    'gemini-teal': '#00B8D9',
    'gemini-dark': '#212529',
};

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
    // Add more public links here if needed
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className='fixed top-0 left-0 w-full z-30 bg-white shadow-lg'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16 md:h-20'>
                    {/* Logo/Title */}
                    <Link to='/' className='flex items-center space-x-2'>
                        <Zap className='h-6 w-6 text-gemini-teal' />
                        <span className='text-xl md:text-2xl font-extrabold text-gemini-dark'>
                            <span style={{ color: COLORS['gemini-teal'] }}>Log</span>book
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className='hidden md:flex space-x-8'>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className='text-gemini-dark font-medium text-lg hover:text-gray-600 transition duration-150'
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className='hidden md:flex items-center space-x-3'>
                        <Link
                            to='/login'
                            className='block text-center px-6 py-2 border-2 border-gemini-teal text-gemini-teal font-semibold rounded-full hover:bg-gemini-teal hover:text-white transition duration-300'
                            style={{ borderColor: COLORS['gemini-teal'] }}
                        >
                            Sign Up
                        </Link>

                        <Link
                            to='/login'
                            className='block text-center px-6 py-2 border-2 border-gemini-teal text-gemini-teal font-semibold rounded-full hover:bg-gemini-teal hover:text-white transition duration-300'
                            style={{ borderColor: COLORS['gemini-teal'] }}
                        >
                            Sign In
                        </Link>
                    </div>

                    <div className='flex md:hidden'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='inline-flex items-center justify-center p-2 rounded-md text-gemini-dark hover:text-gemini-teal hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gemini-teal'
                            aria-expanded='false'
                        >
                            <span className='sr-only'>Open main menu</span>
                            {isOpen ? (
                                <X className='block h-6 w-6' aria-hidden='true' />
                            ) : (
                                <Menu className='block h-6 w-6' aria-hidden='true' />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className='md:hidden bg-white shadow-xl pb-3'>
                    <div className='pt-2 pb-3 space-y-1 px-2'>
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className='block px-3 py-2 rounded-md text-base font-medium text-gemini-dark hover:bg-gray-50 hover:text-gemini-teal transition duration-150'
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="px-5 pt-4 pb-4 space-y-3">
                        <Link
                            to="login"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center px-4 py-2 border-2 border-gemini-teal text-gemini-teal font-semibold rounded-full hover:bg-gemini-teal hover:text-white transition duration-300"
                            style={{ borderColor: COLORS['gemini-teal'] }}
                        >
                            Sign Up
                        </Link>
                        
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center px-4 py-2 border-2 border-gemini-teal text-gemini-teal font-semibold rounded-full hover:bg-gemini-teal hover:text-white transition duration-300"
                            style={{ borderColor: COLORS['gemini-teal'] }}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

