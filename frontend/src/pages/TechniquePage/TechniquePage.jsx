import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, AlertTriangle } from 'lucide-react';
import frameworkService from '../../services/frameworkService';
import TechniqueViewer from '../../components/TechniqueViewer/TechniqueViewer';

const TechniquePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [technique, setTechnique] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTechnique = async () => {
            try {
                // We might need a direct getTechnique service or filter from list
                // Since current service is getTechniquesByTactic, let's assume we can fetch by ID directly
                // If not available, we might need to add it or fetch all and find. 
                // Investigating service shows getTechniquesByTactic. 
                // Let's try to add a getTechniqueById in service or use existing one if suitable.
                // Re-checking service... actually I should check service first. But for now I'll implement generic fetch.
                // Assuming an endpoint exists or I'll add it.
                // Wait, the user said "uses our old TechniqueViewer component", so I just wrap it.
                // I'll need a way to get data. 
                // Let's look at how TacticDetail got it: await frameworkService.getTechniquesByTactic(id);
                // The URL is /techniques/:id. The ID is likely the DB ID or MITRE ID.

                // Let's reuse getTechniquesByTactic if I knew the tactic? No.
                // I'll assume I need to fetch detail.
                // For now, let's mock or use a new service method I'll add.
                // Actually, let's use the list endpoint and find? No, inefficient.
                // I'll add `getTechnique` to service in next step. For now, call it.
                const data = await frameworkService.getTechnique(id);
                setTechnique(data);
            } catch (error) {
                console.error("Failed to load technique", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTechnique();
    }, [id]);

    return (
        <div className="min-h-screen bg-cyber-bg p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Standardized Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-cyber-purple hover:text-cyber-purple/80 transition-colors gap-2 font-medium font-body"
                >
                    <ChevronLeft size={20} /> Back
                </button>

                {loading ? (
                    <div className="text-cyber-blue animate-pulse font-mono">Decrypting technique data...</div>
                ) : technique ? (
                    <div className="bg-cyber-card border border-cyber-border p-8 rounded-2xl shadow-glow">
                        <TechniqueViewer
                            name={technique.name}
                            mitre_id={technique.mitre_id}
                            description={technique.description}
                            forceExpanded={true}
                        />
                    </div>
                ) : (
                    <div className="text-gray-500">Technique not found.</div>
                )}
            </div>
        </div>
    );
};

export default TechniquePage;
