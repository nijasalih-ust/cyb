import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import NavigatorBot from "../NavigatorBot/NavigatorBot";

const Layout = () => {
    return (
        <div
            className="min-h-screen font-body transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            <Sidebar />

            <div className="ml-64 p-8 relative min-h-screen">
                {/* Top Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-purple/50 to-transparent" />
                
                {/* ROUTER INJECTS PAGE HERE */}
                <Outlet />
            </div>

            <NavigatorBot />
        </div>
    );
};

export default Layout;
