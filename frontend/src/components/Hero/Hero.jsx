import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Initializing SOC Environment...",
  "Loading MITRE ATT&CK Framework...",
  "Connecting Threat Intelligence Feeds...",
  "Cyblib SOC Ready.",
];

function Hero() {
  const [text, setText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timeout;
    if (charIndex < messages[msgIndex].length) {
      timeout = setTimeout(() => {
        setText((prev) => prev + messages[msgIndex][charIndex]);
        setCharIndex((c) => c + 1);
      }, 60);
    } else {
      timeout = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setMsgIndex((i) => (i + 1) % messages.length);
      }, 1200);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, msgIndex]);

  return (
    <section className="relative py-32 text-center overflow-hidden">
      {/* Background Grid - Adapted for both themes */}
      <div className="absolute inset-0 -z-10 opacity-20
        bg-[linear-gradient(rgba(124,58,237,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]
        bg-[size:40px_40px]"
      />

      {/* Glow - Softened for Light Mode */}
      <div className="absolute inset-0 -z-10
        bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_65%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto px-6"
      >
        {/* Terminal Typing - KEPT DARK intentionally for contrast */}
        <div className="mb-6 font-mono text-sm md:text-base
                        text-cyan-400 bg-gray-900
                        border border-cyber-border
                        rounded-lg px-4 py-3 inline-block
                        shadow-[0_0_30px_rgba(124,58,237,0.25)]">
          <span className="text-purple-500">$</span>{" "}
          {text}
          <span className="animate-pulse">█</span>
        </div>

        {/* Main Title - FIXED: text-cyber-text-primary */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-cyber-text-primary">
          Welcome to{" "}
          <span className="text-cyber-purple">Cyblib SOC</span>
        </h1>

        {/* Subtitle - FIXED: text-cyber-text-secondary */}
        <p className="mt-4 text-lg text-cyber-text-secondary">
          A hands-on Security Operations Center learning platform inspired by
          <span className="text-cyber-blue font-medium"> MITRE ATT&CK</span> and
          real-world cyber incidents.
        </p>

        <motion.a
          href="#features"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-8 px-8 py-3 rounded-xl font-medium
                     bg-gradient-to-r from-cyber-purple to-cyber-blue
                     text-cyber-text-primary shadow-glow hover:shadow-lg transition-all"
        >
          Explore Platform
        </motion.a>
      </motion.div>
    </section>
  );
}

export default Hero;