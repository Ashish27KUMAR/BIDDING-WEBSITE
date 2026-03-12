import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
    listenToAuction,
    listenToTeams,
    listenToPlayers,
    setCurrentPlayer,
    updateCurrentBid,
    sellPlayer,
    markPlayerUnsold
} from '../utils/auctionLogic';
import PlayerCard from '../components/PlayerCard';
import { Gavel, Clock, ArrowLeft, Users, X, ChevronDown, ChevronUp, ExternalLink, Volume2, VolumeX, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuctionRoom = () => {
    const { roomCode } = useParams();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [globalAmountUnit, setGlobalAmountUnit] = useState("Lakh");

    // Sound State
    const [isMuted, setIsMuted] = useState(false);

    // Animation & Modal States
    const [showHammer, setShowHammer] = useState(false);
    const [hammerText, setHammerText] = useState("");
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [expandedTeamId, setExpandedTeamId] = useState(null);
    const prevPlayerId = useRef(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setIsAdmin(!!user);
        });

        const unsubRoom = listenToAuction(roomCode, setRoomData);
        const unsubTeams = listenToTeams(roomCode, setTeams);
        const unsubPlayers = listenToPlayers(roomCode, setPlayers);

        return () => {
            unsubscribeAuth();
            unsubRoom();
            unsubTeams();
            unsubPlayers();
        };
    }, [roomCode]);

    const playersRef = useRef(players);
    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    // Track Player Status changes for the Hammer Drop and Auto-Summon
    useEffect(() => {
        if (!roomData) return;
        const currentId = roomData.currentPlayerId;

        // If a player WAS active, but is now null (meaning they got sold/unsold)
        if (prevPlayerId.current && !currentId) {
            const soldPlayer = playersRef.current.find(p => p.id === prevPlayerId.current);
            if (soldPlayer) {
                if (soldPlayer.status === 'sold') {
                    const t = teams.find(t => t.id === soldPlayer.soldTo);
                    triggerHammerDrop(`SOLD TO ${t?.name || 'UNKNOWN'}`);
                } else if (soldPlayer.status === 'unsold') {
                    triggerHammerDrop('UNSOLD');
                }

                // Auto-summon logic for ADMIN
                if (isAdmin && roomData.status !== "ended") {
                    setTimeout(async () => {
                        const latestPlayers = playersRef.current;
                        const pending = latestPlayers.filter(p => p.status === 'pending' || p.status === 'unsold');
                        if (pending.length > 0) {
                            await setCurrentPlayer(roomCode, pending[0].id);
                        }
                    }, 500); // Reduced delay for faster performance
                }
            }
        }

        prevPlayerId.current = currentId;
    }, [roomData?.currentPlayerId, teams, isAdmin, roomCode, roomData?.status]);

    const triggerHammerDrop = (text) => {
        setHammerText(text);
        setShowHammer(true);
        if (!isMuted) {
            try {
                const audio = new Audio('/hammer.mp3');
                audio.play().catch(e => console.log("Audio play prevented:", e));
            } catch (err) {
                console.error("Failed to play hammer sound", err);
            }
        }
        setTimeout(() => setShowHammer(false), 800); // Hide after animation (reduced from 1200 to fix lag)
    };

    if (!roomData) {
        return <div className="min-h-screen bg-gaming-900 flex items-center justify-center text-cyan-400 font-bold uppercase animate-pulse text-2xl tracking-widest text-center px-4">Connecting to Arena Server...<br /><span className="text-sm mt-2 text-gray-500 block">Or Room Does Not Exist</span></div>;
    }

    const currentPlayer = players.find(p => p.id === roomData.currentPlayerId);

    // Controls
    const handleNextPlayer = async () => {
        if (currentPlayer) {
            const currentIndex = players.findIndex(p => p.id === currentPlayer.id);
            if (currentIndex < players.length - 1) {
                await setCurrentPlayer(roomCode, players[currentIndex + 1].id);
                return;
            }
        }
        // Fallback for unsummoned state: find first pending/unsold
        const pending = players.filter(p => p.status === 'pending' || p.status === 'unsold');
        if (pending.length > 0) {
            await setCurrentPlayer(roomCode, pending[0].id);
        } else {
            alert("No more players available!");
        }
    };

    const handlePrevPlayer = async () => {
        if (!currentPlayer) return;
        const currentIndex = players.findIndex(p => p.id === currentPlayer.id);
        if (currentIndex > 0) {
            await setCurrentPlayer(roomCode, players[currentIndex - 1].id);
        } else {
            alert("This is the first player in the list.");
        }
    };

    const handleIncreaseBid = async (newBid) => {
        if (!isAdmin) return;
        await updateCurrentBid(roomCode, newBid);
    };

    const handleSell = async (teamId, customPrice = null) => {
        if (!isAdmin || !currentPlayer || !teamId) return;
        const price = customPrice ? customPrice : (roomData.currentBid > 0 ? roomData.currentBid : currentPlayer.basePrice);
        try {
            await sellPlayer(roomCode, currentPlayer.id, teamId, price, roomData.sheetUrl);
        } catch (e) {
            alert(e.message);
        }
    };

    const handleSkip = async () => {
        if (!isAdmin || !currentPlayer) return;
        await markPlayerUnsold(roomCode, currentPlayer.id);
    };

    const getRemainingCount = () => players.filter(p => p.status === 'pending').length;

    return (
        <div className="flex-1 flex flex-col h-full bg-gaming-900 border-t border-cyan-500/20 relative overflow-hidden">

            {/* BIG HAMMER ANIMATION */}
            <AnimatePresence>
                {showHammer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, y: -200, rotate: -45 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-center flex flex-col items-center"
                        >
                            <Gavel className="w-64 h-64 text-purple-500 drop-shadow-[0_0_50px_rgba(176,38,255,1)]" />
                            <motion.h2
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-6xl md:text-8xl font-black italic mt-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-purple-500 uppercase tracking-tighter"
                            >
                                {hammerText}
                            </motion.h2>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="bg-gaming-800/80 py-4 px-4 sm:px-8 border-b border-cyan-500/20 flex flex-wrap justify-between items-center gap-4 shadow-md sticky top-0 z-10 min-h-[80px] relative">
                {/* LEFT */}
                <div className="flex items-center gap-4 flex-1">
                    {isAdmin && (
                        <button onClick={() => navigate('/admin-history')} className="p-2 bg-gaming-900 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg transition-colors group">
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-cyan-400" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl md:text-2xl font-black italic uppercase text-white tracking-[0.1em] leading-none mb-1 shadow-sm drop-shadow-md">
                            {roomData.name}
                        </h1>
                        <p className="text-[10px] md:text-xs text-cyan-400 uppercase font-bold tracking-[0.2em] font-mono leading-none">
                            Type: {roomData.gameType}
                        </p>
                    </div>
                </div>

                {/* CENTER - Absolute on large screens */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex-col items-center justify-center text-center hidden md:flex">
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.3em] mb-1">Room Code</div>
                    <div className="text-3xl font-black uppercase tracking-[0.2em] text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] px-6 py-1 bg-gaming-900 rounded-xl border border-white/10 select-all">
                        {roomCode}
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end w-full sm:w-auto mt-4 sm:mt-0">
                    <button
                        onClick={() => setIsTeamModalOpen(true)}
                        className="bg-purple-500/20 hover:bg-purple-500 border border-purple-500 text-purple-400 hover:text-white px-3 md:px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] md:text-xs transition-colors flex items-center gap-2"
                    >
                        <Users size={16} /> <span className="hidden sm:inline">Team Details</span>
                    </button>
                    {isAdmin && roomData.status !== "ended" && (
                        <button
                            onClick={async () => {
                                if (window.confirm("Are you sure you want to end this auction?")) {
                                    const { endAuction } = await import('../utils/auctionLogic');
                                    await endAuction(roomCode);
                                    navigate('/admin-home');
                                }
                            }}
                            className="bg-red-500/20 hover:bg-red-500 border border-red-500 text-red-500 hover:text-white px-3 md:px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] md:text-xs transition-colors"
                        >
                            End Auction
                        </button>
                    )}
                    <div className="text-center ml-2 border-l border-white/10 pl-4 hidden sm:block">
                        <div className="text-[9px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Status</div>
                        <div className="text-xs md:text-sm font-bold uppercase text-green-400 font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> LIVE
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Room Code (Visible only below md) */}
            <div className="md:hidden flex flex-col items-center justify-center text-center bg-gaming-900 border-b border-cyan-500/20 py-3 shadow-md">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-1">Room Code</div>
                <div className="text-2xl font-black uppercase tracking-[0.2em] text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {roomCode}
                </div>
            </div>

            <div className="flex-1 p-4 lg:p-8 flex flex-col overflow-y-auto w-full max-w-[1600px] mx-auto">
                <div className="w-full space-y-6 flex flex-col h-full">

                    {/* Live Player Top Bar / Timer */}
                    {/* {currentPlayer ? (
                        <div className="bg-gaming-900 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.1)] rounded-xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Clock className="text-cyan-400 animate-pulse" />
                                <span className="font-bold uppercase tracking-widest text-cyan-400">Current Lot</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-1.5 bg-gaming-800 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                                    title={isMuted ? "Unmute Hammer Sound" : "Mute Hammer Sound"}
                                >
                                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <div className="text-xs bg-gaming-800 px-3 py-1 rounded-full text-gray-400 border border-white/10 font-bold uppercase tracking-widest">
                                    {getRemainingCount()} Players Remaining
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gaming-900 border border-purple-500/30 shadow-[0_0_20px_rgba(176,38,255,0.1)] rounded-xl p-6 text-center">
                            <h2 className="text-2xl font-black uppercase italic tracking-widest text-purple-400">Waiting for next player</h2>
                            <p className="text-gray-500 uppercase text-sm font-bold tracking-widest mt-2">The Auctioneer is preparing the next lot.</p>
                        </div>
                    )} */}

                    {/* Main Stage - Player Card */}
                    <div className="flex-1 min-h-[400px]">
                        {currentPlayer ? (
                            <PlayerCard
                                player={currentPlayer}
                                status="in-auction"
                                currentBid={roomData.currentBid || currentPlayer.basePrice}
                                isAdmin={isAdmin}
                                onNavigatePrev={handlePrevPlayer}
                                onNavigateNext={handleNextPlayer}
                                onSell={handleSell}
                                onBidChange={handleIncreaseBid}
                                onSkip={handleSkip}
                                teams={teams}
                                globalAmountUnit={globalAmountUnit}
                                setGlobalAmountUnit={setGlobalAmountUnit}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-50 relative pointer-events-none text-center">
                                {/* Only show start button if admin and there are players left, otherwise show hammer */}
                                {isAdmin && roomData.status !== "ended" && players.filter(p => p.status === 'pending' || p.status === 'unsold').length > 0 ? (
                                    <button
                                        onClick={handleNextPlayer}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-black italic tracking-widest text-xl uppercase py-4 px-12 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-3 relative z-10 pointer-events-auto cursor-pointer opacity-100"
                                    >
                                        Start Auction
                                    </button>
                                ) : (
                                    <>
                                        <div className="absolute w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] z-0" />
                                        <Gavel className="w-32 h-32 text-gray-700 relative z-10 mb-6" />
                                        <p className="text-xl font-bold uppercase tracking-widest text-gray-600 relative z-10">Patience.<br />The hammer will drop soon.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Ended State Message */}
                    {roomData.status === "ended" && (
                        <div className="bg-gaming-900 border border-red-500/50 shadow-[0_0_20px_rgba(255,0,0,0.1)] rounded-xl p-6 text-center mt-4">
                            <h2 className="text-2xl font-black uppercase italic tracking-widest text-red-500">Auction Ended</h2>
                            <p className="text-gray-400 uppercase text-sm font-bold tracking-widest mt-2">No further bidding actions can be taken.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* TEAM DETAILS MODAL */}
            <AnimatePresence>
                {isTeamModalOpen && (
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
                            className="bg-gaming-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.1)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gaming-800">
                                <div className="flex items-center gap-3">
                                    <Users className="text-purple-400 w-6 h-6 sm:w-8 sm:h-8" />
                                    <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-widest text-white">Franchise Details</h2>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={() => {
                                            import('papaparse').then((Papa) => {
                                                const csvData = [];
                                                
                                                // 1. Create Headers Row (Row 1 & 2)
                                                const teamNamesRow = ["Teams"];
                                                const subHeadersRow = ["Serial No."];
                                                
                                                teams.forEach(t => {
                                                    teamNamesRow.push(t.name, "", "");
                                                    subHeadersRow.push("Player's name", "Base Price", "Sold Price");
                                                });
                                                
                                                csvData.push(teamNamesRow);
                                                csvData.push(subHeadersRow);
                                                
                                                // 2. Prepare Data Grouped By Team
                                                const teamPlayersMap = {};
                                                let maxPlayersInATeam = 0;
                                                teams.forEach(t => {
                                                    const tPlayers = players.filter(p => p.soldTo === t.id);
                                                    teamPlayersMap[t.id] = tPlayers;
                                                    if(tPlayers.length > maxPlayersInATeam) {
                                                        maxPlayersInATeam = tPlayers.length;
                                                    }
                                                });
                                                
                                                if(maxPlayersInATeam === 0) {
                                                    alert("No players sold yet to download data.");
                                                    return;
                                                }
                                                
                                                // 3. Create Player Rows
                                                for (let i = 0; i < maxPlayersInATeam; i++) {
                                                    const row = [(i + 1).toString()]; // Serial No
                                                    
                                                    teams.forEach(t => {
                                                        const p = teamPlayersMap[t.id][i];
                                                        if (p) {
                                                            row.push(p.name, p.basePrice, p.soldPrice);
                                                        } else {
                                                            row.push("", "", ""); // Fill empty spaces if team has fewer players
                                                        }
                                                    });
                                                    
                                                    csvData.push(row);
                                                }
                                                
                                                const csv = Papa.default.unparse(csvData);
                                                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `${roomData.name.replace(/\s+/g, '_')}_Auction_Results.csv`;
                                                a.click();
                                            });
                                        }}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 sm:px-4 py-3 sm:py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                                    >
                                        <Download size={16} /> Download Data
                                    </button>
                                    <button onClick={() => setIsTeamModalOpen(false)} className="text-gray-400 hover:text-red-400 transition-colors p-3 sm:p-2 rounded-lg sm:rounded-full hover:bg-white/5 bg-gaming-900 border border-white/10 sm:border-none sm:bg-transparent flex-shrink-0 flex items-center justify-center">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-x-auto p-6 custom-scrollbar">
                                {teams.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 uppercase font-bold tracking-widest">No Teams Registered Yet.</div>
                                ) : (
                                    <div className="flex gap-6 min-w-max pb-4">
                                        {teams.map(team => {
                                            const teamPlayers = players.filter(p => p.soldTo === team.id);

                                            return (
                                                <div key={team.id} className="w-[300px] flex-shrink-0 flex flex-col border border-white/10 rounded-xl overflow-hidden bg-gaming-800/50">

                                                    {/* Column Header */}
                                                    <div className="p-4 bg-gaming-800 border-b border-white/10">
                                                        <h3 className="text-xl font-black italic uppercase tracking-wider text-white flex items-center justify-between mb-2">
                                                            <span className="truncate pr-2">{team.name}</span>
                                                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded font-mono normal-case">{team.playersBought} Pl</span>
                                                        </h3>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex justify-between">
                                                                <span>Purse Remaining</span>
                                                                <span className="text-cyan-400 font-mono">₹{(team.remainingBudget / 10000000).toFixed(2)} Cr</span>
                                                            </div>
                                                            <div className="w-full h-1 bg-gaming-900 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-cyan-500"
                                                                    style={{ width: `${Math.max(0, (team.remainingBudget / team.fixedBudget) * 100)}%` }}
                                                                />
                                                            </div>
                                                            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-right mt-1">
                                                                Total: ₹{(team.fixedBudget / 10000000).toFixed(2)} Cr
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Column Body / Roster */}
                                                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gaming-900/50 custom-scrollbar max-h-[50vh]">
                                                        {teamPlayers.length === 0 ? (
                                                            <div className="text-center py-8 text-xs text-gray-500 uppercase font-bold tracking-widest italic opacity-50">Empty Roster</div>
                                                        ) : (
                                                            teamPlayers.map(p => (
                                                                <div key={p.id} className="flex flex-col bg-gaming-800 p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <img src={p.photo} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-white/10 bg-gaming-900" />
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-bold uppercase tracking-widest text-xs text-white truncate" title={p.name}>{p.name}</div>
                                                                            <div className="text-[9px] text-gray-500 uppercase tracking-widest">{p.role}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                                                                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Sold For</span>
                                                                        <span className="text-cyan-400 font-mono font-bold text-xs bg-cyan-500/10 px-2 py-0.5 rounded">
                                                                            {/* Standardize display for Lakhs/Crores based on magnitude */}
                                                                            {p.soldPrice >= 10000000
                                                                                ? `₹${(p.soldPrice / 10000000).toFixed(2)}Cr`
                                                                                : `₹${(p.soldPrice / 100000).toLocaleString()}L`}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>

                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuctionRoom;
