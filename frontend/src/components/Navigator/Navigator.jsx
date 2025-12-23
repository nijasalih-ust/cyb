import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Terminal, X, Minimize2, Maximize2 } from "lucide-react";
import api from "../../services/api";

function Navigator() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([
        { type: "system", content: "Navigator Agent v3.2 initialized. Waiting for command..." }
    ]);
    const [options, setOptions] = useState([]);
    const [suggestions] = useState([
        "stats",
        "technique T1190",
        "technique T1566",
        "navigate /library",
    ]);
    const [minimized, setMinimized] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isOpen]);

    const sendCommand = async (cmd) => {
        if (!cmd || !cmd.trim()) return;
        const text = cmd.trim();
        setHistory((prev) => [...prev, { type: "user", content: text }]);
        setInput("");
        setOptions([]);

        try {
            const response = await api.post("/navigator/command", {
                input: text,
                context: {
                    current_page: location.pathname,
                    user_authenticated: !!localStorage.getItem("cyblib_user")
                }
            });

            const { type, payload } = response.data;

            if (type === "action" && payload.action === "navigate") {
                setHistory((prev) => [...prev, { type: "bot", content: `Navigating to ${payload.url}...` }]);
                navigate(payload.url);
            } else if (type === "technique_detail") {
                setHistory((prev) => [...prev, { type: "bot", content: `**${payload.mitre_id}: ${payload.name}**\n${payload.description}` }]);
            } else if (type === "stats") {
                const stats = payload;
                const msg = `Mastery: ${stats.percentage}% (${stats.techniques_mastered}/${stats.techniques_total})\nCurrent Path: ${stats.current_path}`;
                setHistory((prev) => [...prev, { type: "bot", content: msg }]);
            } else if (type === "options") {
                setHistory((prev) => [...prev, { type: "bot", content: payload.message }]);
                if (payload.options && Array.isArray(payload.options)) {
                    setOptions(payload.options);
                }
            } else {
                setHistory((prev) => [...prev, { type: "bot", content: JSON.stringify(payload) }]);
            }

        } catch (error) {
            setHistory((prev) => [...prev, { type: "error", content: "Connection lost to C2 server." }]);
        }
    };

    const handleCommand = (e) => {
        if (e.key === "Enter") sendCommand(input);
    };

    const handleOptionClick = (option) => {
        // option may be an object { label, command }
        if (typeof option === 'string') {
            sendCommand(option);
        } else if (option && option.command) {
            sendCommand(option.command);
        } else if (option && option.label) {
            // fallback: send label as command
            sendCommand(option.label);
        }
    };

    return (
        <>
            {/* Trigger Button (if closed) */}
            {!isOpen && (
                <motion.button
                    className="fixed bottom-6 right-6 p-4 bg-cyber-purple text-black rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] z-50 hover:scale-110 transition-transform"
                    onClick={() => setIsOpen(true)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <Terminal size={24} />
                </motion.button>
            )}

            {/* Chat Window */}
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
                        className="fixed bottom-6 right-6 w-96 bg-black/90 backdrop-blur-md border border-cyber-purple/50 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col font-mono"
                        style={{ maxHeight: "80vh" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 bg-cyber-purple/10 border-b border-cyber-purple/20 cursor-move">
                            <div className="flex items-center gap-2 text-cyber-purple">
                                <Terminal size={16} />
                                <span className="text-sm font-bold">C2-NAVIGATOR</span>
                            </div>
                            <div className="flex items-center gap-2 text-cyber-muted">
                                <button onClick={() => setMinimized(!minimized)} className="hover:text-white">
                                    {minimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Content area (hidden if minimized) */}
                        {!minimized && (
                            <>
                                {/* Messages */}
                                <div
                                    ref={scrollRef}
                                    className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-cyber-purple/30"
                                >
                                    {history.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`text-sm ${msg.type === "user" ? "text-right text-white" :
                                                    msg.type === "error" ? "text-red-500" :
                                                        msg.type === "system" ? "text-cyber-muted italic" :
                                                            "text-cyber-blue"
                                                }`}
                                        >
                                            {msg.type === "user" && <span className="text-gray-500 mr-2">&gt;</span>}
                                            <span className="whitespace-pre-wrap">{msg.content}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Render options as clickable buttons (menu-driven) */}
                                {options && options.length > 0 && (
                                    <div className="p-3 border-t border-white/5 bg-black/40 flex flex-wrap gap-2">
                                        {options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionClick(opt)}
                                                className="px-3 py-1 text-xs rounded bg-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple/30"
                                            >
                                                {typeof opt === 'string' ? opt : opt.label || opt.command}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Quick suggestions for users to click/use */}
                                {suggestions && suggestions.length > 0 && (
                                    <div className="p-2 border-t border-white/5 bg-black/20 flex gap-2 flex-wrap">
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendCommand(s)}
                                                className="px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-gray-300"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-3 bg-black/50 border-t border-cyber-purple/20">
                                    <div className="flex items-center gap-2">
                                        <span className="text-cyber-purple animate-pulse">&gt;_</span>
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleCommand}
                                            placeholder="Enter command..."
                                            className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm font-mono placeholder-gray-600"
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
