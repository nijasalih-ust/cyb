import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, User, PlusCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [isLogin, setIsLogin] = useState(true); // Toggle State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For registration
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // LOGIN LOGIC
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        alert(result.message || "Invalid credentials");
      }
    } else {
      // REGISTER LOGIC
      // Note: Backend might expect 'first_name'/'last_name' split, 
      // but for simplicity we'll pass 'username' or just split it if needed.
      // AuthContext.register(email, username, password)
      const result = await register(email, name, password);
      if (result.success) {
        // Auto login or switch to login? Let's switch to login for safety
        setIsLogin(true);
        alert("Registration successful! Please login.");
      } else {
        alert(result.message || "Registration failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#050014] to-black">
      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.15),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl
                   bg-cyber-card border border-cyber-border
                   shadow-[0_0_40px_rgba(124,58,237,0.25)]"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-full bg-cyber-purple/20 mb-3">
            <Shield className="text-cyber-purple" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-cyber-purple">
            cyb.lib
          </h1>
          <p className="text-sm text-cyber-muted">
            {isLogin ? "Secure Analyst Login" : "New Operative Registration"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name Field (Register Only) */}
          {!isLogin && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              overflow="hidden"
            >
              <label className="text-xs text-cyber-muted">Username</label>
              <div className="relative mt-1">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted"
                />
                <input
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg
                 bg-black border border-cyber-border
                 text-cyber-text placeholder-transparent
                 focus:outline-none focus:border-cyber-purple
                 focus:ring-1 focus:ring-cyber-purple"
                  placeholder="Analyst Name"
                />
              </div>
            </motion.div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs text-cyber-muted">Email</label>
            <div className="relative mt-1">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg
             bg-black border border-cyber-border
             text-cyber-text placeholder-transparent
             focus:outline-none focus:border-cyber-purple
             focus:ring-1 focus:ring-cyber-purple"
                placeholder="analyst@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-cyber-muted">Password</label>
            <div className="relative mt-1">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg
             bg-black border border-cyber-border
             text-cyber-text placeholder-transparent
             focus:outline-none focus:border-cyber-purple
             focus:ring-1 focus:ring-cyber-purple"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-lg font-medium
                       bg-gradient-to-r from-cyber-purple to-cyber-blue
                       text-black shadow-glow flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : (isLogin ? "Login to SOC" : "Initialize Account")}
          </motion.button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 pt-4 border-t border-cyber-border/50 text-center">
          <p className="text-sm text-cyber-muted mb-2">
            {isLogin ? "Need access clearance?" : "Already verified?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyber-blue hover:text-cyber-purple transition-colors text-sm font-bold flex items-center justify-center gap-2 mx-auto"
          >
            {isLogin ? "Request Access (Register)" : "Return to Login"}
          </button>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-cyber-muted">
          © 2025 Cyblib | Secure Cyber Learning Platform
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
