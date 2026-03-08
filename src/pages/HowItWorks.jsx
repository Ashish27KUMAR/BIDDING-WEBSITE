import React from 'react';
import { motion } from 'framer-motion';
import { Network, Search, Award, Play } from 'lucide-react';

const HowItWorks = () => {
    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-screen bg-fixed"></div>
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-gaming-900 via-gaming-900/90 to-gaming-900"></div>

                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="container mx-auto p-4 py-20 relative z-10 w-full">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Play size={16} fill="currentColor" /> Quick Start
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-widest text-white drop-shadow-lg mb-6">
                        Deploying <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Arenas</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Three steps to orchestrate your ultimate draft event. Built for organizers, perfected for the main stage.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:-ml-[1px] before:w-[2px] before:bg-gradient-to-b before:from-cyan-500/50 before:via-purple-500/50 before:to-green-500/50">

                    {/* Step 1 */}
                    <div className="relative flex items-center md:justify-end md:even:justify-start group mb-16">
                        <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 rounded-full bg-cyan-400 border-4 border-gaming-900 z-10 box-content shadow-[0_0_20px_rgba(0,240,255,0.6)] group-hover:scale-125 transition-transform"></div>

                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="ml-20 md:ml-0 md:w-[45%] p-8 bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all shadow-xl group-hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] md:mr-12"
                        >
                            <div className="flex items-center gap-4 mb-4 text-cyan-400">
                                <div className="p-3 bg-cyan-500/10 rounded-lg">
                                    <Network size={28} />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-widest text-white">1. Configure</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                Log in as a <span className="text-cyan-400 font-bold">System Administrator</span>. Navigate to the Command Center to set tournament rules, allocate franchise budgets, and define the number of participating teams. This establishes the structural parameters of your event.
                            </p>
                        </motion.div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex items-center justify-start md:even:justify-start group mb-16">
                        <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 rounded-full bg-purple-400 border-4 border-gaming-900 z-10 box-content shadow-[0_0_20px_rgba(176,38,255,0.6)] group-hover:scale-125 transition-transform"></div>

                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="ml-20 md:ml-auto md:w-[45%] p-8 bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-500/50 transition-all shadow-xl group-hover:shadow-[0_0_30px_rgba(176,38,255,0.15)] md:ml-12"
                        >
                            <div className="flex items-center gap-4 mb-4 text-purple-400">
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <Search size={28} />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-widest text-white">2. Upload</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                Drag and drop your spreadsheet or JSON files containing the athletes' data directly into our <span className="text-purple-400 font-bold">Smart Parser</span>. It instantly digests roles, images, and prices dynamically, skipping tedious manual entry.
                            </p>
                        </motion.div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex items-center md:justify-end md:even:justify-start group">
                        <div className="absolute left-8 md:left-1/2 -ml-3 w-6 h-6 rounded-full bg-green-400 border-4 border-gaming-900 z-10 box-content shadow-[0_0_20px_rgba(34,197,94,0.6)] group-hover:scale-125 transition-transform"></div>

                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="ml-20 md:ml-0 md:w-[45%] p-8 bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-green-500/50 transition-all shadow-xl group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] md:mr-12"
                        >
                            <div className="flex items-center gap-4 mb-4 text-green-400">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <Award size={28} />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-widest text-white">3. Execute</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                Generate the invite link, let franchise captains join, and proceed to auction players in <span className="text-green-400 font-bold">real-time</span>. Watch as budgets decline, rosters fill, and data syncs instantly to your custom Google Sheet!
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
