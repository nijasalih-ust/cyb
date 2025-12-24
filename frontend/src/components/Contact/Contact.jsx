import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../../utils/motionVariants";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <motion.section
      id="contact"
      className="py-20 max-w-3xl mx-auto px-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.h2
        variants={fadeInUp}
        className="text-3xl font-extrabold text-center text-cyber-purple mb-4"
      >
        Reach out to us
      </motion.h2>

      <motion.p
        variants={fadeInUp}
        className="text-center text-cyber-text-secondary text-base mb-10"
      >
        From strategy to execution, we craft digital solutions that move your business forward.
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        variants={fadeInUp}
        className="cyber-card space-y-6"
      >
        <div>
          <label className="block text-sm text-cyber-text-secondary mb-1">Your name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
            className="cyber-input"
          />
        </div>

        <div>
          <label className="block text-sm text-cyber-text-secondary mb-1">Email id</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="cyber-input"
          />
        </div>

        <div>
          <label className="block text-sm text-cyber-text-secondary mb-1">Message</label>
          <textarea
            name="message"
            placeholder="Enter your message"
            rows="4"
            value={form.message}
            onChange={handleChange}
            required
            className="cyber-input"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 rounded-lg font-medium bg-gradient-to-r
                     from-cyber-purple to-cyber-blue text-cyber-text-primary shadow-glow flex items-center justify-center gap-2"
        >
          Submit <span className="text-lg">→</span>
        </motion.button>
      </motion.form>
    </motion.section>
  );
}

export default Contact;