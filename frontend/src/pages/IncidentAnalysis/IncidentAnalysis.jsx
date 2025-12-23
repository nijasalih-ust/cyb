import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const IncidentAnalysisPage = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentView, setCurrentView] = useState('learning-path'); // 'learning-path', 'briefing', 'simulation'
  const [logs, setLogs] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const operations = [
    {
      id: 'network-scanning',
      module: '01',
      title: 'Network Scanning',
      description: 'Detecting Nmap scans and heavy port activity.',
      briefing: 'Learn about Detecting Nmap scans and heavy port activity. This maps to **T1595** in MITRE ATT&CK.',
      keyIndicators: [
        'High volume of traffic',
        'Abnormal port usage'
      ],
      incident: {
        question: 'Which IP is performing the scan?',
        options: ['T1595', 'T1000', 'T1200', 'T1500'],
        correct: 'T1595'
      },
      logs: [
        { time: '10:10:16 am', source: 'Firewall', message: 'DENY from 192.168.1.50' },
        { time: '10:10:16 am', source: 'Firewall', message: 'DENY from 192.168.1.50' },
        { time: '10:10:16 am', source: 'Firewall', message: 'DENY from 10.0.0.2' }
      ]
    },
    {
      id: 'brute-force',
      module: '02',
      title: 'Brute Force SSH',
      description: 'Identifying failed login attempts.',
      briefing: 'Learn about identifying patterns of failed SSH login attempts. This maps to **T1110** in MITRE ATT&CK.',
      keyIndicators: [
        'Multiple failed login attempts',
        'Same source IP targeting SSH port'
      ],
      incident: {
        question: 'How many failed attempts were detected?',
        options: ['5', '12', '23', '47'],
        correct: '23'
      },
      logs: [
        { time: '11:23:45 am', source: 'SSH', message: 'Failed login for user admin from 203.0.113.42' },
        { time: '11:23:46 am', source: 'SSH', message: 'Failed login for user root from 203.0.113.42' },
        { time: '11:23:47 am', source: 'SSH', message: 'Failed login for user admin from 203.0.113.42' }
      ]
    },
    {
      id: 'phishing',
      module: '03',
      title: 'Phishing',
      description: 'Analyzing suspicious email headers.',
      briefing: 'Learn about detecting phishing attempts through email header analysis. This maps to **T1566** in MITRE ATT&CK.',
      keyIndicators: [
        'Spoofed sender addresses',
        'Suspicious attachments or links'
      ],
      incident: {
        question: 'Which domain is spoofed in the email?',
        options: ['paypal.com', 'paypa1.com', 'microsoft.com', 'google.com'],
        correct: 'paypa1.com'
      },
      logs: [
        { time: '14:32:11 pm', source: 'Email Gateway', message: 'Suspicious email from support@paypa1.com' },
        { time: '14:32:12 pm', source: 'Email Gateway', message: 'Attachment detected: invoice.zip' },
        { time: '14:32:13 pm', source: 'Email Gateway', message: 'SPF check failed for sender domain' }
      ]
    },
    {
      id: 'command-injection',
      module: '04',
      title: 'Command Injection',
      description: 'Detecting shell commands in web logs.',
      briefing: 'Learn about identifying command injection attacks in web application logs. This maps to **T1059** in MITRE ATT&CK.',
      keyIndicators: [
        'Shell metacharacters in requests',
        'Unusual URL parameters'
      ],
      incident: {
        question: 'Which parameter contains the injection?',
        options: ['user_id', 'search', 'cmd', 'page'],
        correct: 'cmd'
      },
      logs: [
        { time: '16:45:23 pm', source: 'Web Server', message: 'GET /search?cmd=ls%20-la HTTP/1.1' },
        { time: '16:45:24 pm', source: 'Web Server', message: 'GET /search?cmd=cat%20/etc/passwd HTTP/1.1' },
        { time: '16:45:25 pm', source: 'Web Server', message: 'Response code: 200 OK' }
      ]
    }
  ];

  const currentOperation = operations.find(op => op.id === selectedModule);

  // Simulate log streaming
  useEffect(() => {
    if (currentView === 'simulation' && currentOperation) {
      let index = 0;
      setLogs([]);
      
      const interval = setInterval(() => {
        if (index < currentOperation.logs.length) {
          setLogs(prev => [...prev, currentOperation.logs[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [currentView, currentOperation]);

  const handleOperationClick = (operationId) => {
    setSelectedModule(operationId);
    setCurrentView('briefing');
    setSelectedAnswer(null);
  };

  const handleStartSimulation = () => {
    setCurrentView('simulation');
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleBackToLearningPath = () => {
    setCurrentView('learning-path');
    setSelectedModule(null);
    setSelectedAnswer(null);
  };

  // Learning Path View
  if (currentView === 'learning-path') {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Learning Path: SOC Analyst Level 1</h1>
            </div>
          </div>

          {/* Operations List */}
          <div className="space-y-4">
            {operations.map((operation) => (
              <button
                key={operation.id}
                onClick={() => handleOperationClick(operation.id)}
                className="w-full bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500 transition-all text-left group"
              >
                <p className="text-purple-400 text-xs font-bold mb-2 tracking-wider">
                  MODULE {operation.module}
                </p>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition">
                  {operation.title}
                </h3>
                <p className="text-gray-400">{operation.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Briefing View
  if (currentView === 'briefing' && currentOperation) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToLearningPath}
            className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Learning Path
          </button>

          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-2 tracking-wider">OPERATION</p>
            <h1 className="text-4xl font-bold">{currentOperation.title}</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            <button className="px-6 py-2 bg-purple-600 rounded-lg font-medium">
              1. Briefing
            </button>
            <button className="px-6 py-2 bg-gray-800 rounded-lg font-medium text-gray-400">
              2. Simulation
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Operation Details */}
            <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4">{currentOperation.title}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{currentOperation.briefing}</p>
              
              <h3 className="text-purple-400 font-bold mb-3 text-lg">Key Indicators</h3>
              <ul className="space-y-2">
                {currentOperation.keyIndicators.map((indicator, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Intel Briefing */}
            <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-purple-400 mb-4">Intel Briefing</h2>
                <p className="text-gray-300 leading-relaxed">
                  Review the intelligence report on the left. Once you understand the attack pattern, proceed to the simulation environment.
                </p>
              </div>
              <button
                onClick={handleStartSimulation}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition font-medium flex items-center justify-center gap-2 mt-8"
              >
                Initialize Simulation →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Simulation View
  if (currentView === 'simulation' && currentOperation) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setCurrentView('briefing')}
            className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Briefing
          </button>

          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-2 tracking-wider">OPERATION</p>
            <h1 className="text-4xl font-bold">{currentOperation.title}</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            <button 
              onClick={() => setCurrentView('briefing')}
              className="px-6 py-2 bg-gray-800 rounded-lg font-medium text-gray-400 hover:text-white transition"
            >
              1. Briefing
            </button>
            <button className="px-6 py-2 bg-purple-600 rounded-lg font-medium">
              2. Simulation
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Live Telemetry */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold">Live Telemetry</h2>
                <span className="flex items-center gap-2 text-red-400 text-sm">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                  LIVE STREAM
                </span>
              </div>
              
              <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
                <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-sm ml-2">System Logs</span>
                </div>
                <div className="p-4 font-mono text-sm h-96 overflow-y-auto bg-black/50">
                  {logs.map((log, index) => (
                    <div key={index} className="mb-2 text-gray-300">
                      <span className="text-gray-500">{log.time}</span>
                      <span className="mx-2 text-blue-400">{log.source}</span>
                      <span className="text-gray-300">{log.message}</span>
                    </div>
                  ))}
                  {logs.length > 0 && <span className="text-green-400 animate-pulse">▊</span>}
                </div>
              </div>
            </div>

            {/* Right: Incident Question */}
            <div>
              <h2 className="text-xl font-bold mb-4">Incident #1</h2>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <p className="text-lg mb-6 text-gray-200">{currentOperation.incident.question}</p>
                <div className="space-y-3">
                  {currentOperation.incident.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={selectedAnswer !== null}
                      className={`w-full py-4 px-6 rounded-lg border-2 transition text-left font-mono ${
                        selectedAnswer === option
                          ? option === currentOperation.incident.correct
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-red-500 bg-red-500/10 text-red-400'
                          : selectedAnswer === null
                          ? 'border-gray-700 hover:border-purple-500 bg-gray-800/50 hover:bg-gray-800 text-gray-200'
                          : 'border-gray-800 bg-gray-900/30 text-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {selectedAnswer && (
                  <div className={`mt-6 p-4 rounded-lg border ${
                    selectedAnswer === currentOperation.incident.correct
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-red-500/10 border-red-500'
                  }`}>
                    <p className={`font-bold ${
                      selectedAnswer === currentOperation.incident.correct
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {selectedAnswer === currentOperation.incident.correct
                        ? '✓ Correct! Well done, analyst.'
                        : '✗ Incorrect. Review the logs and try again.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default IncidentAnalysisPage;