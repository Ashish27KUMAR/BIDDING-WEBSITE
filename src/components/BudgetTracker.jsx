import React from 'react';
import TeamCard from './TeamCard';

const BudgetTracker = ({ teams, selectedTeamId, onSelectTeam }) => {

    // Sort teams by available budget descending
    const sortedTeams = [...teams].sort((a, b) => b.remainingBudget - a.remainingBudget);

    return (
        <div className="bg-gaming-900 border border-white/10 rounded-xl h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <h3 className="font-bold uppercase tracking-widest text-white neon-text-blue">
                    Live Franchises
                </h3>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-2 py-1 rounded font-bold uppercase">
                    {teams.length} Active
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sortedTeams.map(team => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        isSelected={selectedTeamId === team.id}
                        onClick={() => onSelectTeam && onSelectTeam(team.id)}
                        disabled={!onSelectTeam} // Disabled completely if no select handler (e.g., audience view)
                    />
                ))}
            </div>
        </div>
    );
};

export default BudgetTracker;
