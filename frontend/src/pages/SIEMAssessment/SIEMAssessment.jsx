import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scenarios } from '../../data/mockScenario';
import { Target, Shield, AlertTriangle } from 'lucide-react';

const SIEMAssessment = () => {
    const navigate = useNavigate();
    const [completedScenarios, setCompletedScenarios] = useState(new Set());

    const handleStartScenario = (scenarioId) => {
        navigate(`/siem/${scenarioId}`);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'from-green-500 to-green-600';
            case 'medium': return 'from-amber-500 to-amber-600';
            case 'hard': return 'from-red-500 to-red-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getIcon = (category) => {
        switch (category.toLowerCase()) {
            case 'discovery': return <Target size={20} />;
            case 'initial access': return <Shield size={20} />;
            default: return <AlertTriangle size={20} />;
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Incident Analysis</h1>
                <p className="text-gray-400">Overview of your current operational status and active missions.</p>
            </div>

            {/* Quick Actions Section */}
            <div className="mb-12">
                <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {scenarios.map((scenario) => {
                        const isCompleted = completedScenarios.has(scenario.id);

                        return (
                            <div
                                key={scenario.id}
                                onClick={() => handleStartScenario(scenario.id)}
                                className="group relative bg-cyber-card border border-cyber-border rounded-2xl p-6 hover:bg-cyber-card/80 transition-all duration-300 cursor-pointer hover:border-cyber-purple/50 hover:shadow-glow"
                            >
                                {/* Icon */}
                                <div className="mb-4 inline-flex p-3 rounded-xl bg-cyber-purple/10 text-cyber-purple group-hover:bg-cyber-purple/20 transition-colors">
                                    {getIcon(scenario.category)}
                                </div>

                                {/* Content */}
                                <h3 className="text-white font-semibold mb-2 text-base">
                                    {scenario.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {scenario.description}
                                </p>

                                {/* Metadata */}
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getDifficultyColor(scenario.difficulty)}`} />
                                        {scenario.difficulty}
                                    </span>
                                    <span>•</span>
                                    <span>{scenario.category}</span>
                                </div>

                                {/* Completed Badge */}
                                {isCompleted && (
                                    <div className="absolute top-4 right-4">
                                        <div className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded-md text-green-400 text-xs font-medium">
                                            ✓ Complete
                                        </div>
                                    </div>
                                )}

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber-purple/0 via-cyber-purple/0 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
                    <div className="text-3xl font-bold text-white mb-1">{scenarios.length}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Total Scenarios</div>
                </div>
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
                    <div className="text-3xl font-bold text-cyber-purple mb-1">{completedScenarios.size}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Completed</div>
                </div>
                <div className="bg-cyber-card border border-cyber-border rounded-xl p-6">
                    <div className="text-3xl font-bold text-cyber-blue mb-1">
                        {completedScenarios.size > 0
                            ? Math.round((completedScenarios.size / scenarios.length) * 100)
                            : 0}%
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Progress</div>
                </div>
            </div>
        </div>
    );
};

export default SIEMAssessment;
