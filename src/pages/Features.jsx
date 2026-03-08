import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Cpu, Globe, Crosshair } from 'lucide-react';

const Features = () => {
    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-screen bg-fixed"></div>
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-gaming-900 via-gaming-900/80 to-gaming-900"></div>

                {/* Glowing Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto p-4 py-20 relative z-10">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Crosshair size={16} /> Nexus Core
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-widest text-white drop-shadow-lg mb-6">
                        System <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Capabilities</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Powering the next generation of competitive drafting and real-time auctioning with military-grade precision.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Feature 1 */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 p-8 rounded-2xl transition-all group overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] pointer-events-none"></div>
                        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                            <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-3">Lightning Engine</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                            Our real-time Firebase databanks ensure bids are processed with zero latency, keeping all participants perfectly synced.
                        </p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 p-8 rounded-2xl transition-all group overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(176,38,255,0.2)]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] pointer-events-none"></div>
                        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(176,38,255,0.2)]">
                            <ShieldCheck className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-3">Secure Operations</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                            Authenticated administrative controls and robust event isolation mean your roster data and team budgets are completely secure.
                        </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 hover:border-green-500/50 p-8 rounded-2xl transition-all group overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[100px] pointer-events-none"></div>
                        <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            <Cpu className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-3">Smart Import</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-light">
                            Drag and drop your JSON or CSV rosters. Our dynamic parser intelligently maps player stats, roles, and properties automatically.
                        </p>
                    </motion.div>

                    {/* Feature 4 */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 hover:border-pink-500/50 p-8 rounded-2xl transition-all group overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/5 rounded-br-[200px] pointer-events-none"></div>
                        <div className="w-20 h-20 shrink-0 bg-pink-500/10 border border-pink-500/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                            <Globe className="w-10 h-10 text-pink-400 animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-3">Omni-Channel Syncing</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light max-w-3xl">
                                Instantly broadcast active bids, sold players, and remaining franchise budgets to all spectating devices. Optionally bind your event to a Google Spreadsheet to auto-log every transaction without lifting a finger. Your audience scales infinitely.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Features;
