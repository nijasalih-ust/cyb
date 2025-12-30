import React from 'react';

const TopBar = ({ scenario, elapsedTime, onEndInvestigation }) => {
    return (
        <div className="siem-topbar">
            <div className="siem-topbar-left">
                <div className="siem-scenario-title">{scenario.title}</div>
                <div className="siem-scenario-counter">
                    Scenario {scenario.currentScenario} / {scenario.totalScenarios}
                </div>
                <div className="siem-timer">{elapsedTime}</div>
            </div>

            <button className="siem-end-btn" onClick={onEndInvestigation}>
                End Investigation
            </button>
        </div>
    );
};

export default TopBar;
