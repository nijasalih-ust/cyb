import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/motionVariants";

// Add photo URLs for each team member
const TEAM = [
  { name: "Gopikrishna", role: "SOC Analyst", photo: "/images/gopikrishna.jpg" },
  { name: "Fathima Rifa", role: "Threat Hunter", photo: "/images/fathima.jpg" },
  { name: "Nijas", role: "Cybersecurity Engineer", photo: "/images/nijas.jpg" },
];

function Team() {
  return (
    <motion.section
      id="team"
      className="py-20 max-w-6xl mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Heading */}
      <h2 className="text-3xl font-extrabold text-center text-cyber-purple mb-12">
        Meet the Team
      </h2>
      <p className="text-center text-cyber-muted text-base mb-12">
        The brilliant minds behind our SOC operations
      </p>

      {/* Team Cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {TEAM.map((member) => (
          <motion.div
            key={member.name}
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            className="bg-cyber-card border border-cyber-border rounded-xl p-6 flex flex-col items-center
                       hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition"
          >
            {/* Profile Photo */}
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-cyber-purple transition-transform hover:scale-105">
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
            </div>

            {/* Name and Role */}
            <h3 className="text-lg font-bold text-cyber-blue mb-1">{member.name}</h3>
            <p className="text-cyber-muted text-sm">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default Team;
