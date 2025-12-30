import React from 'react';
import { mitreMatrix } from '../../../data/mockScenario';

const MitreView = () => {
    return (
        <>
            <div className="siem-panel-header">
                <div className="siem-panel-title">MITRE ATT&CK Framework</div>
            </div>
            <div className="siem-panel-content">
                <div className="siem-mitre-matrix">
                    <table className="siem-mitre-table">
                        <thead>
                            <tr>
                                {mitreMatrix.tactics.map(tactic => (
                                    <th key={tactic} className="siem-mitre-tactic">
                                        {tactic}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {mitreMatrix.tactics.map(tactic => (
                                    <td key={tactic} className="siem-mitre-technique">
                                        {mitreMatrix.techniques[tactic] ? (
                                            <div>
                                                {mitreMatrix.techniques[tactic].map(tech => (
                                                    <div
                                                        key={tech.id}
                                                        style={{ marginBottom: '0.5rem', cursor: 'help' }}
                                                        title={`${tech.id}: ${tech.name}`}
                                                    >
                                                        <div style={{ fontWeight: '600', color: 'var(--siem-accent)', fontSize: '0.7rem' }}>
                                                            {tech.id}
                                                        </div>
                                                        <div style={{ fontSize: '0.7rem', marginTop: '0.125rem' }}>
                                                            {tech.name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--siem-text-dim)', fontSize: '0.7rem' }}>
                                                —
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default MitreView;
