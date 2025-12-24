import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative p-2.5 rounded-lg border transition-all duration-300 group hover:scale-105"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        boxShadow: theme === 'dark' 
          ? '0 0 12px rgba(168, 85, 247, 0.3)' 
          : '0 0 12px rgba(59, 130, 246, 0.3)'
      }}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
        }}
      />
      
      {/* Icon */}
      <div className="relative z-10 transition-transform duration-300 group-hover:rotate-12">
        {theme === 'dark' ? (
          <Sun 
            size={18} 
            className="drop-shadow-md"
            style={{ color: '#fbbf24' }}
          />
        ) : (
          <Moon 
            size={18} 
            className="drop-shadow-md"
            style={{ color: '#a855f7' }}
          />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;