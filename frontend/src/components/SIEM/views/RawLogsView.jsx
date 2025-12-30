import React from 'react';

const RawLogsView = ({ logs }) => {
    return (
        <>
            <div className="siem-panel-header">
                <div className="siem-panel-title">Raw Event Logs</div>
            </div>
            <div className="siem-panel-content">
                <div className="siem-logs-container">
                    {/* Header */}
                    <div className="siem-log-entry" style={{ fontWeight: '600', borderBottom: '2px solid var(--siem-border)', paddingBottom: '0.75rem' }}>
                        <div className="siem-log-field">Timestamp</div>
                        <div className="siem-log-field">Host</div>
                        <div className="siem-log-field">User</div>
                        <div className="siem-log-field">Source IP</div>
                        <div className="siem-log-field">Dest IP</div>
                        <div className="siem-log-field">Event Type</div>
                        <div className="siem-log-field">Message</div>
                    </div>

                    {/* Log entries */}
                    {logs.map((log, idx) => (
                        <div key={idx} className="siem-log-entry">
                            <div className="siem-log-field siem-log-timestamp">{log.timestamp}</div>
                            <div className="siem-log-field siem-log-host">{log.host}</div>
                            <div className="siem-log-field siem-log-user">{log.user}</div>
                            <div className="siem-log-field siem-log-ip">{log.srcIP}</div>
                            <div className="siem-log-field siem-log-ip">{log.dstIP}</div>
                            <div className="siem-log-field">{log.eventType}</div>
                            <div className="siem-log-field" title={log.message}>{log.message}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default RawLogsView;
