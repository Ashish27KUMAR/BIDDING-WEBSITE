import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gavel, Users, Zap, BarChart3, Globe, Shield, Trophy, Target } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex items-center justify-center p-4 border-b border-cyan-500/20">
                {/* Dynamic Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute top-0 w-full h-full bg-gradient-to-b from-gaming-900 via-transparent to-gaming-900"></div>
                </div>

                <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
                    {/* Left: Content */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                <Zap size={16} /> Beta Season 2026
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter mb-4 drop-shadow-lg">
                                COMMAND <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                    THE ARENA
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-400 font-light mb-10 max-w-2xl">
                                The ultimate real-time sports auction platform. Build your dream roster with precision, strategy, and zero latency.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-4 md:px-8 bg-cyan-500 hover:bg-cyan-400 text-gaming-900 font-black tracking-widest uppercase rounded-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <Shield size={20} /> Host Auction
                                </button>
                                <button
                                    onClick={() => navigate('/join-room')}
                                    className="px-6 py-4 md:px-8 bg-gaming-800 border border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-white font-black tracking-widest uppercase rounded-lg transition-all shadow-[0_0_15px_rgba(176,38,255,0.2)] flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <Target size={20} /> Join Live
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Visual Element */}
                    <div className="flex-1 hidden md:flex justify-center relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Decorative glowing rings */}
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>

                            <div className="relative z-10 p-4 border border-white/10 rounded-2xl bg-gaming-800/80 backdrop-blur-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Gaming setup"
                                    className="rounded-xl w-full h-[400px] object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-500"
                                />

                                {/* Overlay UI Card */}
                                <div className="absolute -bottom-6 -left-6 bg-gaming-900 border border-cyan-500/50 p-4 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.2)] flex items-center gap-4">
                                    <div className="bg-cyan-500/20 p-3 rounded-lg">
                                        <Gavel className="text-cyan-400 animate-bounce" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-cyan-400 font-bold tracking-widest uppercase">Live Bid</div>
                                        <div className="text-xl font-black italic">₹ 14.50 Cr</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES SECTION --- */}
            <section className="py-24 bg-gaming-800 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4 drop-shadow-lg uppercase">
                            Pro-Level <span className="text-cyan-400">Features</span>
                        </h2>
                        <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full shadow-[0_0_10px_rgba(176,38,255,0.8)]"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gaming-900 border border-white/5 hover:border-cyan-500/50 p-8 rounded-2xl transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] -z-0"></div>
                            <Globe className="w-12 h-12 text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black italic uppercase mb-3 text-white">Global Sync</h3>
                            <p className="text-gray-400 leading-relaxed font-light">
                                Zero-latency WebSocket connections ensure every bid, hammer drop, and team update is instantly synced across all connected clients worldwide.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gaming-900 border border-white/5 hover:border-purple-500/50 p-8 rounded-2xl transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] -z-0"></div>
                            <Trophy className="w-12 h-12 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black italic uppercase mb-3 text-white">Dynamic Budgets</h3>
                            <p className="text-gray-400 leading-relaxed font-light">
                                Configure precise team purses, manage mid-auction budget recalculations, and track exactly how much buying power remains per squad.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gaming-900 border border-white/5 hover:border-cyan-500/50 p-8 rounded-2xl transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] -z-0"></div>
                            <Users className="w-12 h-12 text-cyan-400 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-black italic uppercase mb-3 text-white">Roster Management</h3>
                            <p className="text-gray-400 leading-relaxed font-light">
                                Easily import players via CSV, organize by categories, and monitor team compositions in real-time as the auction progresses.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- MEDIA SHOWCASE SECTION --- */}
            <section className="py-24 relative border-y border-white/10">
                <div className="absolute inset-0 bg-gaming-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gaming-800 to-gaming-900 -z-10"></div>

                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 order-2 md:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Setup 1" className="rounded-lg object-cover h-48 w-full border border-white/10 hover:border-cyan-500/50 transition-colors" />
                            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Setup 2" className="rounded-lg object-cover h-48 w-full border border-white/10 hover:border-purple-500/50 transition-colors sm:translate-y-8" />
                        </div>

                        <div className="flex-1 order-1 md:order-2 w-full text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white mb-6 uppercase">
                                Designed for <br />
                                <span className="text-cyan-400">High Stakes</span>
                            </h2>
                            <p className="text-gray-400 text-base md:text-lg mb-8 font-light leading-relaxed">
                                Whether you're running a professional esports draft, a fantasy league mega-auction, or a local sports club bidding war, Bidzilla provides the stable, visually stunning environment you need to execute flawlessly.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Encrypted Admin Controls",
                                    "Google Sheets Auto-Sync (Beta)",
                                    "Customizable Team Interfaces",
                                    "Responsive Mobile Spectating"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300 font-bold uppercase tracking-wider text-sm">
                                        <Target size={18} className="text-purple-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-24 bg-gaming-900 relative text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-cyan-500/5 blur-[100px] -z-10"></div>

                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-8 uppercase drop-shadow-md">
                    Ready to drop the hammer?
                </h2>

                <button
                    onClick={() => navigate('/login')}
                    className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black tracking-widest text-lg uppercase rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(176,38,255,0.6)] hover:-translate-y-1 inline-flex items-center gap-3"
                >
                    <Gavel size={24} /> Initialize Server
                </button>
            </section>
        </div>
    );
};

export default Home;
