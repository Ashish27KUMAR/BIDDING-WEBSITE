import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Background matching HowItWorks */}
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
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Lock size={16} /> Data Security
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-widest text-white drop-shadow-lg mb-6">
                        Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Policy</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Last Updated: October 2026. Your data security is our top priority in the arena.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden"
                    >
                        {/* Decorative glow */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 space-y-8 text-gray-300 text-sm md:text-base leading-relaxed font-light">
                            <section>
                                <h2 className="text-xl font-black italic uppercase text-white mb-4 flex items-center gap-3">
                                    <Shield className="text-cyan-400 w-5 h-5" /> 1. Information We Collect
                                </h2>
                                <p className="mb-4">
                                    When you utilize Bidzilla for hosting or participating in auction events, we collect specific types of information to ensure seamless operation:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                                    <li><strong className="text-gray-200">Account Data:</strong> Email addresses and authentication tokens provided via Firebase Authentication for admin access.</li>
                                    <li><strong className="text-gray-200">Event Data:</strong> Rosters, team names, budgets, and bidding histories generated during active events.</li>
                                    <li><strong className="text-gray-200">Technical Logs:</strong> IP addresses, browser types, and real-time WebSocket connection statuses to maintain synchronized states.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-black italic uppercase text-white mb-4 flex items-center gap-3">
                                    <Shield className="text-cyan-400 w-5 h-5" /> 2. How We Use Your Data
                                </h2>
                                <p className="mb-4">
                                    We do not sell your personal data. The information collected is strictly utilized to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                                    <li>Facilitate real-time socket connections for live bidding.</li>
                                    <li>Maintain persistent session states for event administrators.</li>
                                    <li>Export final auction results to authorized Google Spreadsheets (upon admin approval).</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-black italic uppercase text-white mb-4 flex items-center gap-3">
                                    <Shield className="text-cyan-400 w-5 h-5" /> 3. Data Storage and Security
                                </h2>
                                <p>
                                    All real-time bidding data is processed through highly secure, encrypted Firebase databanks. Passwords are never stored in plain text. Event databases are segregated, ensuring that malicious actors cannot query data from unrelated auction environments.
                                </p>
                            </section>

                            <section className="pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 tracking-widest font-bold text-center">
                                    <span className=' uppercase'>For data deletion requests or inquiries, contact </span> <a href="mailto:[support.bidzilla@gmail.com]" className="text-cyan-400 hover:text-white transition-colors">support.bidzilla@gmail.com</a>.
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
