import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import ProtectedRoutes from './components/ProtectedRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/home';
import AboutUs from './pages/about-us';
import Contact from './pages/contact';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import User from './pages/user';
import CreateLog from './pages/createLog';
import Profile from './pages/profile';
import NotFound from './pages/Error';
import ForgotPassword from './pages/forgot-password';

const apiBaseUrl = 'http://localhost:5000';
const CONSENT_COOKIE_KEY = 'cookie_consent_accepted';

const CookieBanner = ({ isConsentGiven, handleAcceptCookies }) => {
  if (isConsentGiven) return null;

  return (
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
    </div>
  );
};

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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/user/:id"
            element={
              <ProtectedRoutes>
                <User Logout={handleLogout} />
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
            path="/profile"
            element={
              <ProtectedRoutes>
                <Profile Logout={handleLogout} />
              </ProtectedRoutes>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner isConsentGiven={isConsentGiven} handleAcceptCookies={handleAcceptCookies} />
    </>
  );
};

const App = () => {
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
  };

  return (
    <BrowserRouter>
      <AppRoutes
        handleLogout={handleLogout}
        isConsentGiven={isConsentGiven}
        handleAcceptCookies={handleAcceptCookies}
      />
    </BrowserRouter>
  );
};

export default App;