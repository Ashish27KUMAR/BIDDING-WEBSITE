import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const PlayerCard = ({
    player,
    status = 'pending',
    currentBid = 0,
    isAdmin = false,
    onNavigatePrev,
    onNavigateNext,
    onSell,
    onSkip,
    teams
}) => {
    const [teamSearch, setTeamSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedTeamObj, setSelectedTeamObj] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [amountUnit, setAmountUnit] = useState('L');
    const suggestionRef = useRef(null);

    // Fixed order for stats to maintain consistency
    const STAT_ORDER = ["MATCHES", "INNINGS", "RUNS", "AVERAGE", "STRIKE_RATE", "HUNDREDS", "FIFTIES", "WICKETS", "BOWLING_AVERAGE", "ECONOMY", "BEST_BOWLING", "AGE", "COUNTRY", "PLAYER_ID"];

    // Hide suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Also reset selection when player changes
    useEffect(() => {
        setTeamSearch('');
        setSelectedTeamObj(null);
        setShowSuggestions(false);
        setCustomAmount('');
    }, [player?.id]);

    if (!player) return null;

    const isSold = status === 'sold';
    const isUnsold = status === 'unsold';

    const filteredTeams = teams?.filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase())) || [];

    const handleSellClick = () => {
        let multiplier = 1;
        if (amountUnit === 'L') multiplier = 100000;
        if (amountUnit === 'Cr') multiplier = 10000000;

        const amount = customAmount ? parseFloat(customAmount) * multiplier : null;
        if (selectedTeamObj) {
            onSell(selectedTeamObj.id, amount);
        } else {
            alert("Please select a team to sell the player to.");
        }
    };

    const getFormattedPrice = (val) => {
        if (!val) return '0';
        if (player.priceUnit === 'Points') return `${val} Pts`;
        if (val >= 10000000) {
            const cr = val / 10000000;
            return `${cr % 1 === 0 ? cr : cr.toFixed(2)}Cr`;
        } else {
            const lk = val / 100000;
            return `${lk % 1 === 0 ? lk : lk.toFixed(2)}L`;
        }
    };

    // Sort player stats based on predefined order
    const orderedStats = Object.entries(player.stats || {}).sort(([keyA], [keyB]) => {
        const indexA = STAT_ORDER.indexOf(keyA.toUpperCase());
        const indexB = STAT_ORDER.indexOf(keyB.toUpperCase());
        if (indexA === -1 && indexB === -1) return keyA.localeCompare(keyB);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                relative w-full min-h-[400px] flex flex-col md:flex-row gap-4 md:gap-5
                bg-gaming-900 border-2 rounded-xl p-3 md:p-5 shadow-2xl transition-all duration-300
                text-white
                ${isSold ? 'border-purple-500 shadow-[0_0_30px_rgba(176,38,255,0.2)]' : ''}
                ${isUnsold ? 'border-gray-500 opacity-75' : ''}
                ${status === 'in-auction' ? 'border-cyan-500/70 shadow-[0_0_40px_rgba(0,240,255,0.15)]' : 'border-white/10'}
            `}
        >
            {/* Status Overlay Ribbon for SOLD */}
            {isSold && (
                <div className="absolute top-10 -right-12 bg-purple-600/90 backdrop-blur-sm text-white font-black italic uppercase py-3 px-20 rotate-45 shadow-[0_0_30px_rgba(176,38,255,0.8)] border-y-4 border-purple-400 z-50 text-xl tracking-[0.2em] pointer-events-none flex flex-col items-center">
                    <span>SOLD</span>
                    <span className="text-sm tracking-normal text-cyan-300">₹{getFormattedPrice(player.soldPrice)}</span>
                </div>
            )}

            {/* Status Overlay Ribbon for UNSOLD */}
            {isUnsold && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] bg-red-600/90 backdrop-blur-sm text-white font-black italic uppercase py-4 px-24 border-y-4 border-red-400 z-50 text-6xl tracking-[0.2em] opacity-80 pointer-events-none whitespace-nowrap shadow-[0_0_50px_rgba(255,0,0,0.5)] flex items-center gap-4">
                    UNSOLD
                </div>
            )}

            {/* LEFT COLUMN: Photo Area */}
            <div className={`w-full md:w-[40%] flex flex-col border border-white/10 bg-black/40 rounded-lg items-center justify-center flex-shrink-0 min-h-[250px] overflow-hidden ${status === 'in-auction' ? 'border-cyan-500/30' : ''}`}>
                {player.photo ? (
                    <img
                        src={player.photo}
                        alt={player.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-4xl md:text-7xl font-black italic uppercase text-gray-700 tracking-widest opacity-50">Photo</div>
                )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-[60%] flex flex-col gap-4 relative h-full">

                {/* Top: Player Name Box */}
                <div className={`border p-4 flex items-center justify-center rounded-lg bg-gaming-800/80 min-h-[70px] ${status === 'in-auction' ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-white/10'}`}>
                    <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-[0.15em] text-white drop-shadow-md text-center">
                        {player.name}
                        <span className="block md:inline mt-1 md:mt-0 text-xs md:text-sm font-bold text-gray-400 uppercase md:ml-3 tracking-widest bg-gaming-900 border border-white/10 px-3 py-1 rounded-full align-middle">
                            {player.role}
                        </span>
                    </h2>
                </div>

                {/* Middle: Player Stats Grid */}
                <div className={`flex-1 border p-4 rounded-lg bg-gaming-900/50 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar shadow-inner ${status === 'in-auction' ? 'border-cyan-500/20' : 'border-white/10'}`}>
                    {orderedStats.length > 0 ? (
                        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-min content-start h-full pb-2">
                            {orderedStats.map(([key, val]) => (
                                <div key={key} className="flex flex-col items-center justify-center text-center bg-gaming-800/60 p-2 md:p-3 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors h-[75px]">
                                    <div className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 line-clamp-1 w-full truncate px-1">
                                        {key.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-base md:text-xl font-black text-white font-mono break-words leading-tight w-full max-h-full overflow-hidden">
                                        {val}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-600 font-bold uppercase tracking-widest text-lg bg-gaming-800/50 px-8 py-4 rounded-xl border border-white/5">Player Stats</div>
                    )}
                </div>

                {/* Bottom: Control Box */}
                <div className={`w-full flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border rounded-lg bg-gaming-800/80 min-h-[130px] gap-4 md:gap-2 ${status === 'in-auction' ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-white/10'}`}>

                    {/* TOP ROW for Mobile / LEFT SIDE for Desktop */}
                    <div className="flex w-full md:w-auto justify-between md:justify-start items-center gap-4">
                        {/* BASE PRICE */}
                        <div className="flex flex-col items-start justify-center text-left overflow-hidden">
                            <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">Base Price</div>
                            <div className="text-3xl sm:text-4xl md:text-6xl font-black font-mono mt-1 leading-none text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)] truncate max-w-[150px] md:max-w-full">
                                {getFormattedPrice(player.basePrice)}
                            </div>
                        </div>

                        {/* CURRENT BID (Moved here for mobile layout) */}
                        <div className="flex md:hidden flex-col items-end justify-center text-right overflow-hidden">
                            <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-green-400 whitespace-nowrap">Current Bid</div>
                            <div className="text-3xl sm:text-4xl md:text-6xl font-black font-mono mt-1 leading-none text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)] truncate max-w-[150px] md:max-w-full">
                                {(() => {
                                    if (isSold) return getFormattedPrice(player.soldPrice);
                                    if (customAmount !== '') {
                                        let multiplier = 1;
                                        if (amountUnit === 'L') multiplier = 100000;
                                        if (amountUnit === 'Cr') multiplier = 10000000;
                                        return getFormattedPrice(parseFloat(customAmount) * multiplier);
                                    }
                                    return getFormattedPrice(currentBid);
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* CONTROLS (Center / Bottom on Mobile) */}
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full border-y border-white/10 md:border-none py-4 md:py-0 my-2 md:my-0">
                        {status === 'in-auction' && isAdmin ? (
                            <>
                                {/* Top Row: Prev, Sold, Next */}
                                <div className="flex items-center justify-center gap-4 w-full">
                                    <button
                                        onClick={onNavigatePrev}
                                        className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors text-white flex-shrink-0"
                                        title="Previous Player"
                                    >
                                        &lt;
                                    </button>

                                    <button
                                        onClick={handleSellClick}
                                        disabled={!selectedTeamObj}
                                        className="px-6 md:px-10 py-2 border border-white/20 rounded-[2rem] bg-gaming-900 font-black italic tracking-[0.2em] text-sm md:text-base text-white hover:border-cyan-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-inner"
                                        title="Sell"
                                    >
                                        SOLD
                                    </button>

                                    <button
                                        onClick={onNavigateNext}
                                        className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white transition-colors text-white flex-shrink-0"
                                        title="Next Player"
                                    >
                                        &gt;
                                    </button>
                                </div>

                                {/* Bottom Row: Amount, Unit, Select Team */}
                                <div className="flex flex-row items-center justify-center gap-2 mt-2 w-full max-w-[340px]">
                                    <input
                                        type="number"
                                        id="inline-sell-amount"
                                        placeholder="Amount"
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                        className="w-[70px] md:w-[80px] bg-gaming-900 border border-white/20 rounded-lg px-2 py-2 text-center font-mono text-xs md:text-sm outline-none text-white focus:border-cyan-500 placeholder-gray-600 shadow-inner flex-shrink-0"
                                    />

                                    <select
                                        value={amountUnit}
                                        onChange={(e) => setAmountUnit(e.target.value)}
                                        className="bg-gaming-900 border border-white/20 rounded-lg px-1 py-2 text-center font-bold text-[10px] md:text-xs outline-none text-white focus:border-cyan-500 shadow-inner cursor-pointer"
                                    >
                                        <option value="L">Lakh</option>
                                        <option value="Cr">Crore</option>
                                        <option value="Pts">Pts</option>
                                    </select>

                                    <div className="relative flex-1" ref={suggestionRef}>
                                        <input
                                            type="text"
                                            placeholder="Select Team"
                                            value={selectedTeamObj ? selectedTeamObj.name : teamSearch}
                                            onChange={(e) => {
                                                setTeamSearch(e.target.value);
                                                setSelectedTeamObj(null);
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            className="w-full bg-gaming-900 border border-white/20 rounded-lg pl-3 pr-8 py-2 text-center font-bold uppercase tracking-widest text-[10px] md:text-xs outline-none text-white focus:border-cyan-500 placeholder-gray-600 shadow-inner"
                                        />
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />

                                        <AnimatePresence>
                                            {showSuggestions && !selectedTeamObj && teamSearch && filteredTeams.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="absolute bottom-full left-0 w-full mb-2 bg-gaming-800 border border-white/20 rounded-lg shadow-2xl z-50 max-h-40 overflow-y-auto custom-scrollbar"
                                                >
                                                    {filteredTeams.map(t => (
                                                        <button
                                                            key={t.id}
                                                            onClick={() => { setSelectedTeamObj(t); setShowSuggestions(false); setTeamSearch(''); }}
                                                            className="w-full text-[10px] uppercase font-bold tracking-widest text-left px-3 py-3 hover:bg-cyan-500/20 hover:text-cyan-400 text-white border-b border-white/10 last:border-0 transition-colors truncate block"
                                                        >
                                                            {t.name}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-500 font-bold uppercase tracking-widest text-sm flex items-center h-full justify-center text-center">
                                Auctioning...
                            </div>
                        )}
                    </div>

                    {/* CURRENT BID (Desktop Right Side) */}
                    <div className="hidden md:flex w-1/4 flex-col items-end justify-center text-right overflow-hidden">
                        <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-green-400 whitespace-nowrap">Current Bid</div>
                        <div className="text-4xl md:text-6xl font-black font-mono mt-1 leading-none text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.4)] truncate max-w-full">
                            {(() => {
                                if (isSold) return getFormattedPrice(player.soldPrice);
                                if (customAmount !== '') {
                                    let multiplier = 1;
                                    if (amountUnit === 'L') multiplier = 100000;
                                    if (amountUnit === 'Cr') multiplier = 10000000;
                                    return getFormattedPrice(parseFloat(customAmount) * multiplier);
                                }
                                return getFormattedPrice(currentBid);
                            })()}
                        </div>
                    </div>

                </div>

            </div>
        </motion.div>
    );
};

export default PlayerCard;
