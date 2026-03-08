import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Users, Activity, ExternalLink, Download, X } from 'lucide-react';
import { listenToAuction, listenToTeams, listenToPlayers } from '../utils/auctionLogic';

const AdminEventResult = () => {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [auction, setAuction] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeamPopup, setSelectedTeamPopup] = useState(null);

    useEffect(() => {
        let unsubAuction, unsubTeams, unsubPlayers;

        const fetchData = async () => {
            unsubAuction = listenToAuction(roomCode, (data) => {
                if (data) setAuction(data);
            });

            unsubTeams = listenToTeams(roomCode, (data) => {
                setTeams(data);
            });

            unsubPlayers = listenToPlayers(roomCode, (data) => {
                setPlayers(data);
                setLoading(false);
            });
        };

        fetchData();

        return () => {
            if (unsubAuction) unsubAuction();
            if (unsubTeams) unsubTeams();
            if (unsubPlayers) unsubPlayers();
        };
    }, [roomCode]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-gaming-900 text-purple-400">
                <Activity className="w-16 h-16 animate-spin mb-4" />
                <span className="font-bold uppercase tracking-widest text-lg">Parsing Results Databanks...</span>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-gaming-900 text-red-500">
                <span className="font-bold uppercase tracking-widest text-lg">Arena Not Found.</span>
                <button
                    onClick={() => navigate('/admin-history')}
                    className="mt-6 border border-white/20 text-white px-6 py-2 rounded uppercase font-bold text-xs"
                >
                    Return to History
                </button>
            </div>
        );
    }

    // Helper to format currency
    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
        return `₹${(amount / 100000).toLocaleString()}L`;
    };

    const downloadCSV = () => {
        // First Header Row: Teams -> [BLANK] [Team1] [BLANK] [BLANK] [Team2] [BLANK] ...
        const headerRow1 = ["Teams"];
        teams.forEach(t => {
            headerRow1.push("");
            headerRow1.push(t.name);
            headerRow1.push("");
        });

        // Second Header Row: Sr. No -> [Player] [Base] [Sold] [Player] [Base] [Sold] ...
        const headerRow2 = ["Serial No."];
        teams.forEach(() => {
            headerRow2.push("Player's name");
            headerRow2.push("Base Price");
            headerRow2.push("Sold Price");
        });

        const rows = [headerRow1, headerRow2];

        // Find the maximum number of players bought by any team to determine rows needed
        let maxPlayers = 0;
        const teamPlayerLists = teams.map(team => {
            const bought = players.filter(p => p.soldTo === team.id && p.status === 'sold');
            if (bought.length > maxPlayers) maxPlayers = bought.length;
            return bought;
        });

        for (let i = 0; i < maxPlayers; i++) {
            const row = [i + 1]; // Sr. No

            teamPlayerLists.forEach(playerList => {
                if (playerList[i]) {
                    row.push(playerList[i].name);
                    row.push(playerList[i].basePrice);
                    row.push(playerList[i].soldPrice);
                } else {
                    row.push("");
                    row.push("");
                    row.push("");
                }
            });
            rows.push(row);
        }

        // Convert rows to CSV string robustly handling commas
        const csvContent = "data:text/csv;charset=utf-8," + rows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        ).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${auction.name}_Results.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden min-h-screen pb-20">
            {/* Dynamic Tech Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#0a0a12]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/5 via-gaming-900/50 to-gaming-900"></div>
            </div>

            <div className="container mx-auto p-4 py-8 relative z-10 w-full max-w-6xl">
                {/* HEADERS */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8 border-b border-cyan-500/30 pb-6"
                >
                    {/* <button
                        onClick={() => navigate('/admin-history')}
                        className="text-gray-400 hover:text-cyan-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-6 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to History
                    </button> */}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h2 className="text-4xl font-black italic uppercase tracking-widest text-white neon-text-blue mb-1 flex items-center gap-4">
                                <Trophy className="text-cyan-400" size={36} />
                                {auction.name} Results
                            </h2>
                            <div className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-2 bg-cyan-500/10 inline-block px-3 py-1 rounded border border-cyan-500/30">
                                Room Code: {roomCode}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={downloadCSV}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-bold uppercase tracking-widest flex items-center gap-2 text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                            >
                                <Download size={14} /> Download CSV
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* TEAM RESULTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teams.map((team, index) => {
                        // Find players sold to this team
                        const teamPlayers = players.filter(p => p.soldTo === team.id && p.status === 'sold');
                        const totalSpent = team.fixedBudget - team.remainingBudget;

                        return (
                            <motion.div
                                key={team.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => setSelectedTeamPopup(team)}
                                className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/50 hover:bg-gaming-800 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500"></div>

                                {/* Team Header */}
                                <div className="flex flex-col mb-4 pb-4 border-b border-white/10 relative z-10">
                                    <h3 className="text-xl font-black uppercase text-white tracking-widest truncate" title={team.name}>{team.name}</h3>
                                </div>

                                {/* Financials Summary */}
                                <div className="grid grid-cols-2 gap-2 relative z-10 mb-4">
                                    <div className="bg-gaming-900/50 p-2 rounded border border-white/5">
                                        <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Spent</div>
                                        <div className="text-sm font-black text-red-400">{formatCurrency(totalSpent)}</div>
                                    </div>
                                    <div className="bg-gaming-900/50 p-2 rounded border border-white/5">
                                        <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Budget</div>
                                        <div className="text-sm font-black text-green-400">{formatCurrency(team.remainingBudget)}</div>
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="mt-auto flex justify-between items-center relative z-10">
                                    <span className="text-xs text-cyan-400 uppercase font-bold tracking-widest group-hover:underline">View Roster</span>
                                    <div className="bg-gaming-900 border border-cyan-500/30 px-2 py-1 rounded-lg flex items-center gap-2">
                                        <Users size={12} className="text-cyan-400" />
                                        <span className="font-bold text-cyan-400 text-xs">{teamPlayers.length}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {teams.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-500 uppercase font-bold tracking-widest bg-gaming-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
                        No franchises were registered for this arena.
                    </div>
                )}
            </div>

            {/* TEAM PLAYERS POPUP MODAL */}
            <AnimatePresence>
                {selectedTeamPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-gaming-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.1)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-start sm:items-center gap-4 bg-gaming-800 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] pointer-events-none"></div>
                                <div className="relative z-10 flex-1">
                                    <h2 className="text-xl sm:text-3xl font-black italic uppercase tracking-widest text-white leading-tight">{selectedTeamPopup.name}</h2>
                                    <p className="text-[10px] sm:text-xs text-cyan-400 uppercase font-bold tracking-widest mt-1">Acquired Roster Details</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTeamPopup(null)}
                                    className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg sm:rounded-full hover:bg-white/5 bg-gaming-900 border border-white/10 relative z-10 flex-shrink-0"
                                >
                                    <X size={20} className="sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-gaming-900 custom-scrollbar">
                                {(() => {
                                    const teamPlayers = players.filter(p => p.soldTo === selectedTeamPopup.id && p.status === 'sold');
                                    if (teamPlayers.length === 0) {
                                        return <div className="text-center py-12 text-gray-500 uppercase font-bold tracking-widest">No players acquired by this team.</div>;
                                    }

                                    return (
                                        <div className="space-y-3">
                                            {teamPlayers.map(p => (
                                                <div key={p.id} className="bg-gaming-800 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/30 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover border border-white/10 bg-gaming-900" />
                                                        <div>
                                                            <div className="text-lg font-black uppercase text-white tracking-widest">{p.name}</div>
                                                            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">{p.role}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6 bg-gaming-900/50 p-3 rounded-lg border border-white/5 md:w-auto w-full justify-between md:justify-end">
                                                        <div className="text-center">
                                                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Base Price</div>
                                                            <div className="text-sm font-mono text-gray-300">{formatCurrency(p.basePrice)}</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Sold Price</div>
                                                            <div className="text-lg font-black font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded shadow-[0_0_10px_rgba(0,240,255,0.1)]">{formatCurrency(p.soldPrice)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminEventResult;
