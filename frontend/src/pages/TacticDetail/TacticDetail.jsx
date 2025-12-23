import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import frameworkService from '../../services/frameworkService';
import { ChevronLeft, Shield, AlertTriangle } from 'lucide-react';
import TechniqueViewer from '../../components/TechniqueViewer/TechniqueViewer';

const TacticDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [techniques, setTechniques] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTechniques = async () => {
            try {
                const data = await frameworkService.getTechniquesByTactic(id);
                setTechniques(data || []);
            } catch (error) {
                console.error("Failed to load techniques");
            } finally {
                setLoading(false);
            }
        };
        fetchTechniques();
    }, [id]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/dictionary')}
                className="flex items-center text-gray-400 hover:text-cyber-blue transition-colors gap-2"
            >
                <ChevronLeft size={20} /> Back to Matrix
            </button>

            <h1 className="text-3xl font-display font-bold text-white mb-2">Tactic Analysis</h1>

            {loading ? (
                <div className="text-cyber-blue animate-pulse">Decryption in progress...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {techniques.length > 0 ? techniques.map((tech) => (
                        <div key={tech.id} className="bg-cyber-card border border-cyber-border/50 p-6 rounded-xl hover:border-cyber-purple/50 transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400 mt-1">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <TechniqueViewer name={tech.name} mitre_id={tech.mitre_id} description={tech.description} />
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-gray-500 col-span-2">No techniques linked to this tactic in the database.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TacticDetail;
