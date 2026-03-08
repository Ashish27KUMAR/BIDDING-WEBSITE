import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    getDocs,
    onSnapshot,
    serverTimestamp,
    deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/config";

export const createAuctionEvent = async (name, gameType, maxTeams, budgetPerTeam, budgetUnit, targetPlayersPerTeam, creatorUid, sheetUrl = "") => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    let multiplier = 1;
    if (budgetUnit === 'Lakhs') multiplier = 100000;
    else if (budgetUnit === 'Crores') multiplier = 10000000;

    const roomRef = doc(db, "auctions", roomCode);
    await setDoc(roomRef, {
        roomCode,
        name,
        gameType,
        maxTeams: parseInt(maxTeams),
        budgetPerTeam: parseFloat(budgetPerTeam) * multiplier,
        budgetUnit,
        targetPlayersPerTeam: parseInt(targetPlayersPerTeam) || 0,
        creatorUid,
        status: "setup",
        currentBid: 0,
        currentPlayerId: null,
        createdAt: serverTimestamp(),
    });

    return roomCode;
};

export const listenToAdminAuctions = (uid, callback) => {
    const q = query(collection(db, "auctions"), where("creatorUid", "==", uid));
    return onSnapshot(q, (snapshot) => {
        const auctions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        auctions.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        callback(auctions);
    });
};

export const startLiveAuction = async (roomCode) => {
    const roomRef = doc(db, "auctions", roomCode);
    await updateDoc(roomRef, { status: "active" });
};

export const endAuction = async (roomCode) => {
    const roomRef = doc(db, "auctions", roomCode);
    await updateDoc(roomRef, { status: "ended" });
};

export const addTeamToAuction = async (roomCode, teamData) => {
    const teamsRef = collection(db, "auctions", roomCode, "teams");
    const docRef = await addDoc(teamsRef, {
        ...teamData,
        remainingBudget: teamData.fixedBudget,
        playersBought: 0
    });
    return docRef.id;
};

export const addPlayerToAuction = async (roomCode, playerData) => {
    const playersRef = collection(db, "auctions", roomCode, "players");
    const docRef = await addDoc(playersRef, {
        ...playerData,
        status: "pending",
        soldTo: null,
        soldPrice: 0
    });
    return docRef.id;
};

// --- REAL-TIME PORTAL ---
export const listenToAuction = (roomCode, callback) => {
    const roomRef = doc(db, "auctions", roomCode);
    return onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        } else {
            callback(null);
        }
    });
};

export const listenToTeams = (roomCode, callback) => {
    const teamsRef = collection(db, "auctions", roomCode, "teams");
    return onSnapshot(teamsRef, (snapshot) => {
        const teams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(teams);
    });
};

export const listenToPlayers = (roomCode, callback) => {
    const playersRef = collection(db, "auctions", roomCode, "players");
    return onSnapshot(playersRef, (snapshot) => {
        const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(players);
    });
};

// --- CORE BIDDING ---
export const setCurrentPlayer = async (roomCode, playerId) => {
    const roomRef = doc(db, "auctions", roomCode);
    const playerRef = doc(db, "auctions", roomCode, "players", playerId);

    const playersQuery = query(collection(db, "auctions", roomCode, "players"), where("status", "==", "in-auction"));
    const activePlayers = await getDocs(playersQuery);
    activePlayers.forEach(async (pDoc) => {
        await updateDoc(doc(db, "auctions", roomCode, "players", pDoc.id), { status: "pending" });
    });

    await updateDoc(playerRef, { status: "in-auction" });
    await updateDoc(roomRef, {
        currentPlayerId: playerId,
        currentBid: 0
    });
};

export const updateCurrentBid = async (roomCode, newBid) => {
    const roomRef = doc(db, "auctions", roomCode);
    await updateDoc(roomRef, { currentBid: newBid });
};

export const sellPlayer = async (roomCode, playerId, teamId, price, sheetUrl = "") => {
    const playerRef = doc(db, "auctions", roomCode, "players", playerId);
    const teamRef = doc(db, "auctions", roomCode, "teams", teamId);
    const roomRef = doc(db, "auctions", roomCode);

    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) throw new Error("Team not found");
    const teamBudget = teamSnap.data().remainingBudget;
    const teamName = teamSnap.data().name;

    if (teamBudget < price) throw new Error("Insufficient budget");

    await updateDoc(playerRef, {
        status: "sold",
        soldTo: teamId,
        soldPrice: price
    });

    await updateDoc(teamRef, {
        remainingBudget: teamBudget - price,
        playersBought: teamSnap.data().playersBought + 1
    });

    const playerSnap = await getDoc(playerRef);

    await updateDoc(roomRef, {
        currentPlayerId: null,
        currentBid: 0
    });
};

export const markPlayerUnsold = async (roomCode, playerId) => {
    const playerRef = doc(db, "auctions", roomCode, "players", playerId);
    const roomRef = doc(db, "auctions", roomCode);

    await updateDoc(playerRef, { status: "unsold" });
    await updateDoc(roomRef, {
        currentPlayerId: null,
        currentBid: 0
    });
};

export const deleteAuctionEvent = async (roomCode) => {
    try {
        const playersRef = collection(db, "auctions", roomCode, "players");
        const teamsRef = collection(db, "auctions", roomCode, "teams");

        const playerSnap = await getDocs(playersRef);
        const deletePlayerPromises = playerSnap.docs.map(dSnap => deleteDoc(doc(db, "auctions", roomCode, "players", dSnap.id)));
        await Promise.all(deletePlayerPromises);

        const teamSnap = await getDocs(teamsRef);
        const deleteTeamPromises = teamSnap.docs.map(dSnap => deleteDoc(doc(db, "auctions", roomCode, "teams", dSnap.id)));
        await Promise.all(deleteTeamPromises);

        await deleteDoc(doc(db, "auctions", roomCode));
    } catch (e) {
        console.error("Error deleting event:", e);
        throw e;
    }
};
