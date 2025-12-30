import React from 'react';
import AlertsView from './views/AlertsView';
import RawLogsView from './views/RawLogsView';
import TimelineView from './views/TimelineView';
import MitreView from './views/MitreView';
import DashboardView from './views/DashboardView';

const MainPanel = ({ activeView, scenario, filteredLogs }) => {
    const renderView = () => {
        switch (activeView) {
            case 'alerts':
                return <AlertsView alerts={scenario.alerts} />;
            case 'logs':
                return <RawLogsView logs={filteredLogs} />;
            case 'timeline':
                return <TimelineView timeline={scenario.timeline} />;
            case 'mitre':
                return <MitreView />;
            case 'dashboards':
                return <DashboardView />;
            default:
                return <AlertsView alerts={scenario.alerts} />;
        }
    };

    return (
        <div className="siem-main-panel">
            {renderView()}
        </div>
    );
};

export default MainPanel;
