import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const PlayerCard = ({
    player,
    status = "pending",
    currentBid = 0,
    isAdmin = false,
    onNavigatePrev,
    onNavigateNext,
    onSell,
    onBidChange,
    teams,
    globalAmountUnit,
    setGlobalAmountUnit
}) => {
    const [teamSearch, setTeamSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [forceShowAllTeams, setForceShowAllTeams] = useState(false); // NEW STATE
    const [selectedTeamObj, setSelectedTeamObj] = useState(null);
    const [customAmount, setCustomAmount] = useState("");

    const suggestionRef = useRef(null);

    const STAT_ORDER = [
        "MATCHES",
        "INNINGS",
        "RUNS",
        "AVERAGE",
        "STRIKE_RATE",
        "HUNDREDS",
        "FIFTIES",
        "WICKETS",
        "BOWLING_AVERAGE",
        "ECONOMY",
        "BEST_BOWLING",
        "AGE"
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setTeamSearch("");
        setSelectedTeamObj(null);
        setShowSuggestions(false);
        setForceShowAllTeams(false);
        setCustomAmount("");
    }, [player?.id]);

    if (!player) return null;

    const filteredTeams = teams?.filter((t) =>
        t.name.toLowerCase().includes(teamSearch.toLowerCase())
    ) || [];

    const formatLakhsCrores = (val) => {
        if (!val) return "0";
        if (val >= 10000000) {
            return (val / 10000000).toFixed(2) + "Cr";
        } else if (val >= 100000) {
            return (val / 100000).toFixed(0) + "L";
        } else {
            return val.toString();
        }
    };

    const derivedBid = React.useMemo(() => {
        if (customAmount !== "") {
            const amountVal = parseFloat(customAmount);
            if (globalAmountUnit === "Lakh") return amountVal * 100000;
            if (globalAmountUnit === "Crore") return amountVal * 10000000;
            return amountVal;
        }
        return currentBid || player.basePrice;
    }, [customAmount, globalAmountUnit, currentBid, player.basePrice]);

    useEffect(() => {
        if (isAdmin && onBidChange && customAmount !== "") {
            const timeoutId = setTimeout(() => {
                onBidChange(derivedBid);
            }, 400);
            return () => clearTimeout(timeoutId);
        }
    }, [customAmount, globalAmountUnit, derivedBid, isAdmin, onBidChange]);

    const handleSellClick = () => {
        const finalPrice = derivedBid;

        if (!selectedTeamObj) {
            alert("Please select a team first");
            return;
        }

        onSell(selectedTeamObj.id, finalPrice);
    };

    const orderedStats = Object.entries(player.stats || {})
        .filter(([k, v]) => v !== undefined && v !== null && v !== "" && k.toUpperCase() !== "COUNTRY")
        .sort(([a], [b]) => {
            const ia = STAT_ORDER.indexOf(a.toUpperCase());
            const ib = STAT_ORDER.indexOf(b.toUpperCase());
            if (ia === -1 && ib === -1) return a.localeCompare(b);
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
        });

    const isMissingPhoto = !player.photo || player.photo.includes("ui-avatars");

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full min-h-full flex flex-col md:flex-row gap-5 bg-gaming-900 border border-cyan-500/40 rounded-xl p-5"
        >
            {/* LEFT SIDE - PLAYER PHOTO */}
            <div className={`w-full md:w-[40%] flex-shrink-0 ${isMissingPhoto ? 'bg-[#7fffd4]' : 'bg-gaming-800'} border border-cyan-400/30 rounded-lg overflow-hidden flex items-center justify-center relative min-h-[300px]`}>
                {!isMissingPhoto ? (
                    <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-[12rem] font-black text-black leading-none drop-shadow-lg">
                        {player.name ? player.name.substring(0, 2).toUpperCase() : "UN"}
                    </div>
                )}
            </div>

            {/* RIGHT SIDE - CONTROLS & STATS */}
            <div className="w-full md:w-[60%] flex flex-col justify-between gap-5 h-full">

                {/* NAME PLATE */}
                <div className="border border-white/10 bg-[#0d131f] rounded-lg p-5 flex items-center justify-center gap-4 shadow-inner">
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-widest italic truncate max-w-full">
                        {player.name}
                    </h2>
                    <div className="bg-white/10 border border-white/20 text-white text-xs md:text-sm px-4 py-1.5 rounded-full font-bold uppercase tracking-widest italic flex-shrink-0">
                        {player.role || "SELECT"}
                    </div>
                </div>

                {/* STATS */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {orderedStats.map(([key, val]) => {
                            // Convert long strings like image urls to be truncated if necessary
                            const displayVal = val && val.length > 30 ? val.substring(0, 27) + '...' : val;
                            return (
                                <div key={key} className="bg-[#0b1016] border border-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
                                    <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 text-center truncate w-full">
                                        {key.replace(/_/g, " ")}
                                    </div>
                                    <div className="text-lg md:text-xl font-bold text-white text-center break-all w-full leading-tight">
                                        {displayVal}
                                    </div>
                                </div>
                            );
                        })}
                        {orderedStats.length === 0 && (
                            <div className="col-span-full bg-[#0b1016] border border-white/5 rounded-lg p-4 text-center text-gray-600 text-sm font-bold uppercase tracking-widest flex items-center justify-center h-24">
                                NO STATS AVAILABLE
                            </div>
                        )}
                    </div>
                </div>

                {/* ADMIN CONTROLS CONTAINER */}
                {isAdmin && (
                    <div className="bg-[#0b1016] border border-cyan-500/30 rounded-xl p-5 mt-auto flex flex-col gap-4 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                        
                        {/* FIRST ROW: PRICES & SOLD ACTIONS */}
                        <div className="flex justify-between items-center w-full">
                            
                            {/* BASE PRICE */}
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] md:text-xs text-cyan-500 font-bold uppercase tracking-widest mb-1">Base Price</span>
                                <span className="text-3xl md:text-5xl font-black text-cyan-400 leading-none">
                                    {formatLakhsCrores(player.basePrice)}
                                </span>
                            </div>

                            {/* NAV & SOLD BUTTON */}
                            <div className="flex items-center gap-3 md:gap-6">
                                <button onClick={onNavigatePrev} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <button onClick={handleSellClick} className="bg-cyan-600 hover:bg-cyan-500 text-white font-black italic uppercase tracking-widest text-xl md:text-2xl px-8 md:px-12 py-3 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center">
                                    SOLD
                                </button>

                                <button onClick={onNavigateNext} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            {/* CURRENT BID */}
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] md:text-xs text-green-500 font-bold uppercase tracking-widest mb-1">Current Bid</span>
                                <span className="text-3xl md:text-5xl font-black text-green-400 leading-none">
                                    {formatLakhsCrores(derivedBid)}
                                </span>
                            </div>

                        </div>

                        {/* SECOND ROW: INPUTS (Amount, Unit, Team Selection) */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-3 justify-center w-full mt-2">
                            
                            {/* AMOUNT & UNIT TUPLE */}
                            <div className="flex items-stretch border border-white/20 rounded-lg overflow-hidden bg-transparent w-full sm:w-auto h-[48px]">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount"
                                    className="bg-transparent border-r border-white/20 px-4 w-1/2 sm:w-32 text-gray-300 focus:outline-none focus:bg-white/5 font-bold text-sm h-full"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                />
                                <div className="relative w-1/2 sm:w-28 h-full bg-transparent">
                                    <select
                                        value={globalAmountUnit}
                                        onChange={(e) => setGlobalAmountUnit(e.target.value)}
                                        className="appearance-none bg-transparent w-full h-full px-4 text-white font-bold uppercase tracking-widest text-xs focus:outline-none focus:bg-white/5 cursor-pointer"
                                    >
                                        <option value="Lakh" className="bg-gaming-900">Lakh</option>
                                        <option value="Crore" className="bg-gaming-900">Crore</option>
                                        <option value="Points" className="bg-gaming-900">Points</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* SELECT TEAM DROPDOWN */}
                            <div className="relative flex-1 w-full h-[48px]" ref={suggestionRef}>
                                <div className="relative text-white border border-white/20 rounded-lg flex items-center bg-transparent h-full group transition-colors hover:border-cyan-500/50">
                                    <input
                                        type="text"
                                        placeholder="SELECT TEAM"
                                        value={selectedTeamObj ? selectedTeamObj.name : teamSearch}
                                        onChange={(e) => {
                                            setTeamSearch(e.target.value);
                                            setSelectedTeamObj(null);
                                            setShowSuggestions(true);
                                            setForceShowAllTeams(false);
                                        }}
                                        className="bg-transparent flex-1 focus:outline-none text-left cursor-text placeholder-gray-500 font-bold tracking-widest uppercase text-sm h-full px-4"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSuggestions(true);
                                        }}
                                    />
                                    
                                    {/* DISTINCT BUTTON FOR ARROW */}
                                    <button 
                                        className="h-full px-3 border-l border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSuggestions(!showSuggestions);
                                            setForceShowAllTeams(!showSuggestions);
                                        }}
                                    >
                                        <ChevronDown size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                                    </button>
                                </div>
                                
                                <AnimatePresence>
                                    {showSuggestions && (forceShowAllTeams || teamSearch.length >= 2) && filteredTeams.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute bottom-[calc(100%+0.5rem)] w-full z-50 bg-[#0d131f] border border-cyan-500/50 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.2)] max-h-56 overflow-y-auto custom-scrollbar text-left text-sm"
                                        >
                                            {filteredTeams.map((t) => (
                                                <div
                                                    key={t.id}
                                                    onClick={() => {
                                                        setSelectedTeamObj(t);
                                                        setShowSuggestions(false);
                                                        setTeamSearch("");
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-cyan-500/20 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center transition-colors group"
                                                >
                                                    <span className="font-bold uppercase text-sm text-gray-300 group-hover:text-white truncate pr-4">{t.name}</span>
                                                    <div className="flex flex-col items-end flex-shrink-0">
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">Purse</span>
                                                        <span className="text-sm text-cyan-400 font-mono font-bold leading-tight">₹{formatLakhsCrores(t.remainingBudget)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PlayerCard;