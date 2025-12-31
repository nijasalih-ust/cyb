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
    const [search, setSearch] = useState("");

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

    const filteredTechniques = techniques.filter(tech =>
        tech.name.toLowerCase().includes(search.toLowerCase()) ||
        tech.mitre_id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button
                onClick={() => navigate('/tactics-library')}
                className="flex items-center text-cyber-purple hover:text-cyber-purple/80 transition-colors gap-2 font-medium font-body"
            >
                <ChevronLeft size={20} /> Back to Tactics Library
            </button>

            <div>
                <h1 className="text-3xl font-display font-bold text-cyber-text-primary mb-2">Tactic Details</h1>
                <p className="text-cyber-text-secondary font-body">Browse techniques associated with this tactic.</p>
            </div>

            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search techniques..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 bg-cyber-card border border-cyber-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyber-purple text-cyber-text-primary placeholder-gray-500 font-body"
                />
            </div>

            {loading ? (
                <div className="text-cyber-blue animate-pulse font-mono">Decryption in progress...</div>
            ) : (
                <div className="space-y-4">
                    {filteredTechniques.length > 0 ? filteredTechniques.map((tech) => (
                        <button
                            key={tech.id}
                            onClick={() => navigate(`/techniques/${tech.mitre_id}`)}
                            className="w-full text-left bg-cyber-card border border-cyber-border/50 p-4 rounded-xl hover:border-cyber-purple/50 hover:bg-cyber-purple/5 transition-all group flex items-center justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-bold text-cyber-text-primary group-hover:text-cyber-purple transition-colors">
                                    {tech.name}
                                    <span className="ml-2 text-xs font-mono text-cyber-text-secondary">({tech.mitre_id})</span>
                                </h3>
                                <p className="text-sm text-cyber-text-secondary mt-1 line-clamp-1">{tech.description || "No preview available."}</p>
                            </div>
                            <ChevronLeft size={16} className="rotate-180 text-cyber-text-muted group-hover:text-cyber-purple transition-colors" />
                        </button>
                    )) : (
                        <div className="text-gray-500">No matching techniques found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TacticDetail;
