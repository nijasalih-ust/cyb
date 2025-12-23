import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import learningService from "../../services/learningService";

function Library() {
  const navigate = useNavigate();
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const data = await learningService.getPaths();
        setPaths(data || []);
      } catch (error) {
        console.error("Failed to load paths");
      } finally {
        setLoading(false);
      }
    };
    fetchPaths();
  }, []);

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-display font-bold text-white mb-2"
        >
          Mission Library
        </motion.h2>
        <p className="text-gray-400 font-body mb-8">Select a specialized learning path to begin your training operations.</p>

        {loading ? (
          <p className="text-cyber-blue animate-pulse font-mono">Loading mission parameters...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path, i) => (
              <motion.div
                key={path.id}
                className={`relative overflow-hidden bg-cyber-card border border-cyber-border/50 rounded-xl2 p-6 cursor-pointer hover:border-cyber-purple/50 transition-all duration-300 hover:shadow-glow group
                  ${path.tier === 'legend' ? 'border-cyber-purple/40' : ''}`}
                onClick={() => navigate(`/paths/${path.id}`)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Number Watermark */}
                <div className="absolute -top-4 -right-4 text-9xl font-display font-black text-white/5 z-0 group-hover:text-cyber-purple/10 transition-colors">
                  {i + 1}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-cyber-purple transition-colors">
                    {path.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider border
                        ${path.tier === 'street' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        path.tier === 'corp' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                      {path.tier || 'Standard'}
                    </span>
                    <span className="text-xs text-cyber-muted font-mono">• {path.total_duration_hours || '2'}H EST</span>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 font-body leading-relaxed">
                    {path.description || "Mission details classified."}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-cyber-border/30 text-xs text-cyber-blue font-mono">
                    <span>{path.lab_count || 5} Active Labs</span>
                    <span className="group-hover:translate-x-1 transition-transform">Initialize &rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;
