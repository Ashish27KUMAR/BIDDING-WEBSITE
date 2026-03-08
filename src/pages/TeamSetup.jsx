import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Users, ShieldAlert } from 'lucide-react';
import Favicon from '../assets/Favicon.png';

const TeamSetup = () => {
    const { roomCode } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Form State
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState([{ name: '', role: '', phone: '' }]);

    useEffect(() => {
        const fetchRoom = async () => {
            const roomRef = doc(db, "auctions", roomCode);
            const snap = await getDoc(roomRef);
            if (snap.exists()) {
                setRoomData(snap.data());
            }
            setLoading(false);
        };

        const teamsRef = collection(db, "auctions", roomCode, "teams");
        const unsub = onSnapshot(teamsRef, (snapshot) => {
            setTeams(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        fetchRoom();
        return () => unsub();
    }, [roomCode]);

    const handleAddMember = () => {
        setMembers([...members, { name: '', role: '', phone: '' }]);
    };

    const updateMember = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teamName) return alert("Fill required fields");
        if (teams.length >= roomData.maxTeams) return alert("Registration Full!");

        setSubmitting(true);
        try {
            const teamsRef = collection(db, "auctions", roomCode, "teams");
            await addDoc(teamsRef, {
                name: teamName,
                members,
                fixedBudget: roomData.budgetPerTeam,
                remainingBudget: roomData.budgetPerTeam,
                playersBought: 0,
                registeredAt: new Date().toISOString()
            });
            setHasSubmitted(true);
        } catch (err) {
            console.error(err);
            alert("Failed to register. Try again.");
        }
        setSubmitting(false);
    };

    if (loading) return <div className="min-h-screen bg-gaming-900 flex justify-center items-center text-cyan-400 font-bold uppercase animate-pulse">Scanning Arena...</div>;

    if (!roomData) return <div className="min-h-screen bg-gaming-900 flex justify-center items-center text-red-400 font-bold uppercase">Invalid Invite Link</div>;

    if (roomData.status !== 'setup') return <div className="min-h-screen bg-gaming-900 flex justify-center items-center text-yellow-400 font-bold uppercase p-4 text-center">Registration closed or Event has already started.</div>;

    if (hasSubmitted) {
        return (
            <div className="min-h-screen bg-gaming-900 flex flex-col items-center justify-center p-4">
                <img src={Favicon} alt="BidZilla Logo" className="w-16 h-16 sm:w-24 sm:h-24 mb-6 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)] object-contain" />
                <h1 className="text-3xl font-black italic uppercase tracking-widest text-white mb-2 text-center">Registration Confirmed</h1>
                <p className="text-gray-400 font-bold tracking-widest uppercase text-center max-w-md">Your franchise has been locked in. Await further instructions from the Auctioneer.</p>
            </div>
        );
    }

    const isFull = teams.length >= roomData.maxTeams;

    return (
        <div className="min-h-screen bg-gaming-900 p-4 md:p-8 flex flex-col items-center">

            <div className="w-full max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-widest text-white neon-text-blue mb-4 drop-shadow-md">
                        {roomData.name}
                    </h1>
                    <p className="text-purple-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <Users size={18} /> Official Franchise Registration
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gaming-800/80 border border-white/10 p-4 rounded-xl text-center">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Slots Available</div>
                        <div className="text-2xl font-mono text-white font-bold">{roomData.maxTeams - teams.length} / {roomData.maxTeams}</div>
                    </div>
                    <div className="bg-gaming-800/80 border border-white/10 p-4 rounded-xl text-center">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Budget Allocation</div>
                        <div className="text-2xl font-mono text-cyan-400 font-bold">₹{roomData.budgetPerTeam / 10000000} Cr</div>
                    </div>
                    <div className="bg-gaming-800/80 border border-white/10 p-4 rounded-xl text-center">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Game Type</div>
                        <div className="text-2xl font-mono text-purple-400 font-bold uppercase">{roomData.gameType}</div>
                    </div>
                </div>

                {isFull ? (
                    <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center text-red-500 font-bold uppercase tracking-widest flex flex-col items-center">
                        <ShieldAlert size={48} className="mb-4 text-red-400" />
                        <p className="text-xl">Arena Registration is Full</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-gaming-800 border border-white/10 rounded-xl p-6 md:p-8 space-y-8">

                        {/* Team Info */}
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">1. Franchise Identity</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Franchise Name</label>
                                    <input required type="text" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full bg-gaming-900 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. Neon Strikers" />
                                </div>
                            </div>
                        </div>

                        {/* Additional Members */}
                        <div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                                <h3 className="text-xl font-bold uppercase tracking-widest text-white">2. Squad Members</h3>
                                <button type="button" onClick={handleAddMember} className="text-sm bg-gaming-900 text-cyan-400 border border-cyan-500/50 px-3 py-1 rounded font-bold uppercase hover:bg-cyan-500/20">
                                    + Add Role
                                </button>
                            </div>

                            <div className="space-y-4">
                                {members.map((m, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gaming-900/50 p-4 rounded-lg border border-white/5 relative group">
                                        {idx > 0 && <button type="button" onClick={() => setMembers(members.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">X</button>}
                                        <div>
                                            <input type="text" placeholder="Member Name" value={m.name} onChange={e => updateMember(idx, 'name', e.target.value)} className="w-full bg-gaming-900 border border-white/20 rounded px-3 py-2 text-white text-sm focus:border-purple-500" />
                                        </div>
                                        <div>
                                            <input type="text" placeholder="Role/Position" value={m.role} onChange={e => updateMember(idx, 'role', e.target.value)} className="w-full bg-gaming-900 border border-white/20 rounded px-3 py-2 text-white text-sm focus:border-purple-500" />
                                        </div>
                                        <div>
                                            <input type="tel" placeholder="Phone (Opt)" value={m.phone} onChange={e => updateMember(idx, 'phone', e.target.value)} className="w-full bg-gaming-900 border border-white/20 rounded px-3 py-2 text-white text-sm focus:border-purple-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black italic tracking-widest text-xl uppercase py-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Transmitting Data...' : 'Lock In Registration'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TeamSetup;
