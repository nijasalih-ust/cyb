import React, { useState } from 'react';
import { mitreMatrix } from '../../data/mockScenario';

const AnalystPanel = ({ scenario, interactions, onSubmit }) => {
    const [formData, setFormData] = useState({
        indicators: '',
        evidence: '',
        mitreTechnique: '',
        assessment: '',
        nextAction: ''
    });

    const handleSubmit = () => {
        if (!formData.assessment || !formData.nextAction) {
            alert('Please complete Assessment and Next Action fields before submitting.');
            return;
        }

        // Call the onSubmit handler passed from parent
        onSubmit(formData);
    };

    // Get all MITRE techniques for dropdown
    const allTechniques = [];
    Object.values(mitreMatrix.techniques).forEach(tactics => {
        tactics.forEach(tech => {
            allTechniques.push(tech);
        });
    });

    return (
        <div className="siem-analyst-panel">
            {/* Task Prompt */}
            <div className="siem-analyst-section" style={{ background: 'var(--siem-bg-tertiary)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--siem-text-primary)' }}>
                    Investigation Task
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--siem-text-secondary)', lineHeight: '1.5' }}>
                    Investigate the alerts and determine whether the activity is malicious. Document your findings and recommend appropriate action.
                </div>
            </div>

            {/* Observed Indicators */}
            <div className="siem-analyst-section">
                <div className="siem-analyst-section-title">Observed Indicators</div>
                <textarea
                    className="siem-textarea"
                    placeholder="List suspicious patterns, anomalies, or IOCs observed..."
                    value={formData.indicators}
                    onChange={(e) => setFormData({ ...formData, indicators: e.target.value })}
                />
            </div>

            {/* Evidence Referenced */}
            <div className="siem-analyst-section">
                <div className="siem-analyst-section-title">Evidence Referenced</div>
                <textarea
                    className="siem-textarea"
                    placeholder="Alert IDs, log timestamps, or specific events used in analysis..."
                    value={formData.evidence}
                    onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                    style={{ minHeight: '60px' }}
                />
            </div>

            {/* MITRE Technique */}
            <div className="siem-analyst-section">
                <div className="siem-analyst-section-title">MITRE ATT&CK Technique</div>
                <select
                    className="siem-select"
                    value={formData.mitreTechnique}
                    onChange={(e) => setFormData({ ...formData, mitreTechnique: e.target.value })}
                >
                    <option value="">Select technique...</option>
                    {allTechniques.map(tech => (
                        <option key={tech.id} value={tech.id}>
                            {tech.id} - {tech.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Assessment */}
            <div className="siem-analyst-section">
                <div className="siem-analyst-section-title">Assessment</div>
                <div className="siem-radio-group">
                    <label className="siem-radio-label">
                        <input
                            type="radio"
                            name="assessment"
                            value="benign"
                            checked={formData.assessment === 'benign'}
                            onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                        />
                        Benign
                    </label>
                    <label className="siem-radio-label">
                        <input
                            type="radio"
                            name="assessment"
                            value="suspicious"
                            checked={formData.assessment === 'suspicious'}
                            onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                        />
                        Suspicious
                    </label>
                    <label className="siem-radio-label">
                        <input
                            type="radio"
                            name="assessment"
                            value="malicious"
                            checked={formData.assessment === 'malicious'}
                            onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                        />
                        Malicious
                    </label>
                </div>
            </div>

            {/* Next Action */}
            <div className="siem-analyst-section">
                <div className="siem-analyst-section-title">Next Action</div>
                <div className="siem-radio-group">
                    <label className="siem-radio-label">
                        <input
                            type="radio"
                            name="nextAction"
                            value="monitor"
                            checked={formData.nextAction === 'monitor'}
                            onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                        />
                        Monitor
                    </label>
                    <label className="siem-radio-label">
                        <input
                            type="radio"
                            name="nextAction"
                            value="close"
                            checked={formData.nextAction === 'close'}
                            onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                        />
                        Close as False Positive
                    </label>
                    <label className="siem-radio-label">
                        <input
                            type="radio"
                            name="nextAction"
                            value="escalate"
                            checked={formData.nextAction === 'escalate'}
                            onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                        />
                        Escalate
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <button
                className="siem-submit-btn"
                onClick={handleSubmit}
                disabled={!formData.assessment || !formData.nextAction}
            >
                Submit Investigation
            </button>
        </div>
    );
};

export default AnalystPanel;
