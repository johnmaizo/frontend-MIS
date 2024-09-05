/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // BroadcastChannel to sync logout across tabs
  const bc = new BroadcastChannel("auth");

  // Handle logout (including session expiration scenario)
  const handleLogout = (isSessionExpired = false) => {
    if (isSessionExpired && !isLoggingOut) {
      setSessionExpired(false);
      toast.error("Session expired, please login again!");
    } else {
      toast.success("Logged out successfully!");
    }
    setIsLoggingOut(false);
    logout();
    bc.postMessage("logout");
    <Navigate to="/auth/signin" />;
  };

  // Fetch user data if token exists
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      fetchUser(storedToken)
        .then((userData) => {
          setUser(userData);
          startTokenExpiryTimer(storedToken);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          setLoading(false);
          localStorage.removeItem("jwtToken");
        });
    } else {
      setLoading(false);
    }

    // Listen for broadcast logout from other tabs
    bc.onmessage = (event) => {
      if (event.data === "logout") {
        logout();
      }
    };

    return () => {
      bc.close();
    };
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get("/accounts/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  let expiryTimer;

  const startTokenExpiryTimer = (token) => {
    if (expiryTimer) {
      clearTimeout(expiryTimer);
    }
    const { exp } = jwtDecode(token);
    const expiryTime = exp * 1000 - Date.now();

    // Automatically refresh token 5 minutes before expiry
    expiryTimer = setTimeout(
      () => {
        if (!isLoggingOut) {
          refreshToken();
        }
      },
      expiryTime - 5 * 60 * 1000,
    );
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/accounts/authenticate", {
        email,
        password,
      });
      const { jwtToken, ...userData } = response.data;

      localStorage.setItem("jwtToken", jwtToken);
      setUser(userData);
      startTokenExpiryTimer(jwtToken);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = (isSessionExpired = false) => {
    clearTimeout(expiryTimer);
    localStorage.removeItem("jwtToken");
    setUser(null);
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post("/accounts/refresh-token");

      localStorage.setItem("jwtToken", response.data.jwtToken);
      setUser((prevUser) => ({ ...prevUser, ...response.data }));
      startTokenExpiryTimer(response.data.jwtToken);
    } catch (error) {
      console.error("Refresh token error:", error);
      logout();
    }
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshToken,
        isAuthenticated,
        sessionExpired,
        isLoggingOut,
        setIsLoggingOut,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
