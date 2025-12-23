import { motion } from "framer-motion";
import { HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield } from "lucide-react"; 

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-black/70 border-b border-cyber-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 text-xl font-bold tracking-wide cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {/* --- ADDED: Shield Icon --- */}
          <Shield className="text-cyber-purple" size={24} />
          <span className="text-cyber-blue">cyb.lib</span>
        </div>

        {/* Nav Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li>
            <HashLink
              smooth
              to="#features"
              className="text-cyber-muted hover:text-cyber-blue transition"
            >
              FEATURES
            </HashLink>
          </li>
          <li>
            <HashLink
              smooth
              to="#team"
              className="text-cyber-muted hover:text-cyber-blue transition"
            >
              TEAM
            </HashLink>
          </li>
          <li>
            <HashLink
              smooth
              to="#contact"
              className="text-cyber-muted hover:text-cyber-blue transition"
            >
              CONTACT
            </HashLink>
          </li>
        </ul>

        {/* Right Side */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-cyber-muted">
              <span className="text-cyber-blue font-medium ml-1">
                {user.username}
              </span>
            </span>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 rounded-lg text-sm font-medium
                         bg-gradient-to-r from-cyber-purple to-cyber-blue
                         text-black shadow-glow"
            >
              Logout
            </motion.button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;