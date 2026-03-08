import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const JoinRoom = () => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleJoin = (e) => {
        e.preventDefault();
        if (roomCode.trim().length > 0) {
            navigate(`/auction/${roomCode.trim().toUpperCase()}`);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 bg-gaming-900">
            <div className="w-full max-w-md mx-4 sm:mx-0 bg-gaming-800/80 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative text-center">

                <div className="flex justify-center mb-6">
                    <Users className="w-16 h-16 text-purple-400 drop-shadow-[0_0_10px_rgba(176,38,255,0.5)]" />
                </div>

                <h2 className="text-3xl font-black italic uppercase tracking-widest mb-4 neon-text-purple">
                    Join The Arena
                </h2>
                <p className="text-gray-400 mb-8 uppercase text-sm font-bold tracking-wider">
                    Enter access code to view live dashboard
                </p>

                <form onSubmit={handleJoin} className="space-y-6">
                    <input
                        type="text"
                        placeholder="ROOM CODE"
                        required
                        className="w-full bg-gaming-900 border border-white/20 rounded-lg px-4 py-4 text-center text-3xl font-black italic uppercase tracking-widest focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-700 text-white"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        maxLength={8}
                    />
                    <button
                        type="submit"
                        disabled={!roomCode.trim()}
                        className="w-full bg-purple-600 text-white border border-purple-400 py-4 rounded-lg font-black uppercase tracking-widest hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enter Auction
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-white uppercase text-xs font-bold tracking-widest transition-colors"
                    >
                        Return to Base
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinRoom;
