import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import { Users, UserPlus, Database, Play, Upload, Copy, ExternalLink, History, Info } from 'lucide-react';
import { createAuctionEvent, addPlayerToAuction, listenToAdminAuctions, listenToTeams } from '../utils/auctionLogic';
import { auth } from '../firebase/config';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [generatedLinkInfo, setGeneratedLinkInfo] = useState(null);
    const [registeredTeams, setRegisteredTeams] = useState([]);
    const [showRegisteredTeams, setShowRegisteredTeams] = useState(false);
    const [expandedFiles, setExpandedFiles] = useState({});

    // Context / Config Data
    const [auctionName, setAuctionName] = useState('');
    const [gameType, setGameType] = useState('Select');

    // Squad / Budget Config
    const [maxTeams, setMaxTeams] = useState('');
    const [teamBudget, setTeamBudget] = useState(''); // Base amount
    const [teamBudgetUnit, setTeamBudgetUnit] = useState('Select');
    const [maxPlayersPerTeam, setMaxPlayersPerTeam] = useState('');

    // State Collections
    const [players, setPlayers] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    // Manual Player Form
    const [playerName, setPlayerName] = useState('');
    const [playerRole, setPlayerRole] = useState('Select');
    const [playerBasePrice, setPlayerBasePrice] = useState(''); // Value
    const [playerPriceUnit, setPlayerPriceUnit] = useState('Select'); // Lakhs, Crores, Points
    const [playerPhoto, setPlayerPhoto] = useState('');

    const gameRoles = {
        Select: ['Select'],
        Cricket: ['Select', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'],
        Football: ['Select', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
        Basketball: ['Select', 'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
        Esports: ['Select', 'Entry Fragger', 'Sniper', 'Support', 'IGL', 'Flex'],
        Custom: ['Select', 'Player']
    };

    const currentRoles = gameRoles[gameType] || gameRoles.Custom;

    // --- FETCH TEAMS ---
    useEffect(() => {
        if (!generatedLinkInfo) return;
        const unsub = listenToTeams(generatedLinkInfo, (teams) => {
            setRegisteredTeams(teams);
        });
        return () => unsub();
    }, [generatedLinkInfo]);

    // --- PLAYER CONFIG ---
    const handleManualAddPlayer = (e) => {
        e.preventDefault();
        if (!playerName) return;

        let multiplier = 1;
        if (playerPriceUnit === 'Lakhs') multiplier = 100000;
        else if (playerPriceUnit === 'Crores') multiplier = 10000000;

        setPlayers([...players, {
            id: Date.now(),
            name: playerName,
            role: playerRole,
            basePrice: playerBasePrice * multiplier,
            priceUnit: playerPriceUnit,
            photo: playerPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=random&size=200`,
            stats: {}
        }]);
        setPlayerName('');
        setPlayerPhoto('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isCsv = file.name.endsWith('.csv');

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target.result;

            const knownKeysRegex = /^(name|playername|role|baseprice|photo|image|url|imageurl|image_url|image url|stats)$/i;
            const extractPhotoUrl = (p) => {
                const photoKey = Object.keys(p).find(k => /^(photo|image|url|imageurl|image_url|image url)$/i.test(k));
                return photoKey ? p[photoKey] : '';
            };

            if (isCsv) {
                Papa.parse(result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsed = results.data.map((p, idx) => {
                            const dynamicStats = {};
                            Object.keys(p).forEach(k => {
                                if (!knownKeysRegex.test(k) && p[k] !== undefined && p[k] !== '') {
                                    dynamicStats[k] = p[k];
                                }
                            });
                            const photoUrl = extractPhotoUrl(p);
                            return {
                                id: Date.now() + idx,
                                name: p.name || p.PlayerName || 'Unknown Player',
                                role: p.role || p.Role || currentRoles[0],
                                basePrice: parseFloat(p.basePrice || p.BasePrice || 50) * 100000,
                                photo: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || p.PlayerName || 'Unknown')}&background=random`,
                                stats: dynamicStats,
                                sourceFile: file.name
                            };
                        });
                        setPlayers(prev => [...prev, ...parsed]);
                        toast.success(`${parsed.length} players imported via CSV!`);
                    }
                });
            } else {
                try {
                    const data = JSON.parse(result);
                    const sourceArray = data.players || data;
                    if (Array.isArray(sourceArray)) {
                        const parsed = sourceArray.map((p, idx) => {
                            const dynamicStats = p.stats || {};
                            Object.keys(p).forEach(k => {
                                if (!knownKeysRegex.test(k) && p[k] !== undefined && p[k] !== '') {
                                    dynamicStats[k] = p[k];
                                }
                            });
                            const photoUrl = extractPhotoUrl(p);
                            return {
                                id: Date.now() + idx,
                                name: p.name || p.PlayerName || 'Unknown Player',
                                role: p.role || p.Role || currentRoles[0],
                                basePrice: (p.basePrice || p.BasePrice || 50) * 100000,
                                photo: photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || p.PlayerName || 'Unknown')}&background=random`,
                                stats: dynamicStats,
                                sourceFile: file.name
                            };
                        });
                        setPlayers(prev => [...prev, ...parsed]);
                        toast.success(`${parsed.length} players imported via JSON!`);
                    }
                } catch (err) {
                    toast.error('Invalid JSON file format');
                }
            }
        };

        reader.readAsText(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        handleFileUpload({ target: { files: [file] } });
    };

    // --- LAUNCH ---
    const handleCreateEvent = async () => {
        if (!auctionName) { toast.error('Auction Name is required'); return; }
        if (maxTeams < 2) { toast.error('Require at least 2 teams'); return; }
        if (players.length < 1) { toast.error('Add at least 1 player'); return; }

        setLoading(true);
        try {
            const uid = auth.currentUser.uid;
            const roomCode = await createAuctionEvent(auctionName, gameType, maxTeams, teamBudget, teamBudgetUnit, maxPlayersPerTeam, uid);

            for (const player of players) {
                await addPlayerToAuction(roomCode, {
                    name: player.name,
                    role: player.role,
                    basePrice: player.basePrice,
                    photo: player.photo,
                    stats: player.stats
                });
            }

            toast.success(`Event Initialized: ${roomCode}`);
            setGeneratedLinkInfo(roomCode);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create event');
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col relative bg-gaming-900 text-white font-sans overflow-x-hidden">
            {/* Dynamic Tech Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#0a0a12]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/5 via-gaming-900/50 to-gaming-900"></div>
            </div>

            <div className="container mx-auto p-4 py-8 relative z-10 w-full max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-cyan-500/30 pb-4 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-widest text-white neon-text-blue mb-2">
                            Event Initializer
                        </h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">
                            Configure rules and roster constraints
                        </p>
                    </div>

                    {/* <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/admin-home')}
                            className="px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all border border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5"
                        >
                            Back to Command Center
                        </button>
                        <button
                            onClick={() => navigate('/admin-history')}
                            className={`px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center gap-2 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50`}
                        >
                            <History size={14} /> View History
                        </button>
                    </div> */}
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* LEFT COL: CONFIGURATION & TEAMS */}
                        <div className="space-y-8">
                            {/* Event Configuration */}
                            <div className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500"></div>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10">
                                    <Database className="text-cyan-400" />
                                    <h3 className="text-xl font-bold uppercase tracking-wider text-white">Event Global Settings</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Tournament Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Tournament Name"
                                            className="w-full bg-gaming-800 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                            value={auctionName}
                                            onChange={(e) => setAuctionName(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Primary Rulebook (Sport)</label>
                                        <select
                                            value={gameType}
                                            onChange={(e) => {
                                                setGameType(e.target.value);
                                                setPlayerRole(gameRoles[e.target.value][0]);
                                            }}
                                            className="w-full bg-gaming-800 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                        >
                                            {Object.keys(gameRoles).map(game => (
                                                <option key={game} value={game}>{game}</option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            </div>


                            {/* Team Auto Setup Configuration */}
                            <div className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500"></div>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10 justify-between">
                                    <div className="flex items-center gap-3">
                                        <Users className="text-purple-400" />
                                        <h3 className="text-xl font-bold uppercase tracking-wider text-white">Participating Franchises Setup</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Number of Teams</label>
                                        <input
                                            placeholder='Enter'
                                            type="number"
                                            min="2"
                                            max="32"
                                            value={maxTeams}
                                            onChange={(e) => setMaxTeams(e.target.value)}
                                            className="w-full bg-gaming-800 border border-white/20 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 whitespace-nowrap">Number of Players</label>
                                        <input
                                            placeholder='Enter'
                                            type="number"
                                            min="1"
                                            value={maxPlayersPerTeam}
                                            onChange={(e) => setMaxPlayersPerTeam(e.target.value)}
                                            className="w-full bg-gaming-800 border border-white/20 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2 whitespace-nowrap">
                                            Budget
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="Amount"
                                            value={teamBudget}
                                            onChange={(e) => setTeamBudget(e.target.value)}
                                            className="w-full bg-gaming-800 border border-white/20 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">&nbsp;</label>
                                        <select
                                            value={teamBudgetUnit}
                                            onChange={(e) => setTeamBudgetUnit(e.target.value)}
                                            className="w-full bg-gaming-800 border border-white/20 rounded-lg px-2 py-3 text-white focus:outline-none focus:border-purple-500 placeholder:text-gray-400"
                                        >
                                            <option value="">Select</option>
                                            <option value="Lakhs">Lakhs</option>
                                            <option value="Crores">Crores</option>
                                            <option value="Points">Points</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {!generatedLinkInfo ? (
                                        <button
                                            onClick={handleCreateEvent}
                                            disabled={loading || players.length < 1}
                                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black italic uppercase tracking-widest py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                        >
                                            {loading ? 'Booting Arena...' : <><Play fill="currentColor" /> Generate Event</>}
                                        </button>
                                    ) : (
                                        <div className="border border-green-500/50 p-6 rounded-xl relative overflow-hidden flex flex-col items-center gap-4 bg-green-500/5 mt-8">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

                                            <div className="text-green-500 font-black italic uppercase tracking-widest text-center text-xl z-10 w-full mb-2">
                                                Event Generated!
                                            </div>

                                            {/* Registration Progress */}
                                            <div className="z-10 bg-gaming-900 border border-white/10 rounded-lg p-4 w-full text-center shadow-inner">
                                                <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                                                    <Users size={12} className="text-cyan-400" /> Franchises Registered
                                                </div>
                                                <button
                                                    onClick={() => setShowRegisteredTeams(!showRegisteredTeams)}
                                                    className="w-full text-3xl font-black font-mono text-cyan-400 hover:text-white transition-colors bg-gaming-800 px-4 py-3 rounded-lg border border-white/5 flex items-center justify-center gap-2"
                                                >
                                                    {registeredTeams.length} <span className="text-gray-600">/ {maxTeams}</span>
                                                </button>

                                                {showRegisteredTeams && (
                                                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto custom-scrollbar">
                                                        {registeredTeams.length === 0 ? (
                                                            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest italic">Awaiting Registrations...</div>
                                                        ) : (
                                                            registeredTeams.map(team => (
                                                                <div key={team.id} className="bg-purple-500/20 text-purple-300 text-[10px] px-3 py-1.5 rounded border border-purple-500/30 uppercase font-bold tracking-widest flex items-center gap-2 max-w-full">
                                                                    {team.logo && <img src={team.logo} alt={team.name} className="w-4 h-4 rounded-full object-cover bg-gaming-900" />}
                                                                    <span className="truncate">{team.name}</span>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center justify-center w-full z-10 mt-2 gap-4">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/team-setup/${generatedLinkInfo}`);
                                                        toast.success('Registration Link Copied!');
                                                    }}
                                                    className="w-full sm:w-1/2 bg-gaming-900 border border-green-500/50 text-green-500 hover:bg-green-500 hover:text-white py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs"
                                                    title="Copy Team Registration Link"
                                                >
                                                    <Copy size={16} /> Copy Link
                                                </button>

                                                <button
                                                    disabled={registeredTeams.length < parseInt(maxTeams)}
                                                    onClick={() => navigate(`/auction/${generatedLinkInfo}`)}
                                                    className="w-full sm:w-1/2 bg-cyan-600 hover:bg-cyan-500 text-white font-black italic uppercase tracking-widest py-3 px-6 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-600"
                                                >
                                                    <Play fill="currentColor" size={16} /> Enter Arena
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: PLAYER MANAGEMENT */}
                        <div className="space-y-8">
                            <div className="bg-gaming-800/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[100px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500"></div>

                                {/* HEADER */}
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-cyan-500/20 justify-between">
                                    <div className="flex items-center gap-3">
                                        <UserPlus className="text-cyan-400" />
                                        <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                                            Player Draft Roster
                                        </h3>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="bg-cyan-500/20 text-cyan-400 text-[10px] md:text-xs px-2 py-1 rounded font-bold uppercase border border-cyan-500/50">
                                            {players.length} Players
                                        </span>

                                        {players.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Clear all players?")) setPlayers([]);
                                                }}
                                                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-[10px] md:text-xs font-bold uppercase transition-colors"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* IMPORT + PLAYER LIST GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* IMPORT BOX */}
                                    <div className="col-span-1 border border-white/5 rounded-2xl md:border-none p-4 md:p-0 bg-gaming-900/40 md:bg-transparent">
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`relative group h-60 flex items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer
        ${dragActive
                                                    ? "border-cyan-400 bg-cyan-500/20 scale-[1.02]"
                                                    : "border-cyan-500/30 bg-gaming-800 hover:bg-cyan-500/10 hover:border-cyan-400"
                                                }`}
                                        >

                                            <input
                                                type="file"
                                                accept=".json,.csv"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />

                                            <div className="flex flex-col items-center justify-center gap-3 text-center pointer-events-none">

                                                <Upload size={36} className="text-cyan-400" />

                                                <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm">
                                                    Bulk Import Players
                                                </span>

                                                <span className="text-xs text-gray-500">
                                                    Drag & Drop JSON / CSV
                                                </span>

                                            </div>

                                        </div>
                                    </div>

                                    {/* PLAYER LIST */}
                                    <div className="col-span-1 md:col-span-2 flex flex-col">

                                        <div className="relative mb-4 flex items-center">
                                            <div className="flex-grow border-t border-white/10"></div>
                                            <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase font-bold tracking-widest bg-transparent">Uploaded Files</span>
                                            <div className="flex-grow border-t border-white/10"></div>
                                        </div>

                                        <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">

                                            {players.length === 0 ? (
                                                <div className="flex items-center justify-center py-6">
                                                    <p className="text-gray-600 text-sm uppercase font-bold tracking-widest text-center">
                                                        NO FILES UPLOADED
                                                    </p>
                                                </div>
                                            ) : (
                                                (() => {

                                                    const groupedFiles = players.reduce((acc, p) => {
                                                        const key = p.sourceFile || "Manual Entry";
                                                        if (!acc[key]) acc[key] = [];
                                                        acc[key].push(p);
                                                        return acc;
                                                    }, {});

                                                    return Object.entries(groupedFiles).map(([fileName, filePlayers]) => (

                                                        <div
                                                            key={fileName}
                                                            className="flex items-center justify-between bg-gaming-900/60 border border-white/10 rounded-lg px-4 py-3 hover:bg-white/5 transition-colors"
                                                        >

                                                            {/* FILE NAME */}
                                                            <div className="flex items-center gap-3">

                                                                <Upload size={18} className="text-cyan-400" />

                                                                <div className="flex flex-col">
                                                                    <span className="text-white text-sm font-bold truncate max-w-[220px]">
                                                                        {fileName}
                                                                    </span>

                                                                    <span className="text-xs text-gray-500 uppercase tracking-widest">
                                                                        {filePlayers.length} Players Imported
                                                                    </span>
                                                                </div>

                                                            </div>

                                                            {/* REMOVE FILE */}
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm(`Remove all players from ${fileName}?`)) {
                                                                        setPlayers(prev => prev.filter(p => p.sourceFile !== fileName))
                                                                    }
                                                                }}
                                                                className="text-gray-500 hover:text-red-500 transition-colors text-sm"
                                                            >
                                                                ✕
                                                            </button>

                                                        </div>

                                                    ))

                                                })()
                                            )}

                                        </div>
                                    </div>
                                </div>

                                {/* MANUAL ENTRY */}
                                <div className="relative my-3 flex items-center">
                                    <div className="flex-grow border-t border-white/10"></div>
                                    <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase font-bold tracking-widest bg-transparent">Or Add Manually</span>
                                    <div className="flex-grow border-t border-white/10"></div>
                                </div>

                                <form
                                    onSubmit={handleManualAddPlayer}
                                    className="space-y-4 bg-gaming-800/50 p-4 rounded-xl border border-white/5"
                                >
                                    {/* SAME MANUAL FORM (unchanged) */}
                                    <input
                                        type="text"
                                        placeholder="Player Full Name"
                                        required
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        className="w-full bg-gaming-800 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Assigned Role</label>
                                            <select
                                                value={playerRole}
                                                onChange={(e) => setPlayerRole(e.target.value)}
                                                className="w-full bg-gaming-800 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm"
                                            >
                                                {currentRoles.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="flex-1">
                                                <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                    Base Price
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Set Base Price"
                                                    value={playerBasePrice}
                                                    onChange={(e) => setPlayerBasePrice(e.target.value)}
                                                    className="w-full bg-gaming-800 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm placeholder:text-gray-400"
                                                />
                                            </div>
                                            <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
                                                <label className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-0 hidden sm:block">Unit</label>
                                                <select
                                                    value={playerPriceUnit}
                                                    onChange={(e) => setPlayerPriceUnit(e.target.value)}
                                                    className="w-full bg-gaming-800 border border-white/20 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Lakhs">Lakhs</option>
                                                    <option value="Crores">Crores</option>
                                                    <option value="Points">Points</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="Enter Photo URL"
                                        required
                                        value={playerPhoto}
                                        onChange={(e) => setPlayerPhoto(e.target.value)}
                                        className="w-full bg-gaming-800 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 text-sm"
                                    />
                                    <button type="submit" className="w-full py-3 bg-gaming-800 text-cyan-400 rounded-lg border border-cyan-500/50 hover:bg-cyan-500/20 transition-all uppercase font-bold tracking-widest flex items-center justify-center gap-2 text-sm shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                                        <UserPlus size={16} /> Enter Roster
                                    </button>
                                </form>


                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
