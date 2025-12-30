import React, { useState } from 'react';
import { parseQuery } from '../../utils/queryParser';

const QueryTerminal = ({ expanded, onToggle, logs, onQueryExecute }) => {
    const [query, setQuery] = useState('');
    const [output, setOutput] = useState('');
    const [history, setHistory] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const result = parseQuery(query, logs);

        // Add to history
        setHistory(prev => [...prev, { query, result }]);

        // Display output
        if (result.success) {
            setOutput(result.message);
            onQueryExecute(query, result.results);
        } else {
            setOutput(`Error: ${result.message}`);
            onQueryExecute(query, null);
        }

        // Clear input
        setQuery('');
    };

    return (
        <div className="siem-terminal" style={{ maxHeight: expanded ? '300px' : '60px' }}>
            <div className="siem-terminal-header" onClick={onToggle}>
                <div className="siem-terminal-title">
                    Query Terminal {expanded ? '▼' : '▲'}
                </div>
            </div>

            {expanded && (
                <div className="siem-terminal-body">
                    {/* History display */}
                    {history.length > 0 && (
                        <div className="siem-terminal-output" style={{ marginBottom: '1rem', maxHeight: '150px', overflowY: 'auto' }}>
                            {history.slice(-3).map((item, idx) => (
                                <div key={idx} style={{ marginBottom: '0.75rem' }}>
                                    <div style={{ color: 'var(--siem-accent)' }}>
                                        &gt; {item.query}
                                    </div>
                                    <div style={{ color: item.result.success ? 'var(--siem-text-secondary)' : 'var(--siem-critical)' }}>
                                        {item.result.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="siem-terminal-input-wrapper">
                        <span className="siem-terminal-prompt">&gt;</span>
                        <input
                            type="text"
                            className="siem-terminal-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="search | filter host=WS-23 | stats count by eventType | timeline host=WS-23"
                            autoFocus
                        />
                    </form>

                    {/* Help text */}
                    <div style={{ fontSize: '0.7rem', color: 'var(--siem-text-dim)', marginTop: '0.5rem' }}>
                        Available commands: search &lt;term&gt; | filter &lt;field&gt;=&lt;value&gt; | stats count by &lt;field&gt; | timeline host=&lt;host&gt;
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueryTerminal;
