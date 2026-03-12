import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase/config';
import { deleteUser } from 'firebase/auth';
import { toast } from 'react-toastify';
import { User, Mail, ShieldAlert, KeyRound, AlertTriangle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const AdminSettings = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isSendingCode, setIsSendingCode] = useState(false);

    // EmailJS Credentials from .env
    const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const handleRequestDeletion = async () => {
        if (!user || !user.email) {
            toast.error("No email associated with this account.");
            return;
        }

        setIsSendingCode(true);

        // Generate 6-digit random code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);

        // Generates the time for the email content (e.g., "04:30 PM")
        const timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 15);
        const timeString = timeLimit.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Parameters sent to EmailJS Template
        const templateParams = {
            email: user.email,         // Matches {{email}} in "To Email"
            passcode: code,            // Matches {{passcode}} in content
            time: timeString,          // Matches {{time}} in content
        };

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            setIsSendingCode(false);
            setShowDeleteModal(true);
            toast.info(`Verification code sent to ${user.email}.`, { autoClose: 6000 });
        } catch (error) {
            console.error('EmailJS Error:', error);
            setIsSendingCode(false);

            // Fallback for testing until keys are added:
            if (!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
                toast.warning(`EmailJS not configured. Using fallback code: ${code}`);
                setShowDeleteModal(true);
            } else {
                toast.error('Failed to send verification email. Please try again.');
            }
        }
    };

    const confirmDeletion = async () => {
        if (verificationCode !== generatedCode) {
            toast.error('Invalid Verification Code!');
            return;
        }

        try {
            if (user) {
                // Warning: In a real app, you also need to re-authenticate the user 
                // if their login session is old before deleting.
                await deleteUser(user);
                setShowDeleteModal(false);
                toast.success('Identity permanently erased. Terminal disconnected.');
                navigate('/home');
            }
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                toast.error('Security Protocol: Please logout and login again before deleting your account.');
            } else {
                toast.error('Failed to delete account.');
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-hidden h-[calc(100vh-5rem)]">
            {/* Dynamic Tech Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#0a0a12]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-purple-500/5 via-gaming-900/50 to-gaming-900"></div>
            </div>

            <div className="container mx-auto p-4 py-12 relative z-10 w-full max-w-4xl">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-10 text-center"
                >
                    <h2 className="text-4xl font-black italic uppercase tracking-widest text-white neon-text-purple mb-2">
                        Admin Identity
                    </h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                        Manage your clearance level and terminal access
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Col: Profile Details */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-purple-500/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] pointer-events-none transition-colors duration-500"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-xl bg-gaming-900 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(176,38,255,0.2)]">
                                <User className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase text-white tracking-widest">{user?.displayName || 'Unknown Commander'}</h3>
                                <div className="text-green-400 text-xs font-bold uppercase flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Clearance: Level 5
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-gaming-900/50 rounded-lg p-4 border border-white/5">
                                <label className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                                    <Mail size={12} /> Registered Email
                                </label>
                                <div className="text-sm text-gray-300 font-mono">{user?.email || 'N/A'}</div>
                            </div>

                            <div className="bg-gaming-900/50 rounded-lg p-4 border border-white/5">
                                <label className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                                    <ShieldAlert size={12} /> Account Status
                                </label>
                                <div className="text-sm text-cyan-400 font-bold uppercase tracking-widest">Active & Authenticated</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Col: Danger Zone */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gaming-800/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 shadow-[0_8px_30px_rgba(255,0,0,0.1)] relative overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-bl-full pointer-events-none"></div>

                        <div className="flex items-center gap-3 mb-6 border-b border-red-500/20 pb-4">
                            <AlertTriangle className="text-red-500 w-6 h-6" />
                            <h3 className="text-xl font-black uppercase tracking-wider text-red-500">Danger Zone</h3>
                        </div>

                        <div className="text-sm text-gray-400 mb-8 leading-relaxed font-bold">
                            Once you delete your account, there is no going back. All your connected arenas, logs, and command center privileges will be permanently erased from the server.
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={handleRequestDeletion}
                                disabled={isSendingCode}
                                className="w-full bg-red-600/20 hover:bg-red-600 border border-red-500 text-red-500 hover:text-white font-black italic uppercase tracking-widest py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSendingCode ? 'Authenticating...' : 'Terminate Identity'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Deletion Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gaming-900 border border-red-500/50 rounded-2xl shadow-[0_0_100px_rgba(255,0,0,0.2)] w-full max-w-md p-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900"></div>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <KeyRound className="text-red-500 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-2">Verify Termination</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                    Enter the 6-digit code sent to your email to confirm destruction.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="0 0 0 - 0 0 0"
                                        maxLength={6}
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-gaming-800 border-2 border-red-500/30 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-red-500 placeholder:text-gray-600 font-mono transition-colors"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold uppercase tracking-widest text-xs transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDeletion}
                                        disabled={verificationCode.length !== 6}
                                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black italic uppercase tracking-widest py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSettings;
