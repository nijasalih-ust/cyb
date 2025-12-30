import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SIEM.css';
import TopBar from './TopBar';
import LeftSidebar from './LeftSidebar';
import MainPanel from './MainPanel';
import QueryTerminal from './QueryTerminal';
import AnalystPanel from './AnalystPanel';
import ResultModal from './ResultModal';
import { scenarios } from '../../data/mockScenario';

const SIEM = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const scenarioId = parseInt(id, 10) || 1;
    const scenario = scenarios.find(s => s.id === scenarioId) || scenarios[0];

    const [activeView, setActiveView] = useState('alerts');
    const [filteredLogs, setFilteredLogs] = useState(scenario.logs);
    const [terminalExpanded, setTerminalExpanded] = useState(true);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);
    const [userResponse, setUserResponse] = useState(null);
    const [interactions, setInteractions] = useState({
        viewsVisited: new Set(['alerts']),
        queriesRun: [],
        timePerView: { alerts: 0 },
        evidenceExamined: [],
    });

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [startTime]);

    // Track view changes
    const handleViewChange = (view) => {
        setActiveView(view);
        setInteractions(prev => ({
            ...prev,
            viewsVisited: new Set([...prev.viewsVisited, view])
        }));
    };

    // Handle query execution
    const handleQueryExecute = (query, results) => {
        setInteractions(prev => ({
            ...prev,
            queriesRun: [...prev.queriesRun, { query, timestamp: new Date().toISOString() }]
        }));

        if (results) {
            setFilteredLogs(results);
        } else {
            setFilteredLogs(scenario.logs);
        }
    };

    // Handle end investigation (go back without submitting)
    const handleEndInvestigation = () => {
        const confirmed = window.confirm('End this investigation without submitting? Your work will not be saved.');
        if (confirmed) {
            navigate('/Siem_assessment');
        }
    };

    // Handle investigation submission
    const handleSubmitInvestigation = (response) => {
        const fullResponse = {
            ...response,
            scenarioId: scenario.id,
            timeSpent: elapsedTime,
            interactions: {
                viewsVisited: Array.from(interactions.viewsVisited),
                queriesRun: interactions.queriesRun.length
            }
        };

        setUserResponse(fullResponse);
        setShowResultModal(true);
    };

    // Handle modal close and navigation
    const handleModalClose = () => {
        setShowResultModal(false);
        navigate('/Siem_assessment');
    };

    // Format elapsed time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="siem-container">
            <TopBar
                scenario={scenario}
                elapsedTime={formatTime(elapsedTime)}
                onEndInvestigation={handleEndInvestigation}
            />

            <div className="siem-main-layout">
                <LeftSidebar
                    activeView={activeView}
                    onViewChange={handleViewChange}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <MainPanel
                        activeView={activeView}
                        scenario={scenario}
                        filteredLogs={filteredLogs}
                    />

                    <QueryTerminal
                        expanded={terminalExpanded}
                        onToggle={() => setTerminalExpanded(!terminalExpanded)}
                        logs={scenario.logs}
                        onQueryExecute={handleQueryExecute}
                    />
                </div>

                <AnalystPanel
                    scenario={scenario}
                    interactions={interactions}
                    onSubmit={handleSubmitInvestigation}
                />
            </div>

            {showResultModal && (
                <ResultModal
                    scenario={scenario}
                    userResponse={userResponse}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default SIEM;
