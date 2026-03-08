import React from 'react';
import { Database, LogOut, Settings, BarChart2, LayoutDashboard, History, Trophy, User, Menu, X } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminNavbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Terminate Admin Session?");
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
                        <Trophy className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black italic tracking-widest text-white hidden sm:block drop-shadow-md leading-tight">
                            BIDZILLA<span className="text-purple-400">ADMIN</span>
                        </h1>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden sm:block">Dashboard</span>
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
                        className="text-gray-400 hover:text-red-400 transition-colors bg-gaming-900 p-2 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10"
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

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gaming-900 border-t border-purple-500/30">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                        <button
                            onClick={() => { navigate('/admin-home'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/admin-home' ? 'bg-purple-500/10 text-purple-400' : 'hover:bg-white/5'}`}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </button>
                        <button
                            onClick={() => { navigate('/admin-history'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/admin-history' ? 'bg-purple-500/10 text-purple-400' : 'hover:bg-white/5'}`}
                        >
                            <History size={18} /> History
                        </button>
                        <button
                            onClick={() => { navigate('/admin-settings'); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === '/admin-settings' ? 'bg-purple-500/10 text-purple-400' : 'hover:bg-white/5'}`}
                        >
                            <Settings size={18} /> Profile
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default AdminNavbar;
