import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import frameworkService from "../../services/frameworkService";
// import "./Dictionary.css"; // Using Tailwind now

function Dictionary() {
  const [search, setSearch] = useState("");
  const [tactics, setTactics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await frameworkService.getTactics();
        setTactics(data || []);
      } catch (err) {
        setError("Failed to load generic dictionary data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTactics = tactics.filter((tactic) =>
    tactic.name.toLowerCase().includes(search.toLowerCase()) ||
    (tactic.description && tactic.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-cyber-purple mb-2">Tactics Library</h2>
        <p className="text-cyber-text-secondary font-body mb-8">Encyclopedia of adversary tactics and techniques based on MITRE ATT&CK®.</p>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search tactics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-cyber-card border border-cyber-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyber-purple text-cyber-text-primary placeholder-gray-500 font-body shadow-inner"
          />
        </div>

        {/* Loading/Error States */}
        {loading && <p className="text-cyber-blue animate-pulse font-mono">Scanning database...</p>}
        {error && <p className="text-red-500 font-body">{error}</p>}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filteredTactics.length > 0 ? (
            filteredTactics.map((item) => (
              <div
                key={item.mitre_id}
                onClick={() => navigate(`/tactics-library/${item.id}`)}
                className="bg-cyber-card border border-cyber-border/50 p-6 rounded-xl2 hover:border-cyber-purple/50 transition-all duration-300 hover:shadow-glow group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-display font-bold text-cyber-text-primary group-hover:text-cyber-purple transition-colors">{item.name}</h3>
                  <span className="text-xs font-mono bg-cyber-purple/10 text-cyber-purple px-2 py-1 rounded border border-cyber-purple/20">
                    {item.mitre_id}
                  </span>
                </div>
                <p className="text-cyber-text-secondary text-sm mb-4 line-clamp-3 font-body">
                  {item.description || "No description available."}
                </p>
                <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyber-blue"></span>
                  Techniques: <span className="text-cyber-text-primary">{item.technique_count}</span>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-500 font-body">No matching tactics found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dictionary;

