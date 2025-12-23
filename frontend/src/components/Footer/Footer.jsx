// import React from "react";
// import "./Footer.css";

// function Footer() {
//   return (
//     <footer className="footer">
//       <p>&copy; {new Date().getFullYear()} Cyblib. All rights reserved.</p>
//     </footer>
//   );
// }

// export default Footer;


// import React from "react";
// import { motion } from "framer-motion";
// import { fadeInUp } from "../../utils/motionVariants";
// import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

// function Footer() {
//   return (
//     <motion.footer
//       variants={fadeInUp}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="relative z-10 border-t border-cyber-border bg-black/80 backdrop-blur py-8 text-center"
//     >
//       {/* Neon Divider Line */}
//       <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyber-purple via-cyber-blue to-cyber-purple shadow-[0_0_10px_rgba(124,58,237,0.8)]" />

//       {/* Footer Content */}
//       <p className="text-sm text-cyber-muted">
//         &copy; {new Date().getFullYear()}{" "}
//         <span className="text-cyber-blue font-semibold">Cyblib</span> | Secure
//         Cyber Learning Platform
//       </p>
//       <p className="mt-1 text-xs text-cyber-purple">All rights reserved.</p>

//       {/* Social Icons */}
//       <div className="flex justify-center gap-6 mt-4">
//         <motion.a
//           href="https://github.com/"
//           target="_blank"
//           rel="noopener noreferrer"
//           whileHover={{ scale: 1.2 }}
//           className="text-cyber-muted hover:text-cyber-blue transition"
//         >
//           <FaGithub size={20} />
//         </motion.a>
//         <motion.a
//           href="https://linkedin.com/"
//           target="_blank"
//           rel="noopener noreferrer"
//           whileHover={{ scale: 1.2 }}
//           className="text-cyber-muted hover:text-cyber-purple transition"
//         >
//           <FaLinkedin size={20} />
//         </motion.a>
//         <motion.a
//           href="https://twitter.com/"
//           target="_blank"
//           rel="noopener noreferrer"
//           whileHover={{ scale: 1.2 }}
//           className="text-cyber-muted hover:text-cyber-blue transition"
//         >
//           <FaTwitter size={20} />
//         </motion.a>
//       </div>
//     </motion.footer>
//   );
// }

// export default Footer;


// import React from "react";
// import { motion } from "framer-motion";
// import { fadeInUp } from "../../utils/motionVariants";
// import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
// import { Shield } from "lucide-react"; // Import Shield icon

// function Footer() {
//   return (
//     <motion.footer
//       variants={fadeInUp}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="relative z-10 border-t border-cyber-border bg-black/80 backdrop-blur py-12 text-center"
//     >
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Main Grid Layout */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
//           {/* Left: Brand & Tagline */}
//           <div className="flex flex-col items-center md:items-start">
//             <div className="flex items-center gap-2 mb-2">
//               <Shield className="text-cyber-purple" size={24} />
//               <span className="text-xl font-bold text-cyber-blue">Cyblib</span>
//             </div>
//             <p className="text-sm text-cyber-muted max-w-xs">
//               Secure Cyber Learning Platform. Your trusted partner for cyber security education.
//             </p>
//           </div>

//           {/* Middle: Quick Links */}
//           <div className="flex flex-col items-center md:items-start">
//             <h3 className="text-lg font-semibold text-cyber-blue mb-4">Quick Links</h3>
//             <ul className="space-y-2 text-sm">
//               <li><a href="#features" className="text-cyber-muted hover:text-cyber-blue transition">Features</a></li>
//               <li><a href="#team" className="text-cyber-muted hover:text-cyber-blue transition">Team</a></li>
//               <li><a href="#contact" className="text-cyber-muted hover:text-cyber-blue transition">Contact</a></li>
//             </ul>
//           </div>

//           {/* Right: Newsletter */}
//           <div className="flex flex-col items-center md:items-end">
//             <h3 className="text-lg font-semibold text-cyber-blue mb-4">Stay Updated</h3>
//             <p className="text-sm text-cyber-muted mb-4">Get the latest cyber security news and resources.</p>
//             <form className="flex w-full max-w-sm">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 rounded-l-lg bg-black border border-cyber-border text-cyber-text placeholder-cyber-muted focus:outline-none focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple"
//               />
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 rounded-r-lg font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-black shadow-glow"
//               >
//                 <FaEnvelope />
//               </motion.button>
//             </form>
//           </div>

//         </div>

//         {/* Bottom Divider */}
//         <div className="my-8 border-t border-cyber-border/50"></div>
        
//         {/* Copyright & Social Icons */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           <p className="text-sm text-cyber-muted">
//             &copy; {new Date().getFullYear()}{" "}
//             <span className="text-cyber-blue font-semibold">Cyblib</span> | All rights reserved.
//           </p>
          
//           <div className="flex gap-6">
//             <motion.a
//               href="https://github.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }} // Hover to cyber-blue
//               className="text-cyber-muted transition"
//             >
//               <FaGithub size={20} />
//             </motion.a>
//             <motion.a
//               href="https://linkedin.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#A855F7' }} // Hover to cyber-purple
//               className="text-cyber-muted transition"
//             >
//               <FaLinkedin size={20} />
//             </motion.a>
//             <motion.a
//               href="https://twitter.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }} // Hover to cyber-blue
//               className="text-cyber-muted transition"
//             >
//               <FaTwitter size={20} />
//             </motion.a>
//           </div>
//         </div>
//       </div>
//     </motion.footer>
//   );
// }

// export default Footer;


// import React from "react";
// import { motion } from "framer-motion";
// import { fadeInUp } from "../../utils/motionVariants";
// import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
// import { Shield } from "lucide-react";

// function Footer() {
//   return (
//     <motion.footer
//       variants={fadeInUp}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="relative z-10 border-t border-cyber-border bg-black/80 backdrop-blur py-12 text-center"
//     >
//       <div className="max-w-6xl mx-auto px-6">
//         {/* --- ROW 1: Brand and Newsletter --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-center md:text-left">
//           {/* Left: Brand & Tagline */}
//           <div className="flex flex-col items-center md:items-start">
//             <div className="flex items-center gap-2 mb-2">
//               <Shield className="text-cyber-purple" size={24} />
//               <span className="text-xl font-bold text-cyber-blue">Cyblib</span>
//             </div>
//             <p className="text-sm text-cyber-muted max-w-xs">
//               Secure Cyber Learning Platform. Your trusted partner for cyber security education.
//             </p>
//           </div>

//           {/* Right: Newsletter */}
//           <div className="flex flex-col items-center md:items-end">
//             <h3 className="text-lg font-semibold text-cyber-blue mb-4">Stay Updated</h3>
//             <p className="text-sm text-cyber-muted mb-4">Get the latest cyber security news and resources.</p>
//             <form className="flex w-full max-w-sm">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 rounded-l-lg bg-black border border-cyber-border text-cyber-text placeholder-cyber-muted focus:outline-none focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple"
//               />
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 rounded-r-lg font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-black shadow-glow"
//               >
//                 <FaEnvelope />
//               </motion.button>
//             </form>
//           </div>
//         </div>

//         {/* --- ROW 2: Quick Links --- */}
//         <div className="flex justify-center mb-8">
//           <div className="flex flex-col items-center">
//             <h3 className="text-lg font-semibold text-cyber-blue mb-4">Quick Links</h3>
//             <ul className="space-y-2 text-sm">
//               <li><a href="#features" className="text-cyber-muted hover:text-cyber-blue transition">Features</a></li>
//               <li><a href="#team" className="text-cyber-muted hover:text-cyber-blue transition">Team</a></li>
//               <li><a href="#contact" className="text-cyber-muted hover:text-cyber-blue transition">Contact</a></li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom Divider */}
//         <div className="my-8 border-t border-cyber-border/50"></div>
        
//         {/* Copyright & Social Icons */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           <p className="text-sm text-cyber-muted">
//             &copy; {new Date().getFullYear()}{" "}
//             <span className="text-cyber-blue font-semibold">Cyblib</span> | All rights reserved.
//           </p>
          
//           <div className="flex gap-6">
//             <motion.a
//               href="https://github.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }}
//               className="text-cyber-muted transition"
//             >
//               <FaGithub size={20} />
//             </motion.a>
//             <motion.a
//               href="https://linkedin.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#A855F7' }}
//               className="text-cyber-muted transition"
//             >
//               <FaLinkedin size={20} />
//             </motion.a>
//             <motion.a
//               href="https://twitter.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }}
//               className="text-cyber-muted transition"
//             >
//               <FaTwitter size={20} />
//             </motion.a>
//           </div>
//         </div>
//       </div>
//     </motion.footer>
//   );
// }

// export default Footer;


// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { fadeInUp } from "../../utils/motionVariants";
// import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
// import { Shield } from "lucide-react";

// function Footer() {
//   const [email, setEmail] = useState("");

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     // Add your newsletter subscription logic here
//     console.log("Subscribing with email:", email);
//     alert(`Thank you for subscribing with ${email}!`);
//     setEmail(""); // Clear the input field
//   };

//   return (
//     <motion.footer
//       variants={fadeInUp}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="relative z-10 border-t border-cyber-border bg-black/80 backdrop-blur py-12"
//     >
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Main Footer Content Row */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
//           {/* Left: Brand & Tagline */}
//           <div className="flex flex-col items-center md:items-start">
//             <div className="flex items-center gap-2 mb-3">
//               <Shield className="text-cyber-purple" size={28} />
//               <span className="text-xl font-bold text-cyber-blue">Cyblib</span>
//             </div>
//             <p className="text-sm text-cyber-muted max-w-xs">
//               From theory to practice, we build the future of cyber security education.
//             </p>
//           </div>

//           {/* Middle: Navigation Menu */}
//           <div className="flex flex-col items-center justify-center">
//             <nav>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a href="#features" className="text-cyber-muted hover:text-cyber-blue transition-colors duration-300">
//                     Features
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#team" className="text-cyber-muted hover:text-cyber-blue transition-colors duration-300">
//                     Our Work
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#contact" className="text-cyber-muted hover:text-cyber-blue transition-colors duration-300">
//                     Contact Us
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>

//           {/* Right: Newsletter Signup */}
//           <div className="flex flex-col items-center md:items-end">
//             <h3 className="text-lg font-semibold text-cyber-blue mb-1">Subscribe to our newsletter</h3>
//             <p className="text-xs text-cyber-muted mb-4">The latest news, articles, and resources, sent to your inbox weekly.</p>
//             <form onSubmit={handleSubscribe} className="flex w-full max-w-xs">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full px-3 py-2 rounded-l-lg bg-black/50 border border-cyber-border text-cyber-text placeholder-cyber-muted/70 focus:outline-none focus:ring-1 focus:ring-cyber-purple focus:border-cyber-purple"
//               />
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 rounded-r-lg font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-black shadow-glow"
//               >
//                 Subscribe
//               </motion.button>
//             </form>
//           </div>
//         </div>

//         {/* Bottom Divider */}
//         <div className="my-8 border-t border-cyber-border/50"></div>
        
//         {/* Copyright & Social Icons */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           <p className="text-xs text-cyber-muted">
//             Copyright {new Date().getFullYear()} © Cyblib - All Right Reserved.
//           </p>
          
//           <div className="flex gap-4">
//             <motion.a
//               href="https://github.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }} // Hover to cyber-blue
//               className="text-cyber-muted transition-colors duration-300"
//             >
//               <FaGithub size={18} />
//             </motion.a>
//             <motion.a
//               href="https://linkedin.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#A855F7' }} // Hover to cyber-purple
//               className="text-cyber-muted transition-colors duration-300"
//             >
//               <FaLinkedin size={18} />
//             </motion.a>
//             <motion.a
//               href="https://twitter.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }} // Hover to cyber-blue
//               className="text-cyber-muted transition-colors duration-300"
//             >
//               <FaTwitter size={18} />
//             </motion.a>
//           </div>
//         </div>
//       </div>
//     </motion.footer>
//   );
// }

// export default Footer;

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { fadeInUp } from "../../utils/motionVariants";
// import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
// import { Shield } from "lucide-react";
// import { HashLink } from "react-router-hash-link"; // Import HashLink for navigation

// function Footer() {
//   const [email, setEmail] = useState("");

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     console.log("Subscribing with email:", email);
//     alert(`Thank you for subscribing with ${email}!`);
//     setEmail("");
//   };

//   return (
//     <motion.footer
//       variants={fadeInUp}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="relative z-10 border-t border-cyber-border bg-black/80 backdrop-blur py-12"
//     >
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Main Footer Content Row - 3 Columns */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
//           {/* Left: Brand & Tagline */}
//           <div className="flex flex-col items-center md:items-start">
//             <div className="flex items-center gap-2 mb-3">
//               <Shield className="text-cyber-purple" size={28} />
//               <span className="text-xl font-bold text-cyber-blue">Cyblib</span>
//             </div>
//             <p className="text-sm text-cyber-muted max-w-xs">
//               From theory to practice, we build the future of cyber security education.
//             </p>
//           </div>

//           {/* Middle: Navigation Menu */}
//           <div className="flex flex-col items-center justify-center">
//             <nav>
//               <ul className="space-y-2 text-sm font-medium">
//                 <li>
//                   <HashLink smooth to="/#features" className="text-cyber-muted hover:text-cyber-blue transition-colors duration-300">
//                     Home
//                   </HashLink>
//                 </li>
//                 <li>
//                   <HashLink smooth to="/#features" className="text-cyber-muted hover:text-cyber-blue transition-colors duration-300">
//                     Services
//                   </HashLink>
//                 </li>
//                 <li>
//                   <HashLink smooth to="/#team" className="text-cyber-muted hover:text-cyber-blue transition-colors duration-300">
//                     Our Work
//                   </HashLink>
//                 </li>
//                 <li>
//                   <HashLink smooth to="/#contact" className="text-cyber-muted hover:text-cyber-blue transition-colors duration-300">
//                     Contact Us
//                   </HashLink>
//                 </li>
//               </ul>
//             </nav>
//           </div>

//           {/* Right: Newsletter Signup */}
//           <div className="flex flex-col items-center md:items-end">
//             <h3 className="text-lg font-semibold text-cyber-blue mb-1">Subscribe to our newsletter</h3>
//             <p className="text-xs text-cyber-muted mb-4">The latest news, articles, and resources, sent to your inbox weekly.</p>
//             <form onSubmit={handleSubscribe} className="flex w-full max-w-xs">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full px-3 py-2 rounded-l-lg bg-black/50 border border-cyber-border text-cyber-text placeholder-cyber-muted/70 focus:outline-none focus:ring-1 focus:ring-cyber-purple focus:border-cyber-purple"
//               />
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-4 py-2 rounded-r-lg font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-black shadow-glow"
//               >
//                 Subscribe
//               </motion.button>
//             </form>
//           </div>
//         </div>

//         {/* Bottom Divider */}
//         <div className="my-8 border-t border-cyber-border/50"></div>
        
//         {/* Copyright & Social Icons */}
//         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//           <p className="text-xs text-cyber-muted">
//             Copyright {new Date().getFullYear()} © Cyblib - All Right Reserved.
//           </p>
          
//           <div className="flex gap-4">
//             <motion.a
//               href="https://github.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }}
//               className="text-cyber-muted transition-colors duration-300"
//             >
//               <FaGithub size={18} />
//             </motion.a>
//             <motion.a
//               href="https://linkedin.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#A855F7' }}
//               className="text-cyber-muted transition-colors duration-300"
//             >
//               <FaLinkedin size={18} />
//             </motion.a>
//             <motion.a
//               href="https://twitter.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2, color: '#60A5FA' }}
//               className="text-cyber-muted transition-colors duration-300"
//             >
//               <FaTwitter size={18} />
//             </motion.a>
//           </div>
//         </div>
//       </div>
//     </motion.footer>
//   );
// }

// export default Footer;

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { fadeInUp } from "../../utils/motionVariants";
// import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
// import { Shield } from "lucide-react";
// import { HashLink } from "react-router-hash-link";

// function Footer() {
//   const [email, setEmail] = useState("");

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     alert(`Thank you for subscribing with ${email}!`);
//     setEmail("");
//   };

//   return (
//     <motion.footer
//       variants={fadeInUp}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="relative z-10 py-16"
//     >
//       {/* Glass Container */}
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="rounded-2xl border border-cyber-border bg-black/70 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.15)] px-10 py-12">

//           {/* Top Content */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            
//             {/* Brand */}
//             <div>
//               <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
//                 <Shield className="text-cyber-purple" size={26} />
//                 <span className="text-xl font-semibold text-white">Cyblib</span>
//               </div>
//               <p className="text-sm text-cyber-muted max-w-xs mx-auto md:mx-0">
//                 From theory to practice, we build the future of cyber security education.
//               </p>

//               <ul className="mt-6 space-y-2 text-sm">
//                 <li>
//                   <HashLink smooth to="/#features" className="hover:text-cyber-blue transition">
//                     Features
//                   </HashLink>
//                 </li>
//                 <li>
//                   <HashLink smooth to="/#work" className="hover:text-cyber-blue transition">
//                     Our Work
//                   </HashLink>
//                 </li>
//                 <li>
//                   <HashLink smooth to="/#contact" className="hover:text-cyber-blue transition">
//                     Contact Us
//                   </HashLink>
//                 </li>
//               </ul>
//             </div>

//             {/* Empty middle column for spacing (as in image) */}
//             <div />

//             {/* Newsletter */}
//             <div className="flex flex-col items-center md:items-end">
//               <h3 className="text-lg font-semibold text-white mb-1">
//                 Subscribe to our newsletter
//               </h3>
//               <p className="text-sm text-cyber-muted mb-5 max-w-sm text-center md:text-right">
//                 The latest news, articles, and resources, sent to your inbox weekly.
//               </p>

//               <form
//                 onSubmit={handleSubscribe}
//                 className="flex w-full max-w-sm bg-black/60 border border-cyber-border rounded-full overflow-hidden"
//               >
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Email address"
//                   className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-cyber-muted focus:outline-none"
//                 />
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-6 text-sm font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-black"
//                 >
//                   Subscribe
//                 </motion.button>
//               </form>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="my-10 border-t border-cyber-border/40" />

//           {/* Bottom Row */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             <p className="text-xs text-cyber-muted">
//               Copyright {new Date().getFullYear()} © Cyblib – All Rights Reserved.
//             </p>

//             <div className="flex gap-5">
//               <motion.a
//                 href="https://github.com/"
//                 target="_blank"
//                 whileHover={{ scale: 1.2 }}
//                 className="text-cyber-muted hover:text-cyber-blue"
//               >
//                 <FaGithub size={18} />
//               </motion.a>

//               <motion.a
//                 href="https://linkedin.com/"
//                 target="_blank"
//                 whileHover={{ scale: 1.2 }}
//                 className="text-cyber-muted hover:text-cyber-purple"
//               >
//                 <FaLinkedin size={18} />
//               </motion.a>

//               <motion.a
//                 href="https://twitter.com/"
//                 target="_blank"
//                 whileHover={{ scale: 1.2 }}
//                 className="text-cyber-muted hover:text-cyber-blue"
//               >
//                 <FaTwitter size={18} />
//               </motion.a>
//             </div>
//           </div>

//         </div>
//       </div>
//     </motion.footer>
//   );
// }

// export default Footer;

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { fadeInUp } from "../../utils/motionVariants";
// import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
// import { Shield } from "lucide-react";
// import { HashLink } from "react-router-hash-link";

// function Footer() {
//   const [email, setEmail] = useState("");

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     alert(`Thank you for subscribing with ${email}!`);
//     setEmail("");
//   };

//   return (
//     <motion.footer
//       variants={fadeInUp}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       transition={{ duration: 0.6 }}
//       className="relative z-10 w-full border-t border-cyber-border bg-black/80 backdrop-blur-xl"
//     >
//       {/* Footer Content */}
//       <div className="max-w-7xl mx-auto px-6 py-14">

//         {/* Top Content */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

//           {/* Brand */}
//           <div>
//             <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
//               <Shield className="text-cyber-purple" size={26} />
//               <span className="text-xl font-semibold cyber-purple">cyb.lib</span>
//             </div>

//             <p className="text-sm text-cyber-muted max-w-xs mx-auto md:mx-0">
//               From theory to practice, we build the future of cyber security education.
//             </p>

//             <ul className="mt-6 space-y-2 text-sm">
//               <li>
//                 <HashLink smooth to="#features" className="hover:text-cyber-blue transition">
//                   Features
//                 </HashLink>
//               </li>
//               <li>
//                 <HashLink smooth to="#work" className="hover:text-cyber-blue transition">
//                   Our Work
//                 </HashLink>
//               </li>
//               <li>
//                 <HashLink smooth to="#contact" className="hover:text-cyber-blue transition">
//                   Contact Us
//                 </HashLink>
//               </li>
//             </ul>
//           </div>

//           {/* Spacer */}
//           <div />

//          {/* Newsletter */}
// <div className="flex flex-col items-start text-left">
//   <h3 className="text-lg font-semibold text-white mb-1">
//     Subscribe to our newsletter
//   </h3>
//   <p className="text-sm text-cyber-muted mb-5 max-w-sm text-left">
//     The latest news, articles, and resources, sent to your inbox weekly.
//   </p>

//   <form
//     onSubmit={handleSubscribe}
//     className="flex w-full max-w-sm bg-black/60 border border-cyber-border rounded-full overflow-hidden"
//   >
//     <input
//       type="email"
//       required
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       placeholder="Email address"
//       className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-cyber-muted focus:outline-none"
//     />
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       className="px-6 text-sm font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-black"
//     >
//       Subscribe
//     </motion.button>
//   </form>
// </div>

//         </div>

//         {/* Divider */}
//         <div className="my-10 border-t border-cyber-border/40" />

//         {/* Bottom Row */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           <p className="text-xs text-cyber-muted">
//             Copyright {new Date().getFullYear()} © Cyblib – All Rights Reserved.
//           </p>

//           <div className="flex gap-5">
//             <motion.a
//               href="https://github.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2 }}
//               className="text-cyber-muted hover:text-cyber-blue"
//             >
//               <FaGithub size={18} />
//             </motion.a>

//             <motion.a
//               href="https://linkedin.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2 }}
//               className="text-cyber-muted hover:text-cyber-purple"
//             >
//               <FaLinkedin size={18} />
//             </motion.a>

//             <motion.a
//               href="https://twitter.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               whileHover={{ scale: 1.2 }}
//               className="text-cyber-muted hover:text-cyber-blue"
//             >
//               <FaTwitter size={18} />
//             </motion.a>
//           </div>
//         </div>

//       </div>
//     </motion.footer>
//   );
// }

// export default Footer;


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
      className="relative z-10 w-full bg-black/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Glowing Top Border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-90" />
      <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent blur-md opacity-60" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-14">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-cyber-purple" size={26} />
              <span className="text-xl font-semibold text-white">Cyblib</span>
            </div>

            <p className="text-sm text-cyber-muted max-w-sm">
              From theory to practice, we build the future of cyber security education.
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <HashLink smooth to="#features" className="hover:text-cyber-blue transition">
                  Features
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="#work" className="hover:text-cyber-blue transition">
                  Our Work
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
            <h3 className="text-lg font-semibold text-white mb-1">
              Subscribe to our newsletter
            </h3>

            <p className="text-sm text-cyber-muted mb-5 max-w-sm">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-sm rounded-full overflow-hidden border border-cyber-border bg-black/60"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-cyber-muted focus:outline-none"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 text-sm font-medium bg-gradient-to-r from-cyber-purple to-cyber-blue text-black"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-cyber-border/40" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cyber-muted">
            © {new Date().getFullYear()} Cyblib. All rights reserved.
          </p>

          <div className="flex gap-5">
            <motion.a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="text-cyber-muted hover:text-cyber-blue"
            >
              <FaGithub size={18} />
            </motion.a>

            <motion.a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="text-cyber-muted hover:text-cyber-purple"
            >
              <FaLinkedin size={18} />
            </motion.a>

            <motion.a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="text-cyber-muted hover:text-cyber-blue"
            >
              <FaTwitter size={18} />
            </motion.a>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}

export default Footer;
