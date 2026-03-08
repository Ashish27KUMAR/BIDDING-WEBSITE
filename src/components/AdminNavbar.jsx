import React from 'react';
import { Database, LogOut, Settings, BarChart2, LayoutDashboard, History, User, Menu, X } from 'lucide-react';
import Favicon from '../assets/Favicon.png';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNavbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            await signOut(auth);
            window.location.href = '/home';
        }
    };

    const getLinkClass = (path) => {
        return `transition-colors flex items-center gap-2 group ${location.pathname === path ? 'text-purple-400' : 'text-gray-400 hover:text-purple-300'}`;
    };

    const getIconClass = (path) => {
        return `${location.pathname === path ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-300'}`;
    };

    return (
        <header className="sticky top-0 z-50 bg-gaming-800/90 backdrop-blur-md border-b border-purple-500/30 shadow-[0_4px_30px_rgba(176,38,255,0.1)]">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                {/* Logo Section */}
                <div
                    onClick={() => navigate('/admin-home')}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="p-2 bg-gaming-900 rounded-lg shadow-[0_0_15px_rgba(176,38,255,0.2)] border border-purple-500/30 group-hover:border-purple-500/80 transition-all">
                        <img src={Favicon} alt="BidZilla Logo" className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg sm:text-xl font-black italic tracking-widest text-white drop-shadow-md leading-tight">
                            BIDZILLA
                        </h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            <span className="text-purple-400 font-black">ADMIN</span> DASHBOARD
                        </p>
                    </div>
                </div>

                {/* Main Navigation Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                    <button onClick={() => navigate('/admin-home')} className={getLinkClass('/admin-home')}>
                        <LayoutDashboard size={16} className={getIconClass('/admin-home')} /> Dashboard
                    </button>
                    <button onClick={() => navigate('/admin-history')} className={getLinkClass('/admin-history')}>
                        <History size={16} className={getIconClass('/admin-history')} /> History
                    </button>
                    <button onClick={() => navigate('/admin-settings')} className={getLinkClass('/admin-settings')}>
                        <Settings size={16} className={getIconClass('/admin-settings')} /> Profile
                    </button>
                </nav>

                {/* User/Auth Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-green-400 bg-gaming-900 px-3 py-1.5 rounded-lg border border-green-500/30">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </div>

                    {/* <button
                        onClick={() => navigate('/admin-settings')}
                        className="text-gray-400 hover:text-cyan-400 transition-colors bg-gaming-900 p-2 rounded-lg border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10"
                        title="Profile Settings"
                    >
                        <User size={20} />
                    </button> */}

                    <button
                        onClick={handleLogout}
                        className="hidden md:block text-gray-400 hover:text-red-400 transition-colors bg-gaming-900 p-2 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10"
                        title="Disconnect"
                    >
                        <LogOut size={20} />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-purple-400 hover:text-white bg-gaming-900 border border-purple-500/30 rounded-lg"
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
                            className="md:hidden fixed top-20 right-0 w-64 h-auto max-h-[calc(100vh-6rem)] rounded-2xl bg-gaming-900/95 backdrop-blur-xl border border-purple-500/30 shadow-[0_10px_40px_rgba(176,38,255,0.2)] z-40 flex flex-col overflow-y-auto"
                        >
                            <nav className="p-6 flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-gray-400 flex-1">
                                <button
                                    onClick={() => { navigate('/admin-home'); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/admin-home' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'hover:bg-white/5 hover:text-white transition-colors'}`}
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </button>
                                <button
                                    onClick={() => { navigate('/admin-history'); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/admin-history' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'hover:bg-white/5 hover:text-white transition-colors'}`}
                                >
                                    <History size={18} /> History
                                </button>
                                <button
                                    onClick={() => { navigate('/admin-settings'); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/admin-settings' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'hover:bg-white/5 hover:text-white transition-colors'}`}
                                >
                                    <Settings size={18} /> Profile
                                </button>

                                {/* Logout button for mobile */}
                                <div className="mt-auto pt-4 border-t border-purple-500/30">
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="w-full flex items-center justify-start gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/50 transition-colors font-bold tracking-widest uppercase"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default AdminNavbar;
