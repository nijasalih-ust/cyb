// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const success = login(username, password);
//     if (success) {
//       navigate("/landing");
//     } else {
//       setError("Invalid credentials");
//     }
//   };
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
//         <h2 className="text-2xl font-bold text-center mb-6">Login to Cyblib</h2>

//          <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {error && (
//             <p className="text-red-500 text-sm font-medium">{error}</p>
//           )}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-cyber-text-primary py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      navigate("/landing");
    } else {
      alert(result.message || "Invalid credentials");
    }
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
            Secure Analyst Login
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-xs text-cyber-muted">Username</label>
            <div className="relative mt-1">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-muted"
              />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg
             bg-black border border-cyber-border
             text-cyber-text placeholder-transparent
             focus:outline-none focus:border-cyber-purple
             focus:ring-1 focus:ring-cyber-purple"
                placeholder="analyst01"
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
            className="w-full mt-2 py-2.5 rounded-lg font-medium
                       bg-gradient-to-r from-cyber-purple to-cyber-blue
                       text-black shadow-glow"
          >
            Login to SOC
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-cyber-muted">
          © 2025 Cyblib | Secure Cyber Learning Platform
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
