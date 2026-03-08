import React, { useState } from 'react';
import { LogOut, Home, Zap, Info, ShieldQuestion, Menu, X, LayoutDashboard } from 'lucide-react';
import Favicon from '../assets/Favicon.png';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to disconnect from the Arena?");
        if (confirmLogout) {
            await signOut(auth);
            window.location.href = '/home';
        }
    };

    const getLinkClass = (path) => {
        return `transition-colors flex items-center gap-2 group ${location.pathname === path ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`;
    };

    const getIconClass = (path) => {
        return `${location.pathname === path ? 'text-cyan-400' : 'text-gray-500 group-hover:text-cyan-300'}`;
    };

    return (
        <header className="sticky top-0 z-50 bg-gaming-800/80 backdrop-blur-md border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(0,240,255,0.1)]">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                {/* Logo Section (Not clickable) */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gaming-900 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)] border border-cyan-500/30">
                        <img src={Favicon} alt="BidZilla Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black italic tracking-widest text-white hidden sm:block drop-shadow-md cursor-default">
                        BID<span className="text-cyan-400">ZILLA</span>
                    </h1>
                </div>

                {/* Main Navigation Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                    <button onClick={() => navigate('/home')} className={getLinkClass('/home')}>
                        <Home size={16} className={getIconClass('/home')} /> Home
                    </button>
                    <button onClick={() => navigate('/features')} className={getLinkClass('/features')}>
                        <Zap size={16} className={getIconClass('/features')} /> Features
                    </button>
                    <button onClick={() => navigate('/how-it-works')} className={getLinkClass('/how-it-works')}>
                        <ShieldQuestion size={16} className={getIconClass('/how-it-works')} /> How It Works
                    </button>
                    <button onClick={() => navigate('/about')} className={getLinkClass('/about')}>
                        <Info size={16} className={getIconClass('/about')} /> About
                    </button>
                </nav>

                {/* User/Auth Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <a href="/admin-dashboard" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase text-purple-400 bg-gaming-900 px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 transition-colors">
                                Dashboard
                            </a>
                            <button
                                onClick={handleLogout}
                                className="hidden md:block text-gray-400 hover:text-red-400 transition-colors bg-gaming-900 p-2 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10"
                                title="Disconnect"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <a href="/login" className="hidden md:flex text-sm text-cyan-400 hover:text-white transition-colors uppercase font-bold tracking-wider border border-cyan-500/50 hover:bg-cyan-500/20 px-4 py-2 rounded-lg">
                            Admin Login
                        </a>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-cyan-400 hover:text-white bg-gaming-900 border border-cyan-500/30 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-black/60 backdrop-blur-sm z-30"
                        />

                        {/* Side Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-20 right-0 w-64 h-auto max-h-[calc(100vh-6rem)] rounded-2xl bg-gaming-900/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,240,255,0.2)] z-40 flex flex-col overflow-y-auto"
                        >
                            <nav className="p-6 flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-gray-400 flex-1">
                                <button
                                    onClick={() => { navigate('/home'); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/home' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/5 hover:text-white transition-colors'}`}
                                >
                                    <Home size={18} /> Home
                                </button>
                                <button
                                    onClick={() => { navigate('/features'); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/features' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/5 hover:text-white transition-colors'}`}
                                >
                                    <Zap size={18} /> Features
                                </button>
                                <button
                                    onClick={() => { navigate('/how-it-works'); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/how-it-works' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/5 hover:text-white transition-colors'}`}
                                >
                                    <ShieldQuestion size={18} /> How It Works
                                </button>
                                <button
                                    onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/about' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/5 hover:text-white transition-colors'}`}
                                >
                                    <Info size={18} /> About
                                </button>

                                {/* Auth buttons for mobile */}
                                <div className="mt-auto pt-4 border-t border-cyan-500/30 flex flex-col gap-3">
                                    {user ? (
                                        <>
                                            <button
                                                onClick={() => { navigate('/admin-dashboard'); setIsMobileMenuOpen(false); }}
                                                className="w-full flex items-center justify-start gap-3 p-3 rounded-lg text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/50 transition-colors font-bold tracking-widest uppercase"
                                            >
                                                <LayoutDashboard size={18} /> Dashboard
                                            </button>
                                            <button
                                                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                                className="w-full flex items-center justify-start gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/50 transition-colors font-bold tracking-widest uppercase"
                                            >
                                                <LogOut size={18} /> Disconnect
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center justify-start gap-3 p-3 rounded-lg text-cyan-400 hover:text-white border border-transparent hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors font-bold tracking-widest uppercase"
                                        >
                                            <LogOut size={18} /> Admin Login
                                        </button>
                                    )}
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
