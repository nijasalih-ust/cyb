// Multiple SIEM scenarios for assessment
export const scenarios = [
  {
    id: 1,
    title: "Internal Network Scanning",
    difficulty: "Medium",
    category: "Discovery",
    description: "Investigate suspicious network scanning activity from an internal workstation",
    currentScenario: 1,
    totalScenarios: 12,
    
    alerts: [
      {
        id: "A001",
        severity: "high",
        name: "Port Scan Detected",
        source: "WS-23 (10.20.5.142)",
        time: "2025-12-28 14:23:14",
        description: "Multiple port connection attempts detected from internal workstation",
        details: {
          sourceHost: "WS-23",
          sourceIP: "10.20.5.142",
          targetCount: 47,
          portRange: "20-8080",
          protocol: "TCP"
        }
      },
      {
        id: "A002",
        severity: "medium",
        name: "Unusual Outbound Traffic",
        source: "WS-23 (10.20.5.142)",
        time: "2025-12-28 14:28:51",
        description: "High volume of outbound connections to external IP",
        details: {
          sourceHost: "WS-23",
          destIP: "203.0.113.47",
          bytesTransferred: "2.3 MB",
          connections: 127
        }
      },
      {
        id: "A003",
        severity: "low",
        name: "Failed Login Attempt",
        source: "DC-01 (10.20.1.10)",
        time: "2025-12-28 14:15:02",
        description: "Single failed authentication attempt",
        details: {
          user: "admin",
          sourceIP: "10.20.5.89",
          attempts: 1
        }
      },
      {
        id: "A004",
        severity: "info",
        name: "Windows Update Service Started",
        source: "WS-23 (10.20.5.142)",
        time: "2025-12-28 14:10:33",
        description: "Automatic updates service initiated",
        details: {
          service: "wuauserv",
          user: "SYSTEM"
        }
      },
      {
        id: "A005",
        severity: "medium",
        name: "SMB Connection from Workstation",
        source: "WS-23 (10.20.5.142)",
        time: "2025-12-28 14:29:14",
        description: "Workstation initiated SMB connection to file server",
        details: {
          sourceHost: "WS-23",
          destHost: "FS-02",
          destIP: "10.20.3.15",
          port: 445
        }
      },
      {
        id: "A006",
        severity: "critical",
        name: "Potential Data Exfiltration",
        source: "WS-23 (10.20.5.142)",
        time: "2025-12-28 14:32:07",
        description: "Large file upload to cloud storage service",
        details: {
          sourceHost: "WS-23",
          destDomain: "fileupload.cloud",
          fileSize: "847 MB",
          protocol: "HTTPS"
        }
      },
      {
        id: "A007",
        severity: "low",
        name: "DNS Query to External Resolver",
        source: "WS-23 (10.20.5.142)",
        time: "2025-12-28 14:20:18",
        description: "Workstation queried external DNS server",
        details: {
          query: "update.microsoft.com",
          resolver: "8.8.8.8"
        }
      },
      {
        id: "A008",
        severity: "high",
        name: "Suspicious PowerShell Execution",
        source: "WS-23 (10.20.5.142)",
        time: "2025-12-28 14:21:45",
        description: "PowerShell executed with network-related cmdlets",
        details: {
          user: "jdoe",
          command: "Test-NetConnection",
          parent: "explorer.exe"
        }
      }
    ],
    
    logs: [
      { timestamp: "2025-12-28 14:10:33", host: "WS-23", user: "SYSTEM", srcIP: "-", dstIP: "-", eventType: "Service Start", message: "Windows Update service (wuauserv) started" },
      { timestamp: "2025-12-28 14:15:02", host: "DC-01", user: "admin", srcIP: "10.20.5.89", dstIP: "10.20.1.10", eventType: "Auth Failure", message: "Logon failure: unknown user name or bad password" },
      { timestamp: "2025-12-28 14:20:18", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "8.8.8.8", eventType: "DNS Query", message: "DNS query for update.microsoft.com" },
      { timestamp: "2025-12-28 14:21:45", host: "WS-23", user: "jdoe", srcIP: "-", dstIP: "-", eventType: "Process Start", message: "powershell.exe -Command Test-NetConnection -ComputerName 10.20.1.10 -Port 445" },
      { timestamp: "2025-12-28 14:23:14", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.10", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.10:445" },
      { timestamp: "2025-12-28 14:23:15", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.10", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.10:3389" },
      { timestamp: "2025-12-28 14:23:15", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.11", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.11:445" },
      { timestamp: "2025-12-28 14:23:16", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.11", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.11:3389" },
      { timestamp: "2025-12-28 14:23:16", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.12", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.12:22" },
      { timestamp: "2025-12-28 14:23:17", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.12", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.12:80" },
      { timestamp: "2025-12-28 14:23:17", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.13", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.13:443" },
      { timestamp: "2025-12-28 14:23:18", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.13", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.13:8080" },
      { timestamp: "2025-12-28 14:23:18", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.14", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.14:445" },
      { timestamp: "2025-12-28 14:23:19", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.14", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.14:135" },
      { timestamp: "2025-12-28 14:23:19", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.15", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.15:21" },
      { timestamp: "2025-12-28 14:23:20", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.1.15", eventType: "TCP Connect", message: "TCP connection attempt to 10.20.1.15:23" },
      { timestamp: "2025-12-28 14:28:51", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "203.0.113.47", eventType: "HTTPS", message: "Outbound HTTPS connection established to 203.0.113.47:443" },
      { timestamp: "2025-12-28 14:28:52", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "203.0.113.47", eventType: "Data Transfer", message: "Transferred 524288 bytes to 203.0.113.47" },
      { timestamp: "2025-12-28 14:28:54", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "203.0.113.47", eventType: "Data Transfer", message: "Transferred 1048576 bytes to 203.0.113.47" },
      { timestamp: "2025-12-28 14:29:14", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.3.15", eventType: "SMB", message: "SMB connection to \\\\FS-02\\shared" },
      { timestamp: "2025-12-28 14:29:15", host: "FS-02", user: "jdoe", srcIP: "10.20.5.142", dstIP: "10.20.3.15", eventType: "File Access", message: "User jdoe accessed quarterly_reports.zip" },
      { timestamp: "2025-12-28 14:32:07", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "104.26.12.87", eventType: "HTTPS", message: "Large file upload to fileupload.cloud detected" },
      { timestamp: "2025-12-28 14:32:08", host: "WS-23", user: "jdoe", srcIP: "10.20.5.142", dstIP: "104.26.12.87", eventType: "Data Transfer", message: "Uploaded 247463936 bytes (847 MB total)" },
    ],
    
    timeline: {
      host: "WS-23",
      events: [
        { time: "14:10:33", event: "Windows Update service started", type: "info" },
        { time: "14:20:18", event: "DNS query to external resolver (8.8.8.8)", type: "info" },
        { time: "14:21:45", event: "PowerShell executed: Test-NetConnection", type: "suspicious" },
        { time: "14:23:14", event: "Port scanning activity initiated (47 targets)", type: "malicious" },
        { time: "14:28:51", event: "Outbound HTTPS to 203.0.113.47", type: "suspicious" },
        { time: "14:29:14", event: "SMB connection to file server FS-02", type: "info" },
        { time: "14:29:15", event: "Accessed quarterly_reports.zip", type: "suspicious" },
        { time: "14:32:07", event: "Large file upload (847 MB) to cloud storage", type: "malicious" }
      ]
    },
    
    mitreMapping: {
      correct: "T1046",
      techniques: [
        { id: "T1046", name: "Network Service Discovery", tactic: "Discovery" },
        { id: "T1071", name: "Application Layer Protocol", tactic: "Command and Control" },
        { id: "T1048", name: "Exfiltration Over Alternative Protocol", tactic: "Exfiltration" },
        { id: "T1021", name: "Remote Services", tactic: "Lateral Movement" }
      ]
    },
    
    expectedAssessment: "malicious",
    expectedAction: "escalate",
    
    explanation: {
      summary: "This scenario represents a multi-stage attack involving network reconnaissance followed by data exfiltration.",
      attackPath: [
        "Attacker used PowerShell to initiate network scanning (Test-NetConnection)",
        "Performed comprehensive port scanning of internal network (47 targets)",
        "Accessed file server via SMB and located sensitive data (quarterly_reports.zip)",
        "Exfiltrated 847 MB of data to external cloud storage service"
      ],
      correctMitre: "T1046 (Network Service Discovery)",
      keyEvidence: [
        "Alert A001: Port scanning from WS-23",
        "Alert A006: Large file upload to cloud storage",
        "PowerShell network cmdlet execution",
        "File server access followed by external data transfer"
      ],
      redHerrings: [
        "Windows Update service start is benign",
        "Single failed login is low risk",
        "DNS query to 8.8.8.8 could be legitimate troubleshooting"
      ],
      recommendedAction: "Escalate - This is active data exfiltration requiring immediate incident response"
    }
  },
  
  {
    id: 2,
    title: "Credential Stuffing Attack",
    difficulty: "Easy",
    category: "Initial Access",
    description: "Multiple failed login attempts followed by successful authentication",
    currentScenario: 2,
    totalScenarios: 12,
    
    alerts: [
      {
        id: "B001",
        severity: "critical",
        name: "Multiple Failed Logins",
        source: "External (185.220.101.45)",
        time: "2025-12-28 22:15:03",
        description: "127 failed login attempts in 5 minutes",
        details: {
          sourceIP: "185.220.101.45",
          targetUsers: ["admin", "administrator", "root", "service"],
          attempts: 127,
          duration: "5 minutes"
        }
      },
      {
        id: "B002",
        severity: "high",
        name: "Successful Login After Failures",
        source: "External (185.220.101.45)",
        time: "2025-12-28 22:20:47",
        description: "Successful authentication from same IP after multiple failures",
        details: {
          sourceIP: "185.220.101.45",
          user: "service_account",
          method: "SSH"
        }
      },
      {
        id: "B003",
        severity: "medium",
        name: "Unusual Login Time",
        source: "External (185.220.101.45)",
        time: "2025-12-28 22:20:47",
        description: "Login outside normal business hours",
        details: {
          user: "service_account",
          normalHours: "08:00-18:00",
          loginTime: "22:20"
        }
      }
    ],
    
    logs: [
      { timestamp: "2025-12-28 22:15:03", host: "WEB-01", user: "admin", srcIP: "185.220.101.45", dstIP: "203.0.113.10", eventType: "Auth Failure", message: "SSH login failed for user admin" },
      { timestamp: "2025-12-28 22:15:05", host: "WEB-01", user: "administrator", srcIP: "185.220.101.45", dstIP: "203.0.113.10", eventType: "Auth Failure", message: "SSH login failed for user administrator" },
      { timestamp: "2025-12-28 22:15:07", host: "WEB-01", user: "root", srcIP: "185.220.101.45", dstIP: "203.0.113.10", eventType: "Auth Failure", message: "SSH login failed for user root" },
      { timestamp: "2025-12-28 22:20:47", host: "WEB-01", user: "service_account", srcIP: "185.220.101.45", dstIP: "203.0.113.10", eventType: "Auth Success", message: "SSH login successful for user service_account" },
      { timestamp: "2025-12-28 22:21:02", host: "WEB-01", user: "service_account", srcIP: "185.220.101.45", dstIP: "-", eventType: "Command", message: "whoami executed by service_account" },
      { timestamp: "2025-12-28 22:21:15", host: "WEB-01", user: "service_account", srcIP: "185.220.101.45", dstIP: "-", eventType: "Command", message: "cat /etc/passwd executed" }
    ],
    
    timeline: {
      host: "WEB-01",
      events: [
        { time: "22:15:03", event: "Failed login attempts begin (127 total)", type: "malicious" },
        { time: "22:20:47", event: "Successful SSH login: service_account", type: "malicious" },
        { time: "22:21:02", event: "Command execution: whoami", type: "suspicious" },
        { time: "22:21:15", event: "Attempted to read /etc/passwd", type: "malicious" }
      ]
    },
    
    mitreMapping: {
      correct: "T1110",
      techniques: [
        { id: "T1110", name: "Brute Force", tactic: "Credential Access" },
        { id: "T1078", name: "Valid Accounts", tactic: "Initial Access" }
      ]
    },
    
    expectedAssessment: "malicious",
    expectedAction: "escalate",
    
    explanation: {
      summary: "Classic credential stuffing attack that successfully compromised a service account.",
      attackPath: [
        "Attacker performed brute force attack with 127 attempts",
        "Successfully authenticated as 'service_account'",
        "Began reconnaissance with system commands",
        "Attempted to enumerate user accounts"
      ],
      correctMitre: "T1110 (Brute Force)",
      keyEvidence: [
        "127 failed login attempts in 5 minutes",
        "Successful login from same external IP",
        "Unusual login time (22:20 vs normal 08:00-18:00)",
        "Immediate reconnaissance commands after login"
      ],
      redHerrings: [],
      recommendedAction: "Escalate - Compromised account requiring immediate password reset and access review"
    }
  },
  
  {
    id: 3,
    title: "False Positive: Vulnerability Scan",
    difficulty: "Easy",
    category: "Discovery",
    description: "Authorized security team conducting scheduled vulnerability assessment",
    currentScenario: 3,
    totalScenarios: 12,
    
    alerts: [
      {
        id: "C001",
        severity: "medium",
        name: "Port Scan Detected",
        source: "SEC-SCANNER (10.10.99.5)",
        time: "2025-12-28 02:00:15",
        description: "Port scanning activity from internal host",
        details: {
          sourceHost: "SEC-SCANNER",
          sourceIP: "10.10.99.5",
          targetCount: 254,
          portRange: "1-65535"
        }
      },
      {
        id: "C002",
        severity: "info",
        name: "Scheduled Task Execution",
        source: "SEC-SCANNER (10.10.99.5)",
        time: "2025-12-28 02:00:00",
        description: "Scheduled task 'Weekly_Vuln_Scan' started",
        details: {
          taskName: "Weekly_Vuln_Scan",
          user: "SYSTEM",
          schedule: "Weekly, Sunday 02:00"
        }
      }
    ],
    
    logs: [
      { timestamp: "2025-12-28 02:00:00", host: "SEC-SCANNER", user: "SYSTEM", srcIP: "-", dstIP: "-", eventType: "Task Start", message: "Scheduled task 'Weekly_Vuln_Scan' started" },
      { timestamp: "2025-12-28 02:00:15", host: "SEC-SCANNER", user: "scanner_service", srcIP: "10.10.99.5", dstIP: "10.10.1.0/24", eventType: "Scan", message: "Nessus vulnerability scan initiated" },
      { timestamp: "2025-12-28 02:45:33", host: "SEC-SCANNER", user: "SYSTEM", srcIP: "-", dstIP: "-", eventType: "Task Complete", message: "Scheduled task 'Weekly_Vuln_Scan' completed successfully" }
    ],
    
    timeline: {
      host: "SEC-SCANNER",
      events: [
        { time: "02:00:00", event: "Scheduled vulnerability scan task started", type: "info" },
        { time: "02:00:15", event: "Nessus scan initiated on internal network", type: "info" },
        { time: "02:45:33", event: "Scan completed successfully", type: "info" }
      ]
    },
    
    mitreMapping: {
      correct: "N/A",
      techniques: []
    },
    
    expectedAssessment: "benign",
    expectedAction: "close",
    
    explanation: {
      summary: "This is authorized security scanning activity, not a malicious attack.",
      attackPath: [],
      correctMitre: "N/A - Benign Activity",
      keyEvidence: [
        "Scan originated from known security scanner host (SEC-SCANNER)",
        "Triggered by scheduled task 'Weekly_Vuln_Scan'",
        "Occurred at scheduled time (Sunday 02:00)",
        "Used legitimate tool (Nessus)"
      ],
      redHerrings: [
        "Port scanning alert might look suspicious out of context",
        "Large number of targets (254 hosts) could raise concern"
      ],
      recommendedAction: "Close as False Positive - Authorized security scanning activity"
    }
  }
];

// Keep backward compatibility
export const mockScenario = scenarios[0];

// MITRE ATT&CK Matrix (simplified for display)
export const mitreMatrix = {
  tactics: [
    "Reconnaissance",
    "Resource Development",
    "Initial Access",
    "Execution",
    "Persistence",
    "Privilege Escalation",
    "Defense Evasion",
    "Credential Access",
    "Discovery",
    "Lateral Movement",
    "Collection",
    "Command and Control",
    "Exfiltration",
    "Impact"
  ],
  
  techniques: {
    "Discovery": [
      { id: "T1046", name: "Network Service Discovery" },
      { id: "T1018", name: "Remote System Discovery" },
      { id: "T1082", name: "System Information Discovery" },
      { id: "T1083", name: "File and Directory Discovery" },
      { id: "T1135", name: "Network Share Discovery" }
    ],
    "Command and Control": [
      { id: "T1071", name: "Application Layer Protocol" },
      { id: "T1095", name: "Non-Application Layer Protocol" },
      { id: "T1571", name: "Non-Standard Port" },
      { id: "T1573", name: "Encrypted Channel" }
    ],
    "Exfiltration": [
      { id: "T1048", name: "Exfiltration Over Alternative Protocol" },
      { id: "T1041", name: "Exfiltration Over C2 Channel" },
      { id: "T1011", name: "Exfiltration Over Other Network Medium" },
      { id: "T1052", name: "Exfiltration Over Physical Medium" }
    ],
    "Lateral Movement": [
      { id: "T1021", name: "Remote Services" },
      { id: "T1080", name: "Taint Shared Content" },
      { id: "T1563", name: "Remote Service Session Hijacking" }
    ],
    "Execution": [
      { id: "T1059", name: "Command and Scripting Interpreter" },
      { id: "T1203", name: "Exploitation for Client Execution" },
      { id: "T1204", name: "User Execution" }
    ],
    "Credential Access": [
      { id: "T1110", name: "Brute Force" },
      { id: "T1555", name: "Credentials from Password Stores" },
      { id: "T1212", name: "Exploitation for Credential Access" }
    ],
    "Initial Access": [
      { id: "T1078", name: "Valid Accounts" },
      { id: "T1190", name: "Exploit Public-Facing Application" },
      { id: "T1566", name: "Phishing" }
    ]
  }
};
