import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail, Zap, Globe } from 'lucide-react';
import Favicon from '../assets/Favicon.png';

const Footer = () => {
    const location = useLocation();

    const getLinkClass = (path) => {
        return `text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 group ${location.pathname === path ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-400'}`;
    };

    const getBottomLinkClass = (path) => {
        return `text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === path ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`;
    };

    return (
        <footer className="bg-gaming-900 border-t border-cyan-500/30 pt-16 pb-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-10">

                    {/* Brand Section */}
                    <div className="flex-1 max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gaming-800 rounded-lg border border-cyan-500/30">
                                <img src={Favicon} alt="BidZilla Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black italic tracking-widest text-white drop-shadow-md">
                                BID<span className="text-cyan-400">ZILLA</span>
                            </h2>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed mb-6">
                            Next-generation esports auction platform. Host dynamic bidding events, manage team rosters, and track player transactions with total precision.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="https://github.com/Ashish27KUMAR" className="p-2 bg-gaming-800 border border-white/10 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="https://www.linkedin.com/in/ashish-kumar-8059b5302?utm_source=share_via&utm_content=profile&utm_medium=member_android" className="p-2 bg-gaming-800 border border-white/10 rounded-lg text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="https://www.instagram.com/ashish_chaurasiya27?igsh=cWF2c2hpNm1jMW5m" className="p-2 bg-gaming-800 border border-white/10 rounded-lg text-gray-400 hover:text-pink-400 hover:border-pink-500/50 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links & Contact Wrapper for horizontal alignment on large screens */}
                    <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-black italic uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-purple-400" /> Sections
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link onClick={() => window.scrollTo(0, 0)} to="/home" className={getLinkClass('/home')}>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link onClick={() => window.scrollTo(0, 0)} to="/features" className={getLinkClass('/features')}>
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link onClick={() => window.scrollTo(0, 0)} to="/how-it-works" className={getLinkClass('/how-it-works')}>
                                        How It Works
                                    </Link>
                                </li>
                                <li>
                                    <Link onClick={() => window.scrollTo(0, 0)} to="/about" className={getLinkClass('/about')}>
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-black italic uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" /> Support
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-4 max-w-xs">
                                Need technical assistance or want to report a bug in the arena?
                            </p>
                            <a href="mailto:[support.bidzilla@gmail.com]" className="inline-flex items-center gap-2 text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all mt-2">
                                <Mail className="w-3 h-3 md:w-4 md:h-4" /> Contact Support
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} BIDZILLA ESPORTS. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link onClick={() => window.scrollTo(0, 0)} to="/privacy-policy" className={getBottomLinkClass('/privacy-policy')}>Privacy Policy</Link>
                        <Link onClick={() => window.scrollTo(0, 0)} to="/terms" className={getBottomLinkClass('/terms')}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
