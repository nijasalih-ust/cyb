import { motion } from "framer-motion";
import { HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield } from "lucide-react";
import ThemeToggle from "../ThemeToggle/ThemeToggle"; 

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-cyber-bg/80 border-b border-cyber-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 text-xl font-bold tracking-wide cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Shield className="text-cyber-purple" size={24} />
          <span className="text-cyber-blue">cyb.lib</span>
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {['Features', 'Team', 'Contact'].map((item) => (
            <li key={item}>
              <HashLink
                smooth
                to={`#${item.toLowerCase()}`}
                className="text-cyber-text-muted hover:text-cyber-blue transition uppercase"
              >
                {item}
              </HashLink>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyber-border bg-cyber-card/50 backdrop-blur transition-all duration-300">
                <div className="relative flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyber-blue animate-pulse" />
                  <span className="text-xs font-mono text-cyber-text-secondary">
                    <span className="text-cyber-blue font-semibold">
                      {user.username}
                    </span>
                  </span>
                </div>

                <div className="h-5 w-px mx-1 bg-cyber-border" />
                <ThemeToggle />
              </div>

              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-lg text-sm font-medium
                           bg-gradient-to-r from-cyber-purple to-cyber-blue
                           text-white shadow-glow hover:shadow-blueglow transition-all duration-300"
              >
                Logout
              </motion.button>
            </>
          ) : (
             // You can add a login button here if user is null
            <span className="text-xs text-cyber-text-muted">Loading...</span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;