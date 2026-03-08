import React from 'react';

const TeamCard = ({ team, isSelected = false, onClick, disabled = false }) => {
    if (!team) return null;

    const fractionUsed = team.fixedBudget ? ((team.fixedBudget - team.remainingBudget) / team.fixedBudget) : 0;
    const isWarned = fractionUsed > 0.8; // 80% budget used
    const isCritical = fractionUsed > 0.95; // 95% budget used

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group
                ${disabled ? 'opacity-50 cursor-not-allowed border-gray-700 bg-gaming-900' : 'cursor-pointer hover:-translate-y-1'}
                ${isSelected
                    ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_20px_rgba(176,38,255,0.3)]'
                    : 'border-white/10 bg-gaming-800 hover:border-cyan-500/50 hover:bg-gaming-800/80'
                }
            `}
        >
            {/* Background highlight on hover/select */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r from-cyan-500 to-transparent ${isSelected ? '!opacity-20 from-purple-500' : ''}`} />

            <div className="relative z-10 flex items-center gap-4">
                {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-lg object-contain bg-white/5 border border-white/10" />
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-gaming-900 border border-white/10 flex items-center justify-center font-black italic text-xl text-gray-500">
                        {team.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1">
                    <h3 className="font-bold text-lg uppercase tracking-wider drop-shadow-sm mb-1 line-clamp-1 text-white">
                        {team.name}
                    </h3>

                    <div className="flex justify-between items-end gap-2">
                        <div className="flex-1 mr-4">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">
                                Remaining Balance
                            </div>
                            <div className={`font-mono font-bold leading-none ${isCritical ? 'text-red-500 animate-pulse' : isWarned ? 'text-yellow-500' : 'text-cyan-400'}`}>
                                ₹{(team.remainingBudget / 10000000).toFixed(2)} Cr
                            </div>
                            <div className="w-full h-1 bg-gaming-900 mt-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${isCritical ? 'bg-red-500' : isWarned ? 'bg-yellow-500' : 'bg-cyan-500'}`}
                                    style={{ width: `${Math.max(0, (team.remainingBudget / team.fixedBudget) * 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="text-right pb-3">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">
                                Squad
                            </div>
                            <div className="font-bold text-sm leading-none text-white">
                                {team.playersBought}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default TeamCard;
