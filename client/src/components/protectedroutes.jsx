import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking

    useEffect(() => {
        const checkAuth = async () => {
            // 1. First, check LocalStorage (Fastest)
            const localUser = localStorage.getItem("admin");
            
            if (localUser) {
                setIsAuthenticated(true);
                return;
            }

            // 2. If no LocalStorage, check with Server (Handles Google Login / Persistent Cookies)
            try {
                const res = await fetch(`${import.meta.env.VITE_URL}/userProfile`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // Send the Cookie!
                });

                if (res.ok) {
                    // Success! We have a valid cookie.
                    const data = await res.json();
                    // Save to LocalStorage so we don't need to check API next time
                    localStorage.setItem("admin", JSON.stringify(data));
                    setIsAuthenticated(true);
                } else {
                    // No valid session
                    localStorage.removeItem("admin");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // 3. Show a spinner while we check (prevents flickering)
    if (isAuthenticated === null) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#f7f8fa]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B8D9]"></div>
            </div>
        );
    }

    // 4. Redirect if failed
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 5. Render Page if success
    return children;
};

export default ProtectedRoutes;