import React, { useState } from 'react';
import { ChevronDown, BookOpen, Terminal, AlertCircle, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LessonViewer = ({ title, content, key_indicators, duration = "15 Minutes" }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!content) {
        return (
            <div className="p-4 border border-red-500/20 rounded-xl bg-red-500/5">
                <h3 className="text-xl font-bold text-cyber-text-primary mb-2">
                    {title}
                </h3>
                <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> No lesson content available.
                </p>
            </div>
        );
    }

    // Custom components for ReactMarkdown to match the specific "Cyber" aesthetic
    const MarkdownComponents = {
        // Headers
        h1: ({ node, ...props }) => <h1 className="text-3xl font-display font-bold text-cyber-text-primary mb-6 mt-8 border-b border-cyber-border/50 pb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-display font-bold text-cyber-text-primary mb-4 mt-8 flex items-center gap-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-cyber-purple mb-3 mt-6" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-lg font-bold text-cyber-blue mb-2 mt-4" {...props} />,

        // Text elements
        p: ({ node, ...props }) => <p className="text-cyber-text-secondary text-sm leading-relaxed mb-4 font-body" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-cyber-text-primary" {...props} />,
        em: ({ node, ...props }) => <em className="text-cyber-purple/80 not-italic" {...props} />,

        // Lists
        ul: ({ node, ...props }) => <ul className="space-y-2 mb-4 ml-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal space-y-2 mb-4 ml-4 text-cyber-text-secondary" {...props} />,
        li: ({ node, ...props }) => (
            <li className="flex gap-2 text-sm text-cyber-text-secondary">
                <span className="text-cyber-purple select-none mt-1">›</span>
                <span className="flex-1" {...props} />
            </li>
        ),

        // Code
        code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
                return <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700" {...props}>{children}</code>;
            }
            return (
                <div className="relative group my-4">
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-xs text-gray-500 font-mono">bash</div>
                    </div>
                    <pre className="bg-black/50 border border-cyber-border/50 rounded-lg p-4 overflow-x-auto">
                        <code className="text-gray-300 text-xs font-mono block" {...props}>
                            {children}
                        </code>
                    </pre>
                </div>
            );
        },

        // Blockquotes (Technical Insights)
        blockquote: ({ node, ...props }) => (
            <div className="bg-cyber-purple/5 border-l-4 border-cyber-purple p-4 my-6 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2 text-cyber-purple font-bold text-xs uppercase tracking-wider">
                    <Terminal size={14} /> Technical Insight
                </div>
                <div className="text-cyber-text-secondary text-sm italic" {...props} />
            </div>
        ),

        // Links
        a: ({ node, ...props }) => (
            <a
                className="text-cyber-blue hover:text-white underline hover:no-underline transition-colors inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {props.children} <ExternalLink size={10} />
            </a>
        ),

        // Horizontal Rule
        hr: ({ node, ...props }) => <hr className="border-cyber-border/50 my-8" {...props} />
    };

    return (
        <div className="w-full bg-cyber-card border border-cyber-border rounded-xl2 overflow-hidden shadow-sm hover:shadow-glow transition-all duration-300">
            {/* Header Section */}
            <div className="bg-black/40 p-6 border-b border-cyber-border/50">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-cyber-blue" />
                        <span className="text-xs font-mono text-cyber-blue tracking-widest uppercase">Lesson Module</span>
                    </div>
                    <span className="text-cyber-text-muted text-xs font-mono">{duration}</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-cyber-text-primary mb-2">
                    {title}
                </h2>
            </div>

            {/* Content Section */}
            <div className={`p-6 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'max-h-96 overflow-hidden mask-linear-fade'}`}>

                {/* Main Content Rendered via ReactMarkdown */}
                <div className="markdown-content">
                    <ReactMarkdown components={MarkdownComponents}>
                        {content}
                    </ReactMarkdown>
                </div>

                {/* Key Indicators Section (Specific to Lesson) */}
                {key_indicators && (
                    <div className="mt-8 bg-blue-500/5 border border-blue-500/20 p-5 rounded-lg">
                        <h4 className="text-blue-400 font-bold text-sm mb-3 flex items-center gap-2">
                            <Terminal size={16} /> Key Indicators
                        </h4>
                        <p className="text-gray-300 font-mono text-xs whitespace-pre-line leading-relaxed">
                            {key_indicators}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Toggle */}
            {!isExpanded && (
                <div className="bg-gradient-to-t from-cyber-card to-transparent h-24 -mt-24 relative z-10 flex items-end justify-center pb-4">
                    <button onClick={() => setIsExpanded(true)} className="text-cyber-purple hover:text-white text-sm font-bold flex items-center gap-2">
                        Show Full Lesson <ChevronDown size={16} />
                    </button>
                </div>
            )}

            {isExpanded && (
                <div className="bg-black/20 p-2 flex justify-center border-t border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsExpanded(false)}>
                    <div className="flex items-center gap-2 text-xs text-cyber-text-secondary">
                        <ChevronDown size={14} className="rotate-180" /> Collapse Lesson
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonViewer;
