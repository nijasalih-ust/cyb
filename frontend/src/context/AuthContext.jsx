import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage and verify/fetch user details
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("cyblib_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Optimistically set user from storage first
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Fetch fresh user details to ensure username is correct
        if (parsedUser.access) {
          try {
            const response = await api.get("/users/me/", {
              headers: { Authorization: `Bearer ${parsedUser.access}` }
            });

            const updatedUser = {
              ...parsedUser,
              username: response.data.username,
              email: response.data.email
            };

            setUser(updatedUser);
            localStorage.setItem("cyblib_user", JSON.stringify(updatedUser));
          } catch (error) {
            console.error("Failed to refresh user profile", error);
            // If token is invalid, maybe logout? For now just keep local state or let api interceptor handle 401
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/token/", { email, password });

      const { access, refresh } = response.data;

      // Temporarily set token to allow authenticated request
      localStorage.setItem("cyblib_user", JSON.stringify({ access, refresh }));

      // Fetch full user details
      // We need to use the token we just got. api interceptor might pick it up from localStorage?
      // Or we can manually set header. 
      // Assuming api setup handles it if in localStorage. 
      // Safest: set token in api defaults or pass header.
      // Let's assume standard flow: save token -> request 'me'.

      // But wait, `api` service might read from localStorage.
      // Let's update user state with username.
      // If backend doesn't return username in token response (it usually doesn't), we must fetch it.

      // QUICK FIX: If the user just registered, we have username. If logging in, we need it.

      // Let's try to fetch /users/me/
      let username = "Analyst"; // Default
      try {
        // Manually setting header for this request since state might not be updated yet
        const meRes = await api.get("/users/me/", {
          headers: { Authorization: `Bearer ${access}` }
        });
        username = meRes.data.username;
      } catch (e) {
        console.warn("Could not fetch user details", e);
      }

      const userData = {
        email,
        username,
        access,
        refresh
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("cyblib_user", JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Login failed"
      };
    }
  };

  // Register function
  const register = async (email, username, password) => {
    try {
      await api.post("/user/register/", { email, username, password });
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed"
      };
    }
  }

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("cyblib_user");
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};