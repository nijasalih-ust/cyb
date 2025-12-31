import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import learningService from '../../services/learningService';
import { ChevronLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import TechniqueViewer from '../../components/TechniqueViewer/TechniqueViewer';
import LessonViewer from '../../components/LessonViewer/LessonViewer';

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
            } catch (error) {
                console.error("Failed to load lesson mission data.");
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
                // navigate(-1); // Optional: Auto Navigate back
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
                className="bg-transparent"
            >
                {/* Lesson Viewer handles Title, Header, Content, and Key Indicators */}
                <LessonViewer
                    title={lesson.title}
                    content={lesson.content}
                    key_indicators={lesson.key_indicators}
                    duration={lesson.duration || "15 Minutes"}
                />

                {/* Techniques List (Kept external to LessonViewer as per design) */}
                {lesson.techniques && lesson.techniques.length > 0 && (
                    <div className="mt-8 bg-red-500/5 border border-red-500/20 p-6 rounded-xl">
                        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                            <ShieldCheck size={20} />
                            Associated Techniques
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {lesson.techniques.map((t, idx) => (
                                <TechniqueViewer
                                    key={idx}
                                    name={t.technique.name}
                                    mitre_id={t.technique.mitre_id}
                                    description={t.technique.description}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Area */}
                <div className="mt-8 flex justify-end border-t border-white/5 pt-6">
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
            </motion.div>
        </div>
    );
};

export default LessonDetail;
