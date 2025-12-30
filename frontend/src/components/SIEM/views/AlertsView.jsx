import React, { useState } from 'react';

const AlertsView = ({ alerts }) => {
    const [expandedAlert, setExpandedAlert] = useState(null);

    return (
        <>
            <div className="siem-panel-header">
                <div className="siem-panel-title">Active Alerts</div>
            </div>
            <div className="siem-panel-content">
                <table className="siem-table">
                    <thead>
                        <tr>
                            <th>Severity</th>
                            <th>Alert Name</th>
                            <th>Source</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.map(alert => (
                            <React.Fragment key={alert.id}>
                                <tr onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}>
                                    <td>
                                        <span className={`siem-severity-badge siem-severity-${alert.severity}`}>
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td>{alert.name}</td>
                                    <td>{alert.source}</td>
                                    <td style={{ fontFamily: 'var(--siem-font-mono)', fontSize: '0.8125rem' }}>
                                        {alert.time}
                                    </td>
                                </tr>
                                {expandedAlert === alert.id && (
                                    <tr>
                                        <td colSpan="4" style={{ background: 'var(--siem-bg-tertiary)', padding: '1rem' }}>
                                            <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Description:</div>
                                            <div style={{ marginBottom: '1rem', color: 'var(--siem-text-secondary)' }}>
                                                {alert.description}
                                            </div>
                                            <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Details:</div>
                                            <div style={{ fontFamily: 'var(--siem-font-mono)', fontSize: '0.8125rem', color: 'var(--siem-text-secondary)' }}>
                                                {Object.entries(alert.details).map(([key, value]) => (
                                                    <div key={key} style={{ marginBottom: '0.25rem' }}>
                                                        <span style={{ color: 'var(--siem-accent)' }}>{key}:</span> {value}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AlertsView;
