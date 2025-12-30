import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, MessageSquare, ChevronRight, Send, Search } from "lucide-react";
import api from "../../services/api"; // Ensure this path is correct relative to your structure
import { useNavigate } from "react-router-dom";

// Bubble Option Component
const OptionBubble = ({ label, onClick, delay }) => (
    <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay * 0.1, duration: 0.2 }}
        onClick={onClick}
        className="bg-cyber-card border border-cyber-purple/30 hover:border-cyber-purple 
               text-cyber-text text-sm px-4 py-2 rounded-full m-1
               shadow-lg hover:shadow-glow hover:bg-cyber-purple/10 flex items-center gap-2 transition-all"
    >
        {label} <ChevronRight size={14} className="text-cyber-muted" />
    </motion.button>
);

const NavigatorBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "bot",
            text: "Greetings, Operative. I am your navigaton AI. How can I assist you today?",
            options: [
                { label: "Navigate Curriculum", value: "navigate" },
                { label: "Search Technique", value: "search_mode" },
                { label: "My Stats", value: "stats" }
            ]
        }
    ]);
    const [inputMode, setInputMode] = useState(false); // If true, show text input
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const handleOptionClick = async (option) => {
        // Add User Message
        const userMsg = { id: Date.now(), type: "user", text: option.label };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        // Initial Branching Logic
        if (option.value === "navigate") {
            try {
                const res = await api.post("/navigator/command", { input: "navigate" });
                const botMsg = {
                    id: Date.now() + 1,
                    type: "bot",
                    text: res.data.message || "Select a path:",
                    options: res.data.options // list of paths
                };
                setMessages(prev => [...prev, botMsg]);
            } catch (err) {
                handleError();
            }
        }
        else if (option.value === "search_mode") {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: "bot",
                text: "Enter a MITRE Technique ID (e.g., T1059) or Name to receive a briefing."
            }]);
            setInputMode(true);
        }
        else if (option.value === "stats") {
            try {
                const res = await api.post("/navigator/command", { input: "stats" });
                const payload = res.data.payload;
                const botMsg = {
                    id: Date.now() + 1,
                    type: "bot",
                    text: `Status Report:\n• Mastered: ${payload.techniques_mastered}\n• Completion: ${payload.percentage}%`
                };
                setMessages(prev => [...prev, botMsg]);
            } catch (err) { handleError(); }
        }
        else if (option.type === "path") {
            // Fetch Modules for this path
            // For simplicity, we assume we need to navigate there or fetch children.
            // Let's navigate directly for seamlessness? Or fetch modules via API?
            // To be TRULY menu driven, we should fetch modules.
            // But the current API doesn't have a "bot queries modules" endpoint easily without changing views.
            // OPTION B: Just navigate.
            const pathId = option.value.split(":")[1];
            navigate(`/paths/${pathId}`);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: "bot", text: `Navigating to ${option.label}...` }]);
            setIsOpen(false); // Close bot on nav
        }
        else {
            // Fallback
            handleError("Unknown command.");
        }

        setLoading(false);
    };

    const handleInputSubmit = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), type: "user", text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        setInputText("");

        try {
            // Assume 'search_mode' context or just general query
            const res = await api.post("/navigator/command", { query: userMsg.text });

            if (res.data.type === "technique_detail") {
                const p = res.data.payload;
                const botMsg = {
                    id: Date.now() + 1,
                    type: "bot",
                    text: res.data.message,
                    richContent: (
                        <div className="bg-black/40 p-3 rounded-lg border border-cyber-purple/20 mt-2 text-sm">
                            <strong className="text-cyber-purple block mb-1">{p.mitre_id} - {p.name}</strong>
                            <p className="text-cyber-muted mb-2 text-xs">{p.description}</p>
                            <button
                                onClick={() => { navigate(p.link); setIsOpen(false); }}
                                className="text-xs bg-cyber-blue/10 text-cyber-blue px-2 py-1 rounded border border-cyber-blue/30 hover:bg-cyber-blue/20"
                            >
                                View Full Lesson
                            </button>
                        </div>
                    )
                };
                setMessages(prev => [...prev, botMsg]);
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, type: "bot", text: res.data.message }]);
            }

        } catch (err) {
            handleError();
        }
        setLoading(false);
    };

    const handleError = (msg = "Connection interrupted.") => {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: "bot", text: msg }]);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full 
                   bg-gradient-to-r from-cyber-purple to-cyber-blue
                   text-black shadow-glow border border-white/20"
            >
                {isOpen ? <X size={24} /> : <Terminal size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, width: 300, height: 400 }}
                        animate={{ opacity: 1, y: 0, scale: 1, width: 350, height: 500 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 flex flex-col
                       bg-cyber-card/95 backdrop-blur-xl border border-cyber-border
                       rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyber-purple/20 to-cyber-blue/20 p-4 border-b border-cyber-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal size={18} className="text-cyber-purple" />
                                <span className="font-bold text-cyber-text text-sm">NavBot AI</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-cyber-muted">Online</span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.type === "bot" ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.type === "user"
                                        ? "bg-cyber-purple/20 text-cyber-text rounded-tr-none border border-cyber-purple/30"
                                        : "bg-black/40 text-cyber-masked rounded-tl-none border border-cyber-border"
                                        }`}>
                                        {msg.text}
                                        {msg.richContent}
                                    </div>

                                    {/* Options (Only if bot msg and has options) */}
                                    {msg.options && (
                                        <div className="flex flex-wrap mt-2 gap-1 max-w-[90%]">
                                            {msg.options.map((opt, idx) => (
                                                <OptionBubble
                                                    key={idx}
                                                    label={opt.label}
                                                    delay={idx}
                                                    onClick={() => handleOptionClick(opt)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex gap-1 ml-2">
                                    <span className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce delay-100" />
                                    <span className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce delay-200" />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area (Conditional) */}
                        <div className="p-3 border-t border-cyber-border bg-black/20">
                            {inputMode ? (
                                <form onSubmit={handleInputSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Ask about a technique..."
                                        className="flex-1 bg-black/50 border border-cyber-border rounded-lg px-3 py-2 text-sm text-cyber-text focus:outline-none focus:border-cyber-purple"
                                        autoFocus
                                    />
                                    <button type="submit" className="bg-cyber-purple/20 p-2 rounded-lg text-cyber-purple hover:bg-cyber-purple/40">
                                        <Send size={16} />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setInputMode(true)}
                                    className="w-full text-xs text-cyber-muted hover:text-cyber-blue flex items-center justify-center gap-1 py-1"
                                >
                                    <Search size={12} /> Switch to manual input
                                </button>
                            )}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NavigatorBot;
