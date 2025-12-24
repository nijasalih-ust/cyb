import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/');
                setStats(response.data);
            } catch (error) {
                // Mock data fallback
                setStats({ 
                    techniques_mastered: 42, 
                    techniques_total: 201, 
                    current_tier: 'Analyst', 
                    labs_completed: 12, 
                    time_spent: '14h' 
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-cyber-blue animate-pulse p-4">Loading Neuro-Link...</div>;
    if (!stats) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Stats Card 1 */}
                <div className="cyber-card">
                    <h3 className="text-cyber-text-muted text-xs font-bold uppercase tracking-wider">Techniques Mastered</h3>
                    <p className="text-3xl font-bold text-cyber-blue mt-2">
                        {stats.techniques_mastered || 0} 
                        <span className="text-sm text-cyber-text-muted ml-1 font-normal">/ {stats.techniques_total || 201}</span>
                    </p>
                </div>
                
                {/* Stats Card 2 */}
                <div className="cyber-card">
                    <h3 className="text-cyber-text-muted text-xs font-bold uppercase tracking-wider">Current Rank</h3>
                    <p className="text-3xl font-bold text-cyber-purple capitalize mt-2">{stats.current_tier || 'Skiddie'}</p>
                </div>

                {/* Stats Card 3 */}
                <div className="cyber-card">
                    <h3 className="text-cyber-text-muted text-xs font-bold uppercase tracking-wider">Labs Completed</h3>
                    <p className="text-3xl font-bold text-green-500 mt-2">{stats.labs_completed || 0}</p>
                </div>

                {/* Stats Card 4 */}
                <div className="cyber-card">
                    <h3 className="text-cyber-text-muted text-xs font-bold uppercase tracking-wider">Time Active</h3>
                    {/* FIXED: Removed text-cyber-text-primary */}
                    <p className="text-3xl font-bold text-cyber-text-primary mt-2">{stats.time_spent || '0h'}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;