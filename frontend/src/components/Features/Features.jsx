import React from "react";
import { FaBook, FaClipboardCheck, FaMapSigns, FaBookOpen, FaRobot } from "react-icons/fa";
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
    path: "/library",
  },
  {
    title: "Dictionary",
    desc: "Look up cyber security terms and definitions.",
    icon: <FaBookOpen />,
    path: "/dictionary",
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
        className="text-4xl font-bold text-center text-cyber-blue mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Features
      </motion.h2>

      {/* --- CHANGE: Adjusted horizontal and vertical gaps separately --- */}
      <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            onClick={() => navigate(f.path)}
            className="cursor-pointer bg-cyber-card border border-cyber-border rounded-xl p-4
                       hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]
                       transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-cyber-purple mb-3 text-2xl">{f.icon}</div>
            <h3 className="text-base font-semibold text-cyber-blue">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-cyber-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Features;