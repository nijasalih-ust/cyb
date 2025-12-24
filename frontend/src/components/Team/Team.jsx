import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/motionVariants";

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
      {/* Heading - FIXED Colors */}
      <h2 className="text-3xl font-extrabold text-center text-cyber-text-primary mb-2">
        Meet the Team
      </h2>
      <p className="text-center text-cyber-text-secondary text-base mb-12">
        The brilliant minds behind our SOC operations
      </p>

      {/* Team Cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {TEAM.map((member) => (
          <motion.div
            key={member.name}
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            // FIXED: Using cyber-card
            className="cyber-card flex flex-col items-center"
          >
            {/* Profile Photo */}
            <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-cyber-purple transition-transform hover:scale-105">
              {/* Fallback if image fails */}
              <div className="w-full h-full bg-cyber-bg flex items-center justify-center text-cyber-purple font-bold text-xl">
                 {member.name[0]}
              </div>
            </div>

            {/* Name and Role - FIXED Colors */}
            <h3 className="text-lg font-bold text-cyber-text-primary mb-1">{member.name}</h3>
            <p className="text-cyber-text-secondary text-sm">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default Team;