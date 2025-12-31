import React from 'react';

const LeftSidebar = ({ activeView, onViewChange }) => {
    const navItems = [
        { id: 'alerts', label: 'Alerts' },
        { id: 'logs', label: 'Raw Logs' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'dashboards', label: 'Dashboards' },
        { id: 'mitre', label: 'MITRE ATT&CK' },
    ];

    return (
        <div className="siem-sidebar">
            {navItems.map(item => (
                <div
                    key={item.id}
                    className={`siem-nav-item ${activeView === item.id ? 'active' : ''}`}
                    onClick={() => onViewChange(item.id)}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );
};

export default LeftSidebar;
