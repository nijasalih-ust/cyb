import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../../utils/motionVariants";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Shield } from "lucide-react";
import { HashLink } from "react-router-hash-link";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail("");
  };

  return (
    <motion.footer
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full bg-cyber-bg/95 backdrop-blur-xl overflow-hidden border-t border-cyber-border"
    >
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-cyber-purple" size={26} />
              <span className="text-xl font-semibold text-cyber-text-primary">Cyblib</span>
            </div>

            <p className="text-sm text-cyber-text-secondary max-w-sm">
              From theory to practice, we build the future of cyber security education.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-cyber-text-secondary">
              <li>
                <HashLink smooth to="#features" className="hover:text-cyber-blue transition">
                  Features
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="#team" className="hover:text-cyber-blue transition">
                  Team
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="#contact" className="hover:text-cyber-blue transition">
                  Contact Us
                </HashLink>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-cyber-text-primary mb-1">
              Subscribe to our newsletter
            </h3>

            <p className="text-sm text-cyber-text-secondary mb-5 max-w-sm">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-sm rounded-full overflow-hidden border border-cyber-border bg-cyber-input p-1"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-cyber-text-primary placeholder:text-cyber-text-muted focus:outline-none"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 text-sm font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-cyber-text-primary rounded-full"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        <div className="my-10 border-t border-cyber-border/40" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cyber-text-muted">
            © {new Date().getFullYear()} Cyblib. All rights reserved.
          </p>

          <div className="flex gap-5">
            {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2 }}
                className="text-cyber-text-muted hover:text-cyber-purple transition-colors"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;