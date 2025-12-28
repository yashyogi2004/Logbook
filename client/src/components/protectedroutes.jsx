<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';

const ProtectedRoutes = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_URL}/currentuser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // send cookies
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error while checking auth:", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold">Checking authentication...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
>>>>>>> a528fd3f4801dc640c1d5ae12975bae9ead54d80
