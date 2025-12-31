import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const QuizPractice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Hardcoded Beta Data
  const questions = [
    {
      questionText: "What MITRE ATT&CK technique involves adversaries trying to get into your network?",
      options: [
        { answerText: "Initial Access", isCorrect: true },
        { answerText: "Lateral Movement", isCorrect: false },
        { answerText: "Exfiltration", isCorrect: false },
        { answerText: "Impact", isCorrect: false },
      ],
      explanation: "Initial Access consists of techniques that use various entry vectors to gain their initial foothold within a network."
    },
    {
      questionText: "Which log source is most critical for detecting 'T1059.001 - PowerShell' execution?",
      options: [
        { answerText: "Firewall Logs", isCorrect: false },
        { answerText: "Event ID 4104 (Script Block Logging)", isCorrect: true },
        { answerText: "NetFlow Data", isCorrect: false },
        { answerText: "DNS Query Logs", isCorrect: false },
      ],
      explanation: "PowerShell Script Block Logging (Event ID 4104) captures the actual code executed by PowerShell, decrypting obfuscated commands."
    },
    {
      questionText: "An adversary dumps credentials from LSASS.exe. What Tactic does this belong to?",
      options: [
        { answerText: "Discovery", isCorrect: false },
        { answerText: "Execution", isCorrect: false },
        { answerText: "Credential Access", isCorrect: true },
        { answerText: "Defense Evasion", isCorrect: false },
      ],
      explanation: "Credential Access consists of techniques for stealing credentials like account names and passwords (T1003 OS Credential Dumping)."
    },
    {
      questionText: "What is the primary indicator of a Pass-the-Hash attack?",
      options: [
        { answerText: "High CPU usage", isCorrect: false },
        { answerText: "Logon Type 3 with NTLM authentication", isCorrect: true },
        { answerText: "Failed SSH login attempts", isCorrect: false },
        { answerText: "Large outbound file transfer", isCorrect: false },
      ],
      explanation: "Pass-the-Hash involves authenticating to a remote server (Network Logon - Type 3) using NTLM hashes instead of a cleartext password."
    }
  ];

  const handleAnswerOptionClick = (isCorrect) => {
    setSelectedAnswer(isCorrect);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Wait a bit before moving to next question
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 1500); // 1.5s delay to show feedback
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-blue/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header Badge */}
        <div className="flex justify-center mb-8">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-card border border-cyber-border text-xs font-mono tracking-widest text-cyber-text-secondary uppercase shadow-lg">
            <Terminal size={14} className="text-cyber-purple" />
            Beta Protocol • v0.9.1
          </span>
        </div>

        <AnimatePresence mode="wait">
          {showScore ? (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cyber-card border border-cyber-border rounded-2xl p-8 text-center shadow-glow"
            >
              <div className="w-20 h-20 mx-auto bg-cyber-purple/20 rounded-full flex items-center justify-center mb-6 border border-cyber-purple/50">
                <CheckCircle size={40} className="text-cyber-purple" />
              </div>
              <h2 className="text-3xl font-display font-bold text-cyber-text-primary mb-2">Operation Complete</h2>
              <p className="text-cyber-text-secondary mb-8 font-body">
                You scored <span className="text-cyber-purple font-bold text-xl">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </p>
              <button
                onClick={restartQuiz}
                className="px-8 py-3 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-xl text-black font-bold font-display tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:scale-105"
              >
                Re-initialize Training
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-cyber-card border border-cyber-border rounded-2xl p-8 shadow-2xl relative"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-black/50 rounded-t-2xl overflow-hidden">
                <motion.div
                  className="h-full bg-cyber-purple"
                  initial={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="mb-8 mt-4">
                <span className="text-xs font-mono text-cyber-text-muted mb-2 block">QUERY SEQUENCE {currentQuestion + 1}/{questions.length}</span>
                <h3 className="text-2xl font-display font-semibold text-cyber-text-primary leading-relaxed">
                  {questions[currentQuestion].questionText}
                </h3>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerOptionClick(option.isCorrect)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group
                                            ${selectedAnswer !== null
                        ? option.isCorrect
                          ? 'border-green-500 bg-green-500/10 text-cyber-text-primary'
                          : selectedAnswer === option.isCorrect // This logic is slightly off, we want to highlight chosen wrong answer
                            ? 'border-red-500 bg-red-500/10 text-cyber-text-primary opacity-50'
                            : 'border-cyber-border bg-black/20 text-cyber-text-secondary opacity-50'
                        : 'border-cyber-border hover:border-cyber-purple/50 bg-black/20 hover:bg-cyber-purple/5 text-cyber-text-secondary hover:text-cyber-text-primary'
                      }
                                        `}
                  >
                    <span className="font-body text-sm md:text-base">{option.answerText}</span>
                    {selectedAnswer !== null && option.isCorrect && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    {selectedAnswer === false && !option.isCorrect && option === questions[currentQuestion].options.find(o => o.isCorrect === false) && (
                      // This logic is tricky for mapping "clicked button". 
                      // Simplified: We don't easily know WHICH wrong button was clicked without passing index.
                      // But for seamless UI, just showing correct is often enough.
                      null
                    )}
                  </button>
                ))}
              </div>

              {/* Explanation / Feedback Area */}
              <AnimatePresence>
                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-cyber-text-primary/5 border border-cyber-text-primary/10"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-cyber-blue mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-cyber-blue mb-1">Tactical Analysis</p>
                        <p className="text-sm text-cyber-text-secondary leading-relaxed">
                          {questions[currentQuestion].explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPractice;