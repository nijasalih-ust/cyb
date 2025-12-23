import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TechniqueViewer = ({ name, mitre_id, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredRef, setHoveredRef] = useState(null);

  if (!description) {
    return (
      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          {name} <span className="text-xs font-mono text-gray-500 ml-2">({mitre_id})</span>
        </h3>
        <p className="text-gray-400 text-sm">No specific intelligence available.</p>
      </div>
    );
  }

  // Extract and parse references (citations)
  const citationRegex = /\(Citation:\s*([^)]+)\)/g;
  let citations = [];
  const citationMap = {};

  let textWithReplacedCitations = description.replace(citationRegex, (match, citationText) => {
    if (!citationMap[citationText]) {
      citations.push(citationText);
      citationMap[citationText] = citations.length;
    }
    const citNum = citationMap[citationText];
    return `__CITATION_${citNum}__`;
  });

  // Parse content into structured elements
  const parseDescription = (text) => {
    const elements = [];
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());

    paragraphs.forEach((para, paraIdx) => {
      const parts = [];
      let lastIndex = 0;
      
      // Find all code blocks
      const codeRegex = /<code>([^<]+)<\/code>/g;
      let match;

      while ((match = codeRegex.exec(para)) !== null) {
        // Add text before code
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: para.substring(lastIndex, match.index)
          });
        }
        // Add code block
        parts.push({
          type: 'code',
          content: match[1]
        });
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < para.length) {
        parts.push({
          type: 'text',
          content: para.substring(lastIndex)
        });
      }

      if (parts.length === 0) {
        parts.push({ type: 'text', content: para });
      }

      elements.push({
        type: 'paragraph',
        parts,
        key: paraIdx
      });
    });

    return elements;
  };

  const parsedElements = parseDescription(textWithReplacedCitations);

  // Render parsed elements with citation markers and links
  const renderPart = (part) => {
    if (part.type === 'code') {
      return (
        <code className="bg-gray-800 text-cyan-300 px-2 py-1 rounded text-xs font-mono border border-gray-700">
          {part.content}
        </code>
      );
    } else if (part.type === 'text') {
      // Parse both links and citations from text
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const citationRegex = /(__CITATION_\d+__)/g;
      
      const textSegments = [];
      let lastIndex = 0;
      
      // Find all links and citations, maintaining order
      const matches = [];
      let linkMatch;
      let citMatch;
      
      while ((linkMatch = linkRegex.exec(part.content)) !== null) {
        matches.push({
          type: 'link',
          start: linkMatch.index,
          end: linkMatch.index + linkMatch[0].length,
          text: linkMatch[1],
          url: linkMatch[2]
        });
      }
      
      linkRegex.lastIndex = 0; // Reset regex
      citationRegex.lastIndex = 0;
      
      while ((citMatch = citationRegex.exec(part.content)) !== null) {
        matches.push({
          type: 'citation',
          start: citMatch.index,
          end: citMatch.index + citMatch[0].length,
          text: citMatch[0]
        });
      }
      
      // Sort matches by start position
      matches.sort((a, b) => a.start - b.start);
      
      // Build the rendered output
      lastIndex = 0;
      const rendered = [];
      
      matches.forEach((match, matchIdx) => {
        // Add text before match
        if (match.start > lastIndex) {
          rendered.push(
            <span key={`text-${matchIdx}`}>
              {part.content.substring(lastIndex, match.start)}
            </span>
          );
        }
        
        // Add the match (link or citation)
        if (match.type === 'link') {
          const isValidUrl = match.url.startsWith('http://') || match.url.startsWith('https://');
          rendered.push(
            <a
              key={`link-${matchIdx}`}
              href={isValidUrl ? match.url : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-purple hover:text-cyber-purple/80 underline hover:no-underline transition-colors"
            >
              {match.text}
            </a>
          );
        } else if (match.type === 'citation') {
          const citNum = parseInt(match.text.match(/__CITATION_(\d+)__/)[1]);
          rendered.push(
            <span
              key={`cit-${matchIdx}`}
              className="relative inline"
              onMouseEnter={() => setHoveredRef(citNum)}
              onMouseLeave={() => setHoveredRef(null)}
            >
              <sup className="text-cyber-purple cursor-help font-semibold hover:text-cyber-purple/80">
                [{citNum}]
              </sup>
              {hoveredRef === citNum && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-900 border border-cyber-purple/50 rounded px-3 py-2 text-xs text-gray-200 whitespace-nowrap z-20 shadow-lg pointer-events-none">
                  {citations[citNum - 1]}
                </div>
              )}
            </span>
          );
        }
        
        lastIndex = match.end;
      });
      
      // Add remaining text
      if (lastIndex < part.content.length) {
        rendered.push(
          <span key={`text-final`}>
            {part.content.substring(lastIndex)}
          </span>
        );
      }
      
      return rendered.length > 0 ? rendered : part.content;
    }
  };

  // Calculate preview text (first 150 chars without HTML and citations)
  const plainText = description
    .replace(/<[^>]+>/g, '')
    .replace(/\(Citation:[^)]+\)/g, '')
    .trim();
  const preview = plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;

  return (
    <div className="space-y-2 w-full">
      <h3 className="text-xl font-bold text-white mb-3">
        {name} <span className="text-xs font-mono text-gray-500 ml-2">({mitre_id})</span>
      </h3>

      <div className="space-y-3">
        {!isExpanded ? (
          <div>
            <p className="text-gray-300 text-sm leading-relaxed">{preview}</p>
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-2 inline-flex items-center gap-1 text-cyber-purple hover:text-cyber-purple/80 text-xs font-semibold transition-colors"
            >
              <ChevronDown size={14} />
              View Details
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {parsedElements.map((elem) => (
              <p key={elem.key} className="text-gray-300 text-sm leading-relaxed">
                {elem.parts.map((part, partIdx) => (
                  <React.Fragment key={partIdx}>
                    {renderPart(part)}
                    {partIdx < elem.parts.length - 1 && <span> </span>}
                  </React.Fragment>
                ))}
              </p>
            ))}

            {citations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-700/50 space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">References:</p>
                <ul className="space-y-1">
                  {citations.map((citation, idx) => (
                    <li key={idx} className="text-xs text-gray-400">
                      <span className="text-cyber-purple font-semibold">[{idx + 1}]</span> {citation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setIsExpanded(false)}
              className="mt-3 inline-flex items-center gap-1 text-cyber-purple hover:text-cyber-purple/80 text-xs font-semibold transition-colors"
            >
              <ChevronDown size={14} className="rotate-180" />
              Collapse
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechniqueViewer;
