import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming backend has /dashboard endpoint as per FR
                // If not, we might need to use /navigator/command to get stats or constructing it.
                // The FR says "GET /api/dashboard/". 
                const response = await api.get('/dashboard/');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-cyber-blue animate-pulse p-4">Loading Neuro-Link...</div>;
    if (!stats) return null; // Or some fallback

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-900 border border-cyber-purple/30 p-4 rounded-xl">
                    <h3 className="text-gray-400 text-sm">Techniques Mastered</h3>
                    <p className="text-3xl font-bold text-cyber-blue">{stats.techniques_mastered || 0} <span className="text-sm text-gray-500">/ {stats.techniques_total || 201}</span></p>
                </div>
                <div className="bg-gray-900 border border-cyber-purple/30 p-4 rounded-xl">
                    <h3 className="text-gray-400 text-sm">Current Rank</h3>
                    <p className="text-3xl font-bold text-cyber-purple capitalize">{stats.current_tier || 'Skiddie'}</p>
                </div>
                <div className="bg-gray-900 border border-cyber-purple/30 p-4 rounded-xl">
                    <h3 className="text-gray-400 text-sm">Labs Completed</h3>
                    <p className="text-3xl font-bold text-green-400">{stats.labs_completed || 0}</p>
                </div>
                <div className="bg-gray-900 border border-cyber-purple/30 p-4 rounded-xl">
                    <h3 className="text-gray-400 text-sm">Time Active</h3>
                    <p className="text-3xl font-bold text-white">{stats.time_spent || '0h'}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
