import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { History, Copy, ExternalLink, Activity, Trash2, CheckSquare, Square, MoreVertical } from 'lucide-react';
import { listenToAdminAuctions, listenToTeams, deleteAuctionEvent } from '../utils/auctionLogic';
import { auth } from '../firebase/config';

const HistoryCard = ({ auction, index, isSelected, onSelect, onDelete, isSelectMode }) => {
    const navigate = useNavigate();
    const [registeredTeams, setRegisteredTeams] = useState(0);

    useEffect(() => {
        if (auction.status === 'setup' || auction.status === 'active') {
            const unsub = listenToTeams(auction.roomCode, (teams) => {
                setRegisteredTeams(teams.length);
            });
            return () => unsub();
        }
    }, [auction.roomCode, auction.status]);

    const isSlotsFull = registeredTeams >= (auction.maxTeams || 0);

    return (
        <motion.div
            key={auction.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => isSelectMode && onSelect(auction.id)}
            className={`bg-gaming-800/80 backdrop-blur-xl border ${isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10'} p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 hover:border-purple-500/50 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden ${isSelectMode ? 'cursor-pointer hover:bg-gaming-800' : ''}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500"></div>

            <div className="flex items-center gap-4 md:w-auto relative z-10 w-full mb-3 md:mb-0 md:mr-4">
                {isSelectMode && (
                    <button
                        onClick={() => onSelect(auction.id)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors hidden md:block" // Hidden on small screens, integrated below
                    >
                        {isSelected ? <CheckSquare size={24} className="text-cyan-400" /> : <Square size={24} />}
                    </button>
                )}
                <div className="flex-1 max-w-full">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {isSelectMode && (
                            <button
                                onClick={() => onSelect(auction.id)}
                                className="text-gray-400 hover:text-cyan-400 transition-colors md:hidden"
                            >
                                {isSelected ? <CheckSquare size={20} className="text-cyan-400" /> : <Square size={20} />}
                            </button>
                        )}
                        <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-widest">{auction.name}</h3>
                        <span className={`text-[10px] px-3 py-1 rounded uppercase font-bold tracking-widest border ${auction.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : auction.status === 'setup' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-red-500/20 text-red-500 border-red-500/50'}`}>
                            {auction.status === 'setup' ? <span className="italic">In Progress</span> : auction.status}
                        </span>
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-3 normal-case font-mono bg-gaming-900 border border-white/5 px-3 md:px-4 py-2 rounded-lg inline-flex flex-wrap">
                        <span className="text-purple-400">ID: {auction.roomCode}</span>
                        <span className="text-white/20 hidden md:inline">|</span>
                        <span>{new Date(auction.createdAt?.toDate()).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto relative z-10">
                {(auction.status === 'setup' || auction.status === 'active') && (
                    <button
                        disabled={isSlotsFull}
                        onClick={() => {
                            if (isSlotsFull) return;
                            const url = `${window.location.origin}/team-setup/${auction.roomCode}`;
                            navigator.clipboard.writeText(url);
                            toast.success('Registration Link Copied!');
                        }}
                        className={`flex-1 md:flex-none justify-center px-5 py-3 rounded-lg font-bold uppercase tracking-widest flex items-center gap-2 text-xs transition-all ${isSlotsFull
                            ? 'bg-gaming-900 border border-gray-600 text-gray-500 cursor-not-allowed'
                            : 'bg-gaming-900 border border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 shadow-[0_0_15px_rgba(176,38,255,0.1)] hover:shadow-[0_0_20px_rgba(176,38,255,0.3)]'
                            }`}
                    >
                        <Copy size={16} /> {isSlotsFull ? 'Slots Full' : 'Invite Link'}
                    </button>
                )}
                {auction.status === 'ended' ? (
                    <button
                        onClick={() => navigate(`/admin-result/${auction.roomCode}`)}
                        className="flex-1 md:flex-none justify-center bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-cyan-500/20 hover:border-cyan-400 transition-all flex items-center gap-2 text-xs shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                        View Results <ExternalLink size={16} />
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(`/auction/${auction.roomCode}`)}
                        className="flex-1 md:flex-none justify-center bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-cyan-500/20 hover:border-cyan-400 transition-all flex items-center gap-2 text-[10px] md:text-xs shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                    >
                        Resume Arena <ExternalLink size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const AdminHistory = () => {
    const navigate = useNavigate();
    const [pastAuctions, setPastAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!auth.currentUser) return;

        const unsub = listenToAdminAuctions(auth.currentUser.uid, (auctions) => {
            setPastAuctions(auctions);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectToggle = () => {
        setIsSelectMode(!isSelectMode);
        setShowMenu(false);
        if (isSelectMode) setSelectedIds([]); // Clear selection when exiting select mode
    };

    const handleSelectAll = () => {
        setIsSelectMode(true);
        setSelectedIds(pastAuctions.map(a => a.id));
        setShowMenu(false);
    };

    const handleDeleteSingle = async (roomCode) => {
        if (!window.confirm("Are you sure you want to permanently delete this event and all its data?")) return;
        try {
            await deleteAuctionEvent(roomCode);
            toast.success("Event deleted successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete event.");
        }
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} events permanently?`)) return;
        setIsDeleting(true);
        try {
            const selectedAuctions = pastAuctions.filter(a => selectedIds.includes(a.id));
            await Promise.all(selectedAuctions.map(a => deleteAuctionEvent(a.roomCode)));
            toast.success(`${selectedIds.length} events deleted successfully!`);
            setSelectedIds([]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete some events.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Tech Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#0a0a12]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(176,38,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(176,38,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-purple-500/5 via-gaming-900/50 to-gaming-900"></div>
            </div>

            <div className="container mx-auto p-4 py-8 relative z-10 w-full max-w-5xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 border-b border-purple-500/30 pb-6 flex items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-purple-500/20 rounded-2xl border border-purple-500/50 shadow-[0_0_20px_rgba(176,38,255,0.3)] shrink-0">
                            <History className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 sm:gap-4 flex-wrap mt-1 sm:mt-0">
                                <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-widest text-white neon-text-blue mb-0 sm:mb-1 leading-none">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">History</span>
                                </h2>
                            </div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm mt-1 sm:mt-1 leading-snug pr-2">
                                Review past and active operational arenas
                            </p>
                        </div>
                    </div>

                    {/* MENU REPLACING RETURN TO COMMAND CENTER LOCATION */}
                    {!loading && pastAuctions.length > 0 && (
                        <div className="flex items-center gap-3">
                            <AnimatePresence>
                                {isSelectMode && selectedIds.length > 0 && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, x: 10 }}
                                        onClick={handleDeleteSelected}
                                        disabled={isDeleting}
                                        className="bg-red-500/20 text-red-500 hover:bg-red-500/40 border border-red-500/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        {isDeleting ? 'Erasing...' : `Erase (${selectedIds.length})`}
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 text-gray-400 hover:text-white bg-gaming-800 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-all"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                <AnimatePresence>
                                    {showMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-gaming-900 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                                        >
                                            <button
                                                onClick={handleSelectToggle}
                                                className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5"
                                            >
                                                {isSelectMode ? "Cancel Select" : "Select"}
                                            </button>
                                            <button
                                                onClick={handleSelectAll}
                                                className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                                            >
                                                Select All
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Removed floating menu section below header */}

                <div className="space-y-6 max-w-5xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6 text-purple-400">
                            <Activity className="w-16 h-16 animate-spin" />
                            <span className="font-bold uppercase tracking-widest text-lg">Scanning Databanks...</span>
                        </div>
                    ) : pastAuctions.length === 0 ? (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-12 sm:py-20 text-gray-500 uppercase font-bold tracking-widest bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-4"
                        >
                            <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-xs sm:text-base leading-relaxed max-w-[200px] sm:max-w-none mx-auto">No previous events located in databanks.</p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {pastAuctions.map((auction, index) => (
                                <HistoryCard
                                    key={auction.id}
                                    auction={auction}
                                    index={index}
                                    isSelected={selectedIds.includes(auction.id)}
                                    isSelectMode={isSelectMode}
                                    onSelect={toggleSelection}
                                    onDelete={handleDeleteSingle}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHistory;
