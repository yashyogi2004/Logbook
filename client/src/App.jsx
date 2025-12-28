<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

// --- Auth & Core Components ---
import ProtectedRoutes from './components/protectedroutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatWidget from './components/AIChatWidget';
import Sidebar from './components/Sidebar';

// --- Pages ---
import Home from './pages/home';
import AboutUs from './pages/about-us';
import Contact from './pages/contact';
import Pricing from './pages/pricing';
import Features from './pages/Features';
=======
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import ProtectedRoutes from './components/ProtectedRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/home';
import AboutUs from './pages/about-us';
import Contact from './pages/contact';
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
import Login from './pages/login';
import Register from './pages/register';
import NotFound from './pages/Error';
<<<<<<< HEAD
import ForgotPassword from './pages/forget-password';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResetPassword from "./pages/ResetPassword";
import Settings from './pages/Settings';

// --- App Pages (Protected) ---
import Dashboard from './pages/dashboard';
import Feed from './pages/Feed';
import LogDetails from './pages/LogDetails';
import CreateLog from './pages/createLog';
import EditLog from './pages/editLog';
import Profile from './pages/profile';
import Explore from './pages/Explore';

// --- User Profile Components ---
import User from './pages/user'; 

const CONSENT_COOKIE_KEY = 'cookie_consent_accepted';

// --- Cookie Banner ---
=======
import ForgotPassword from './pages/forgot-password';

const apiBaseUrl = 'http://localhost:5000';
const CONSENT_COOKIE_KEY = 'cookie_consent_accepted';

>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
const CookieBanner = ({ isConsentGiven, handleAcceptCookies }) => {
  if (isConsentGiven) return null;

  return (
<<<<<<< HEAD
    <div className="fixed bottom-0 w-full bg-[#212529] text-white p-4 text-center z-[1000] shadow-2xl border-t border-gray-700 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        <p className="text-sm text-gray-300">
          This website uses cookies to ensure you get the best experience on our Logbook platform.
        </p>
        <button
          onClick={handleAcceptCookies}
          className="px-6 py-2 bg-[#00B8D9] hover:bg-[#009fb8] text-white font-bold rounded-lg text-sm transition-colors shadow-lg"
        >
          I Understand
        </button>
      </div>
=======
    <div style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: '#333',
      color: 'white',
      padding: '10px 20px',
      textAlign: 'center',
      zIndex: 1000
    }}>
      <p style={{ margin: 0 }}>
        This website uses cookies to ensure you get the best experience.
        <button
          onClick={handleAcceptCookies}
          style={{
            marginLeft: '15px',
            padding: '5px 10px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          I Understand
        </button>
      </p>
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
    </div>
  );
};

<<<<<<< HEAD
const AppRoutes = ({ handleLogout }) => {
  const location = useLocation();

  // Hide navbar/footer on these paths:
  const hideNavbarPrefixes = ['/dashboard', '/feed', '/addlog', '/editlog', '/viewlog', '/profile', '/explore', '/settings', '/user'];
  const shouldHideNavbar = hideNavbarPrefixes.some(prefix => location.pathname.startsWith(prefix));

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
      {!shouldHideNavbar && <Navbar Logout={handleLogout} />}

      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features Logout={handleLogout} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/settings" element={<Settings />} />

          {/* -- PUBLIC user profile -- */}
          <Route path="/users/:id" element={<User />} />

          {/* --- Protected Routes --- */}
=======
const AppRoutes = ({ handleLogout, isConsentGiven, handleAcceptCookies }) => {
  const location = useLocation();
  const hideNavbarRoutes = ['/dashboard'];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar Logout={handleLogout} />}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          <Route
<<<<<<< HEAD
            path="/feed"
            element={
              <ProtectedRoutes>
                <Feed Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoutes>
                <Explore Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/viewlog/:id"
            element={
              <ProtectedRoutes>
                <LogDetails />
=======
            path="/user/:id"
            element={
              <ProtectedRoutes>
                <User Logout={handleLogout} />
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
              </ProtectedRoutes>
            }
          />
          <Route
            path="/addlog"
            element={
              <ProtectedRoutes>
                <CreateLog Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          <Route
<<<<<<< HEAD
            path="/editlog/:id"
            element={
              <ProtectedRoutes>
                <EditLog Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          {/* -- PRIVATE user profile (yourself) -- */}
          <Route
=======
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
            path="/profile"
            element={
              <ProtectedRoutes>
                <Profile Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
<<<<<<< HEAD
          {/* Settings (protected variant) */}
          <Route
            path="/Settings"
            element={
              <ProtectedRoutes>
                <Settings Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoutes>
                <User Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!shouldHideNavbar && <Footer />}
    </div>
=======
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner isConsentGiven={isConsentGiven} handleAcceptCookies={handleAcceptCookies} />
    </>
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
  );
};

const App = () => {
<<<<<<< HEAD
  // --- Cookie Consent Banner State ---
  const [isConsentGiven, setIsConsentGiven] = useState(Cookies.get(CONSENT_COOKIE_KEY) === 'true');

  const handleAcceptCookies = () => {
    Cookies.set(CONSENT_COOKIE_KEY, 'true', { expires: 365, secure: true, sameSite: 'Strict' });
    setIsConsentGiven(true);
  };

  // --- LOGOUT LOGIC: Best Practice ---
  const handleLogout = async () => {
    localStorage.removeItem("admin");
    sessionStorage.clear();
    try {
      await fetch(`${import.meta.env.VITE_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch (err) { /* ignore errors for API logout */ }
    window.location.href = "/login";
=======
  const isConsentGiven = Cookies.get(CONSENT_COOKIE_KEY) === 'true';

  const handleAcceptCookies = () => {
    Cookies.set(CONSENT_COOKIE_KEY, 'true', { expires: 365, secure: true, sameSite: 'Strict' });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/logout`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
  };

  return (
    <BrowserRouter>
<<<<<<< HEAD
      <AIChatWidget />
      <AppRoutes handleLogout={handleLogout} />
      <CookieBanner isConsentGiven={isConsentGiven} handleAcceptCookies={handleAcceptCookies} />
=======
      <AppRoutes
        handleLogout={handleLogout}
        isConsentGiven={isConsentGiven}
        handleAcceptCookies={handleAcceptCookies}
      />
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
    </BrowserRouter>
  );
};

export default App;