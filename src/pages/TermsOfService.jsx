import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileText } from 'lucide-react';
import Footer from '../components/Footer';

const TermsOfService = () => {
    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Background matching HowItWorks */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-screen bg-fixed"></div>
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-gaming-900 via-gaming-900/90 to-gaming-900"></div>

                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(176,38,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(176,38,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="container mx-auto p-4 py-20 relative z-10 w-full">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(176,38,255,0.2)]">
                        <Scale size={16} /> Legal Agreement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-widest text-white drop-shadow-lg mb-6">
                        Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Service</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Last Updated: October 2026. Rules of engagement for deploying Bidzilla servers.
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
                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 space-y-8 text-gray-300 text-sm md:text-base leading-relaxed font-light">
                            <section>
                                <h2 className="text-xl font-black italic uppercase text-white mb-4 flex items-center gap-3">
                                    <FileText className="text-purple-400 w-5 h-5" /> 1. Acceptance of Terms
                                </h2>
                                <p>
                                    By accessing, registering for, or hosting events on the Bidzilla Esports platform, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you must disconnect from the platform immediately.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black italic uppercase text-white mb-4 flex items-center gap-3">
                                    <FileText className="text-purple-400 w-5 h-5" /> 2. Admin Responsibilities
                                </h2>
                                <p className="mb-4">
                                    Users who create admin accounts and deploy auction rooms are solely responsible for:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-400">
                                    <li>Maintaining the confidentiality of their portal credentials.</li>
                                    <li>The legality and accuracy of the rosters (CSV/JSON data) uploaded to the platform.</li>
                                    <li>Managing the behavior and bidding conduct of participants invited via their generated room links.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-black italic uppercase text-white mb-4 flex items-center gap-3">
                                    <FileText className="text-purple-400 w-5 h-5" /> 3. Service Availability & Fair Use
                                </h2>
                                <p>
                                    While Bidzilla employs high-availability server architecture, we do not guarantee 100% uptime. Bidding events may be subject to latency based on individual network conditions. You agree not to use automated scripts, bots, or malicious payloads to manipulate auction timers, budgets, or server states.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-black italic uppercase text-white mb-4 flex items-center gap-3">
                                    <FileText className="text-purple-400 w-5 h-5" /> 4. Liability Limitation
                                </h2>
                                <p>
                                    Bidzilla is provided "as is". In no event shall the platform operators be liable for any indirect, incidental, special, or consequential damages arising from disrupted drafts, lost data, or synchronization errors during an ongoing event.
                                </p>
                            </section>

                            <section className="pt-6 border-t border-white/10">
                                <p className="text-xs text-gray-500 tracking-widest font-bold text-center">
                                    <span className='uppercase'>For legal inquiries, contact</span> <a href="mailto:[support.bidzilla@gmail.com]" className="text-purple-400 hover:text-white transition-colors">support.bidzilla@gmail.com</a>.
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

export default TermsOfService;
