import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import learningService from '../../services/learningService';
import { ChevronLeft, CheckCircle, Lock, Play } from 'lucide-react';

const PathDetail = () => {
    const { id } = useParams(); // Using 'id' matching the route param (we should change App.jsx to use :id or handle slug)
    const navigate = useNavigate();
    const [pathData, setPathData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPath = async () => {
            try {
                // If the route passes a slug, we need to handle that. 
                // For now, let's assume the ID is passed or the service handles slug.
                // The Library passes path.slug. Backend 'paths/<pk>/' expects UUID usually.
                // We might need to adjust backend to look up by slug OR frontend to pass ID.
                // Let's check Library.jsx again. It passes path.slug. 
                // Does backend support slug lookup? PathDetail view uses 'pk'. 
                // We should change Library.jsx to pass path.id instead of slug for simplicity.
                const data = await learningService.getPathDetail(id);
                setPathData(data);
            } catch (error) {
                console.error("Failed to load path details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPath();
    }, [id]);

    if (loading) return <div className="text-cyber-blue animate-pulse p-8">Loading mission data...</div>;
    if (!pathData) return <div className="text-red-500 p-8">Mission data not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <button
                onClick={() => navigate('/library')}
                className="flex items-center text-gray-400 hover:text-cyber-blue transition-colors gap-2"
            >
                <ChevronLeft size={20} /> Back to Library
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyber-card border border-cyber-border rounded-xl2 p-8"
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">{pathData.title}</h1>
                        <p className="text-gray-400 max-w-2xl">{pathData.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-cyber-purple font-mono text-xl font-bold">{pathData.modules?.length || 0} Modules</span>
                        <span className="text-cyber-muted text-sm">{pathData.total_duration || '2H 30M'}</span>
                    </div>
                </div>

                {/* Modules List */}
                <div className="space-y-4">
                    {pathData.modules && pathData.modules.map((module, index) => (
                        <div key={module.id} className="bg-black/20 rounded-xl p-4 border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-4">Module {index + 1}: {module.title || 'Untitled Module'}</h3>
                            <div className="space-y-2">
                                {module.lessons && module.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        onClick={() => navigate(`/lessons/${lesson.id}`)}
                                        className="flex items-center justify-between p-3 bg-black/40 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue">
                                                <Play size={14} />
                                            </div>
                                            <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{lesson.title}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono">15 MIN</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default PathDetail;
