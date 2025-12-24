import React from "react";
import DashboardStats from "../../components/DashboardStats";
import { BookOpen, Target, Zap, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const quickActions = [
    { title: "Continue Operation", desc: "Resume your last active lab session.", icon: Zap, path: "/library", color: "text-yellow-400" },
    { title: "Browse Missions", desc: "Explore new learning paths and modules.", icon: BookOpen, path: "/library", color: "text-blue-400" },
    { title: "Research Tactics", desc: "Consult the Threat Matrix dictionary.", icon: Target, path: "/dictionary", color: "text-red-400" },
    { title: "Incident Analysis", desc: "Start a new investigation assessment.", icon: ShieldAlert, path: "/assessment", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-display font-bold text-cyber-text-primary mb-2">Command Center</h2>
        <p className="text-cyber-text-secondary font-body">Overview of your current operational status and active missions.</p>
      </div>

      {/* Stats Row */}
      <DashboardStats />

      {/* Quick Actions Grid */}
      <h3 className="text-xl font-display font-semibold text-cyber-text-primary mt-8 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, i) => (
          <div
            key={i}
            onClick={() => navigate(action.path)}
            className="bg-cyber-card border border-cyber-border/50 p-6 rounded-xl2 hover:border-cyber-purple/50 hover:shadow-glow transition-all duration-300 cursor-pointer group"
          >
            <div className={`p-3 rounded-lg bg-black/40 w-fit mb-4 ${action.color} border border-cyber-border/30 group-hover:scale-110 transition-transform`}>
              <action.icon size={24} />
            </div>
            <h4 className="text-lg font-display font-bold text-cyber-text-primary mb-2 group-hover:text-cyber-purple transition-colors">{action.title}</h4>
            <p className="text-sm text-cyber-text-secondary font-body">{action.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
