import React from "react";
import { FaBook, FaClipboardCheck, FaBookOpen, FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "Incident Analysis",
    desc: "Analyze logs, alerts, and threat indicators.",
    icon: <FaClipboardCheck />,
    path: "/assessment",
  },
  {
    title: "MITRE ATT&CK",
    desc: "Map attacker behavior to industry frameworks.",
    icon: <FaBook />,
    path: "/learning-paths",
  },
  {
    title: "Tactics Library",
    desc: "Look up cyber security terms and definitions.",
    icon: <FaBookOpen />,
    path: "/tactics-library",
  },
  {
    title: "AI SOC Analyst",
    desc: "Receive AI-generated feedback for decisions.",
    icon: <FaRobot />,
    path: "/ai-analyst",
  },
];

function Features() {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-20 max-w-6xl mx-auto px-6">
      <motion.h2
        // FIXED: text-cyber-text-primary
        className="text-4xl font-bold text-center text-cyber-text-primary mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Features
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            onClick={() => navigate(f.path)}
            // FIXED: Using cyber-card class
            className="cursor-pointer cyber-card group"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-cyber-purple mb-3 text-2xl group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </div>
            {/* FIXED: text-cyber-text-primary */}
            <h3 className="text-lg font-semibold text-cyber-text-primary">
              {f.title}
            </h3>
            {/* FIXED: text-cyber-text-secondary */}
            <p className="mt-2 text-sm text-cyber-text-secondary">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Features;