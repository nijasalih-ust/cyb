import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Home,
    Shield,
    BookOpen,
    Database,
    LogOut,
    Terminal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/landing', icon: Home },
        { name: 'Mission Library', path: '/library', icon: BookOpen },
        { name: 'Threat Matrix', path: '/dictionary', icon: Database },
        { name: 'Assessment', path: '/assessment', icon: Shield },
    ];

    return (
        <div 
            className="h-screen w-64 border-r flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300"
            style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)'
            }}
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="p-2 rounded-lg bg-cyber-purple/20">
                    <Terminal className="text-cyber-purple" size={24} />
                </div>
                <div>
                    <h1 
                        className="text-xl font-bold font-display tracking-wide"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        CYB.LIB
                    </h1>
                    <p 
                        className="text-[10px] tracking-widest uppercase"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        Security Operations
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 py-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                                ${isActive
                                    ? 'bg-cyber-purple/10 border border-cyber-purple/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                                    : 'hover:bg-white/5'}
                            `}
                            style={{
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                            }}
                        >
                            <item.icon
                                size={20}
                                className={`transition-colors ${isActive ? 'text-cyber-purple' : 'text-gray-500 group-hover:text-cyber-purple'}`}
                            />
                            <span className="font-medium text-sm">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-purple shadow-[0_0_5px_rgba(124,58,237,1)]" />
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User & Actions */}
            <div 
                className="p-4 border-t transition-colors duration-300"
                style={{
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)'
                }}
            >
                {/* User Info Row with Theme Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center text-white font-bold text-xs">
                            {user?.username?.substring(0, 2).toUpperCase() || 'AN'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p 
                                className="text-sm font-medium truncate"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {user?.username || 'Analyst'}
                            </p>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </p>
                        </div>
                    </div>
                    
                    {/* Theme Toggle Button */}
                    <ThemeToggle />
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                    <span>Disconnect</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;