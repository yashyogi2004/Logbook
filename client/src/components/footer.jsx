import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const COLORS = {
    'gemini-teal': '#00B8D9',
    'gemini-dark': '#212529',
};

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Facebook, href: '#facebook', label: 'Facebook' },
        { icon: Twitter, href: '#twitter', label: 'Twitter' },
        { icon: Instagram, href: '#instagram', label: 'Instagram' },
        { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    ];
    
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Privacy Policy', path: '#privacy' },
    ];

    return (
        <footer className='bg-gray-800 text-gray-300 pt-10 pb-6 mt-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8'>
                 
                    <div>
                        <Link to='/' className='flex items-center space-x-2 mb-4'>
                            <Zap className='h-6 w-6 text-gemini-teal' />
                            <span className='text-2xl font-extrabold text-white'>
                                <span style={{ color: COLORS['gemini-teal'] }}>Log</span>book
                            </span>
                        </Link>
                        <p className='text-sm mt-2 max-w-xs'>
                            Organizing your academic life, one log entry at a time. Empowering students for success.
                        </p>
                     
                        <div className='flex space-x-4 mt-6'>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className='text-gray-400 hover:text-gemini-teal transition duration-200'
                                >
                                    <social.icon className='h-6 w-6' />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className='text-lg font-semibold text-white mb-4'>Quick Links</h4>
                        <ul className='space-y-3'>
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className='text-sm hover:text-gemini-teal transition duration-200'
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='md:col-span-2'>
                        <h4 className='text-lg font-semibold text-white mb-4'>Get In Touch</h4>
                        <p className='text-sm mb-4'>We're here to help you with any questions about your academic journey.</p>
                        
                        <div className='space-y-3'>
                            <div className='flex items-center space-x-3'>
                                <Mail className='h-5 w-5 text-gemini-teal' />
                                <a href='mailto:support@logbook.edu' className='text-sm hover:text-gemini-teal transition duration-200'>
                                    support@logbook.edu
                                </a>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Phone className='h-5 w-5 text-gemini-teal' />
                                <a href='tel:+1234567890' className='text-sm hover:text-gemini-teal transition duration-200'>
                                    (123) 456-7890
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-6 pt-4 text-center'>
                    <p className='text-sm text-gray-400'>
                        &copy; {currentYear} <span style={{ color: COLORS['gemini-teal'] }}>Logbook</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
