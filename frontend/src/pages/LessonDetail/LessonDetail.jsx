import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import learningService from '../../services/learningService';
import { ChevronLeft, CheckCircle, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import TechniqueViewer from '../../components/TechniqueViewer/TechniqueViewer';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const data = await learningService.getLesson(id);
                setLesson(data);
                // Check if already completed? Data might need to include this.
                // For now, local state 'completed' is false unless user clicks complete.
            } catch (error) {
                console.error("Failed to load lesson inintel.");
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    const handleComplete = async () => {
        setCompleting(true);
        try {
            await learningService.completeLesson(id);
            setCompleted(true);
            setTimeout(() => {
                // navigate(-1); // Go back to Path
            }, 1000);
        } catch (error) {
            console.error("Failed to complete mission.");
        } finally {
            setCompleting(false);
        }
    };

    if (loading) return <div className="text-cyber-blue animate-pulse p-8">Establishing Uplink...</div>;
    if (!lesson) return <div className="text-red-500 p-8">Mission Data Corrupted.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-cyber-text-secondary hover:text-cyber-blue transition-colors gap-2"
            >
                <ChevronLeft size={20} /> Abort / Back
            </button>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-cyber-card border border-cyber-border rounded-xl2 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-black/40 p-8 border-b border-cyber-border/50">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-cyber-purple/20 text-cyber-purple text-xs font-mono font-bold rounded border border-cyber-purple/30">
                            TRAINING MODULE
                        </span>
                        <span className="text-gray-500 font-mono text-xs">ID: {lesson.id.split('-')[0]}</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-cyber-text-primary mb-4">{lesson.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-cyber-text-secondary">
                        <div className="flex items-center gap-2">
                            <Terminal size={16} className="text-cyber-blue" />
                            <span>Interactive Lab</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-cyber-purple" />
                            <span>15 Minutes</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{lesson.content}</ReactMarkdown>
                    </div>

                    
                    {lesson.techniques && lesson.techniques.length > 0 && (
                        <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                                <ShieldCheck size={20} />
                                MITRE ATT&CK Techniques
                            </h3>
                            <div className="space-y-2">
                                {lesson.techniques.map((t, idx) => (
                                                        <TechniqueViewer name={t.technique.name} mitre_id={t.technique.mitre_id} description={t.technique.description} />
                                ))}
                            </div>
                        </div>
                    )}

                    {lesson.key_indicators && (
                        <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center gap-2">
                                <ShieldCheck size={20} />
                                Key Indicators
                            </h3>
                            <p className="text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-line">
                                {lesson.key_indicators}
                            </p>
                        </div>
                    )}

                    {/* Action Area */}
                    <div className="pt-8 border-t border-white/5 flex justify-end">
                        {completed ? (
                            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 px-6 py-3 rounded-lg border border-green-500/20">
                                <CheckCircle size={20} />
                                Mission Accomplished
                            </div>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-black transition-all transform hover:scale-105
                                    ${completing ? 'bg-gray-500 cursor-not-allowed' : 'bg-cyber-blue hover:bg-white hover:shadow-glow-blue'}`}
                            >
                                {completing ? 'Uploading Report...' : 'Complete Mission'}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LessonDetail;
