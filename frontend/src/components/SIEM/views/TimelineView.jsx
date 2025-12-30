import React from 'react';

const TimelineView = ({ timeline }) => {
    const getEventColor = (type) => {
        switch (type) {
            case 'malicious': return 'var(--siem-critical)';
            case 'suspicious': return 'var(--siem-high)';
            case 'info': return 'var(--siem-info)';
            default: return 'var(--siem-accent)';
        }
    };

    return (
        <>
            <div className="siem-panel-header">
                <div className="siem-panel-title">Timeline - {timeline.host}</div>
            </div>
            <div className="siem-panel-content">
                <div className="siem-timeline">
                    {timeline.events.map((event, idx) => (
                        <div key={idx} className="siem-timeline-event">
                            <div className="siem-timeline-time">{event.time}</div>
                            <div
                                className="siem-timeline-marker"
                                style={{ background: getEventColor(event.type) }}
                            />
                            <div className="siem-timeline-content">
                                <div style={{ marginBottom: '0.25rem', color: 'var(--siem-text-primary)' }}>
                                    {event.event}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--siem-text-dim)', textTransform: 'uppercase' }}>
                                    {event.type}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TimelineView;
