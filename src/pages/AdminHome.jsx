import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, PlusSquare, History, User } from 'lucide-react';

const AdminHome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#0a0a12]"></div>
                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-gaming-900 via-transparent to-gaming-900"></div>

                {/* Glowing Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto p-4 py-12 relative z-10 w-full max-w-6xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 border-b border-cyan-500/30 pb-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-6"
                >
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <Activity size={12} className="animate-pulse" /> System Active
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-widest text-white neon-text-blue mb-2">
                            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Center</span>
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                            Select your operational vector
                        </p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Create Event Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        onClick={() => navigate('/admin-dashboard')}
                        className="group bg-gaming-800/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 rounded-2xl p-8 cursor-pointer hover:bg-cyan-500/5 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,240,255,0.2)] flex flex-col items-center justify-center text-center gap-6 h-72 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                            <PlusSquare size={36} className="text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-3 group-hover:text-cyan-400 transition-colors">Initialize Arena</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Create a new auction event, configure teams, and upload your player roster.</p>
                        </div>
                    </motion.div>

                    {/* History Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        onClick={() => navigate('/admin-history')}
                        className="group bg-gaming-800/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 rounded-2xl p-8 cursor-pointer hover:bg-purple-500/5 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(176,38,255,0.2)] flex flex-col items-center justify-center text-center gap-6 h-72 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-[0_0_15px_rgba(176,38,255,0.3)]">
                            <History size={36} className="text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-3 group-hover:text-purple-400 transition-colors">History</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">Review past auctions, check statuses, and retrieve registration invites.</p>
                        </div>
                    </motion.div>

                    {/* Settings / Profile Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        onClick={() => navigate('/admin-settings')}
                        className="group bg-gaming-800/80 backdrop-blur-xl border border-white/10 hover:border-green-500/50 rounded-2xl p-8 cursor-pointer hover:bg-green-500/5 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] flex flex-col items-center justify-center text-center gap-6 h-72 md:col-span-2 lg:col-span-1 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/20 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <User size={36} className="text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-3 group-hover:text-green-400 transition-colors">Profile</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">View system profile, edit organization details, or execute security protocols.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
