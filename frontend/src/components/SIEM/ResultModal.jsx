import React from 'react';
import './ResultModal.css';

const ResultModal = ({ scenario, userResponse, onClose }) => {
    // Check if user's answer matches expected
    const isAssessmentCorrect = userResponse.assessment === scenario.expectedAssessment;
    const isActionCorrect = userResponse.nextAction === scenario.expectedAction;
    const isMitreCorrect = userResponse.mitreTechnique === scenario.mitreMapping.correct;

    const overallCorrect = isAssessmentCorrect && isActionCorrect;

    return (
        <div className="result-modal-overlay" onClick={onClose}>
            <div className="result-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="result-modal-header">
                    <h2>Investigation Complete</h2>
                    <button className="result-modal-close" onClick={onClose}>×</button>
                </div>

                <div className="result-modal-body">
                    {/* Overall Result */}
                    <div className={`result-banner ${overallCorrect ? 'correct' : 'incorrect'}`}>
                        {overallCorrect ? (
                            <>
                                <span className="result-icon">✓</span>
                                <span>Correct Assessment</span>
                            </>
                        ) : (
                            <>
                                <span className="result-icon">✗</span>
                                <span>Review Recommended</span>
                            </>
                        )}
                    </div>

                    {/* Scenario Explanation */}
                    <div className="result-section">
                        <h3>Scenario Summary</h3>
                        <p>{scenario.explanation.summary}</p>
                    </div>

                    {/* Attack Path */}
                    {scenario.explanation.attackPath.length > 0 && (
                        <div className="result-section">
                            <h3>Attack Path</h3>
                            <ol className="attack-path-list">
                                {scenario.explanation.attackPath.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Your Assessment vs Expected */}
                    <div className="result-section">
                        <h3>Your Analysis</h3>
                        <div className="comparison-grid">
                            <div className="comparison-item">
                                <div className="comparison-label">Assessment</div>
                                <div className={`comparison-value ${isAssessmentCorrect ? 'correct' : 'incorrect'}`}>
                                    Your answer: <strong>{userResponse.assessment}</strong>
                                    {!isAssessmentCorrect && (
                                        <div className="expected">Expected: <strong>{scenario.expectedAssessment}</strong></div>
                                    )}
                                </div>
                            </div>

                            <div className="comparison-item">
                                <div className="comparison-label">Recommended Action</div>
                                <div className={`comparison-value ${isActionCorrect ? 'correct' : 'incorrect'}`}>
                                    Your answer: <strong>{userResponse.nextAction}</strong>
                                    {!isActionCorrect && (
                                        <div className="expected">Expected: <strong>{scenario.expectedAction}</strong></div>
                                    )}
                                </div>
                            </div>

                            <div className="comparison-item">
                                <div className="comparison-label">MITRE Technique</div>
                                <div className={`comparison-value ${isMitreCorrect || !userResponse.mitreTechnique ? '' : 'incorrect'}`}>
                                    Your answer: <strong>{userResponse.mitreTechnique || 'Not selected'}</strong>
                                    {userResponse.mitreTechnique && !isMitreCorrect && (
                                        <div className="expected">Suggested: <strong>{scenario.mitreMapping.correct}</strong></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Evidence */}
                    <div className="result-section">
                        <h3>Key Evidence</h3>
                        <ul className="evidence-list">
                            {scenario.explanation.keyEvidence.map((evidence, idx) => (
                                <li key={idx}>{evidence}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Red Herrings */}
                    {scenario.explanation.redHerrings.length > 0 && (
                        <div className="result-section">
                            <h3>Red Herrings</h3>
                            <ul className="evidence-list red-herrings">
                                {scenario.explanation.redHerrings.map((herring, idx) => (
                                    <li key={idx}>{herring}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommended Action Explanation */}
                    <div className="result-section">
                        <h3>Recommended Action</h3>
                        <p className="recommended-action">{scenario.explanation.recommendedAction}</p>
                    </div>
                </div>

                <div className="result-modal-footer">
                    <button className="result-btn-primary" onClick={onClose}>
                        Back to Assessments
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
