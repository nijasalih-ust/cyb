import React from 'react';

const DashboardView = () => {
    return (
        <>
            <div className="siem-panel-header">
                <div className="siem-panel-title">Security Dashboards</div>
            </div>
            <div className="siem-panel-content">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'var(--siem-text-dim)',
                    fontSize: '0.875rem'
                }}>
                    Dashboard view (visualization placeholder)
                </div>
            </div>
        </>
    );
};

export default DashboardView;
