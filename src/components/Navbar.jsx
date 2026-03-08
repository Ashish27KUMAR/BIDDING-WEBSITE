import React, { useState } from 'react';
import { Trophy, LogOut, Home, Zap, Info, ShieldQuestion, Menu, X } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

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
                        <Trophy className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-black italic tracking-widest text-white hidden sm:block drop-shadow-md cursor-default">
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
                            <a href="/admin-dashboard" className="flex items-center gap-2 text-sm font-bold uppercase text-purple-400 bg-gaming-900 px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/10 transition-colors">
                                Dashboard
                            </a>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-red-400 transition-colors bg-gaming-900 p-2 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10"
                                title="Disconnect"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <a href="/login" className="text-sm text-cyan-400 hover:text-white transition-colors uppercase font-bold tracking-wider border border-cyan-500/50 hover:bg-cyan-500/20 px-4 py-2 rounded-lg">
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

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gaming-900 border-t border-cyan-500/30">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                        <button
                            onClick={() => { navigate('/home'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/home' ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-white/5'}`}
                        >
                            <Home size={18} /> Home
                        </button>
                        <button
                            onClick={() => { navigate('/features'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/features' ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-white/5'}`}
                        >
                            <Zap size={18} /> Features
                        </button>
                        <button
                            onClick={() => { navigate('/how-it-works'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/how-it-works' ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-white/5'}`}
                        >
                            <ShieldQuestion size={18} /> How It Works
                        </button>
                        <button
                            onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/about' ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-white/5'}`}
                        >
                            <Info size={18} /> About
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
