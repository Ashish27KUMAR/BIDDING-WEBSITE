import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users2, Shield, Activity } from 'lucide-react';

const About = () => {
    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-screen bg-fixed"></div>
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-gaming-900 via-gaming-900/80 to-gaming-900"></div>
            </div>

            <div className="container mx-auto p-4 py-20 relative z-10">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                            <Activity size={16} /> Origin Story
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-widest text-white drop-shadow-lg mb-6">
                            Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Bidzilla</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm md:text-base">
                            Forging the ultimate bridge between rigorous administration and stadium-level excitement.
                        </p>
                    </div>

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:border-cyan-500/30 transition-colors"
                    >
                        {/* Background Graphic */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/30 transition-colors duration-700"></div>
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                        <div className="relative z-10 space-y-8 text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg">
                            <p className="font-light">
                                <strong className="text-cyan-400 uppercase tracking-widest font-black">Bidzilla</strong> was conceptualized to solve a critical bottleneck in local and global sports organizations: the chaotic nature of draft days and team auctions.
                            </p>

                            <p className="font-light">
                                Whether you're organizing a local neighborhood league, an intense esports tournament, or a massive corporate sports day, the process of evaluating players, managing budgets, and recording transactions is usually fraught with errors and delays. We built a real-time, zero-latency engine using cutting-edge web technology to eliminate these issues entirely.
                            </p>

                            <div className="grid md:grid-cols-3 gap-8 pt-12 mt-12 border-t border-white/10 relative">
                                <motion.div whileHover={{ y: -5 }} className="flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                                        <Target className="text-cyan-400 w-6 h-6" />
                                    </div>
                                    <h4 className="text-white font-black italic uppercase tracking-widest text-lg">Mission</h4>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">Provide an unparalleled, fair, and transparent draft environment for all competitive formats globally.</p>
                                </motion.div>

                                <motion.div whileHover={{ y: -5 }} className="flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                                        <Users2 className="text-purple-400 w-6 h-6" />
                                    </div>
                                    <h4 className="text-white font-black italic uppercase tracking-widest text-lg">Community</h4>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">Built for meticulous organizers, loved by passionate players. Fostering a professional experience at every tier.</p>
                                </motion.div>

                                <motion.div whileHover={{ y: -5 }} className="flex flex-col gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                        <Shield className="text-green-400 w-6 h-6" />
                                    </div>
                                    <h4 className="text-white font-black italic uppercase tracking-widest text-lg">Integrity</h4>
                                    <p className="text-sm text-gray-400 font-light leading-relaxed">Ensuring every transaction, budget calculation, and roster assignment is immutable and instantly verifiable.</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
