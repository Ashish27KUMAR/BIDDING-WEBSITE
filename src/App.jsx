import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

// Pages
import Landing from './pages/Landing';
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminHistory from './pages/AdminHistory';
import AdminHome from './pages/AdminHome';
import JoinRoom from './pages/JoinRoom';
import AuctionRoom from './pages/AuctionRoom';
import TeamSetup from './pages/TeamSetup';
import AdminEventResult from './pages/AdminEventResult';
import AdminSettings from './pages/AdminSettings';

import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';

const AppContent = ({ user }) => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/team-setup') || location.pathname.startsWith('/auction');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gaming-900 text-white selection:bg-cyan-500/30">
      {!hideNavbar && (user ? <AdminNavbar user={user} /> : <Navbar user={user} />)}

      <main className="flex-1 flex flex-col relative">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/admin-home" /> : <Landing />} />
          <Route path="/home" element={user ? <Navigate to="/admin-home" /> : <Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={user ? <Navigate to="/admin-home" /> : <Login />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/team-setup/:roomCode" element={<TeamSetup />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-home"
            element={user ? <AdminHome /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-dashboard"
            element={user ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-history"
            element={user ? <AdminHistory /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-result/:roomCode"
            element={user ? <AdminEventResult /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin-settings"
            element={user ? <AdminSettings /> : <Navigate to="/login" />}
          />

          {/* Shared Auction Room (Audience / Admin logic parsed inside) */}
          <Route path="/auction/:roomCode" element={<AuctionRoom />} />
        </Routes>
      </main>

      <ToastContainer theme="dark" position="bottom-right" toastClassName="bg-gaming-800 border border-white/10" />
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) return <div className="min-h-screen bg-gaming-900 flex items-center justify-center text-cyan-400 font-bold uppercase animate-pulse">Initializing Arena...</div>;

  return (
    <Router>
      <AppContent user={user} />
    </Router>
  );
};

export default App;
