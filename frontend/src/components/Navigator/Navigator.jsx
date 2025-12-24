import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Minimize2, Maximize2 } from "lucide-react";
import api from "../../services/api";

function Navigator() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([
        { type: "system", content: "Navigator Agent v3.2 initialized. Waiting for command..." }
    ]);
    const [minimized, setMinimized] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // ... Keep existing command logic (sendCommand, etc.) ...
    // Assuming sendCommand is here...
    const sendCommand = (cmd) => {
        if (!cmd) return;
        setHistory(prev => [...prev, {type: 'user', content: cmd}]);
        setInput('');
        // Mock response
        setTimeout(() => {
             setHistory(prev => [...prev, {type: 'bot', content: `Command '${cmd}' processed.`}]);
        }, 500);
    }
    const handleCommand = (e) => {
        if (e.key === "Enter") sendCommand(input);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isOpen]);

    return (
        <>
            {!isOpen && (
                <motion.button
                    className="fixed bottom-6 right-6 p-4 bg-cyber-purple text-white rounded-full shadow-glow z-50 hover:scale-110 transition-transform"
                    onClick={() => setIsOpen(true)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <Terminal size={24} />
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: minimized ? "auto" : "400px"
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 w-96 bg-cyber-card/95 backdrop-blur-md border border-cyber-border rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col font-mono"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 bg-cyber-bg border-b border-cyber-border cursor-move">
                            <div className="flex items-center gap-2 text-cyber-purple">
                                <Terminal size={16} />
                                <span className="text-sm font-bold">C2-NAVIGATOR</span>
                            </div>
                            <div className="flex items-center gap-2 text-cyber-text-secondary">
                                <button onClick={() => setMinimized(!minimized)} className="hover:text-cyber-text-primary">
                                    {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:text-cyber-text-primary">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {!minimized && (
                            <>
                                <div
                                    ref={scrollRef}
                                    className="flex-1 p-4 overflow-y-auto space-y-3"
                                >
                                    {history.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`text-sm ${
                                                msg.type === "user" ? "text-right text-cyber-text-primary" :
                                                msg.type === "error" ? "text-red-500" :
                                                msg.type === "system" ? "text-cyber-text-muted italic" :
                                                "text-cyber-blue"
                                            }`}
                                        >
                                            {msg.type === "user" && <span className="text-cyber-text-muted mr-2">&gt;</span>}
                                            <span className="whitespace-pre-wrap">{msg.content}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 bg-cyber-bg/50 border-t border-cyber-border">
                                    <div className="flex items-center gap-2">
                                        <span className="text-cyber-purple animate-pulse">&gt;_</span>
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleCommand}
                                            placeholder="Enter command..."
                                            className="flex-1 bg-transparent border-none focus:outline-none text-cyber-text-primary text-sm font-mono placeholder-cyber-text-muted"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navigator;