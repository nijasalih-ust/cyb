import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth(); // Assuming useAuth exposes loading

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-cyber-blue font-mono">
        <div className="w-12 h-12 border-4 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mb-4" />
        <span className="animate-pulse">Establishing Uplink...</span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
