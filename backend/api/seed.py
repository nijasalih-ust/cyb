from api.models import (
    KillChainPhase,
    MitreTactic,
    Quiz,
    QuizQuestion,
    TacticPhaseMap,
    MitreTechnique,
    Path,
    Module,
    Lesson,
    LessonTechniqueMap
)
import uuid
def run():
        print("🚀 Seeding started")
        phases_by_name = {}

        phase_data = [
            (1, 1, "Reconnaissance", "Adversary researches, identifies, and selects targets using OSINT and scanning."),
            (2, 2, "Weaponization", "Coupling a remote access trojan with an exploit into a deliverable payload like a PDF or Office doc."),
            (3, 3, "Delivery", "Transmitting the weaponized object to the target environment via email, web, or USB."),
            (4, 4, "Exploitation", "Triggering the weapon's code to exploit a vulnerability on the target system."),
            (5, 5, "Installation", "Installing a backdoor, implant, or service to maintain persistence after the initial exploit."),
            (6, 6, "Command and Control", "Establishing a communication channel for the adversary to remotely manipulate the victim system."),
            (7, 7, "Actions on Objectives", "Accomplishing original goals such as data exfiltration, encryption, or lateral movement."),
        ]

        for phase_id, step_number, name, description in phase_data:
            obj, _ = KillChainPhase.objects.update_or_create(
                id=phase_id,
                defaults={
                    "step_number": step_number,
                    "name": name,
                    "description": description,
                },
            )
            phases_by_name[name] = obj

        tactics_by_mitre_id = {}

        tactic_data = [
            ("TA0001", "Initial Access"),
            ("TA0002", "Execution"),
            ("TA0003", "Persistence"),
            ("TA0004", "Privilege Escalation"),
            ("TA0005", "Defense Evasion"),
            ("TA0006", "Credential Access"),
            ("TA0008", "Lateral Movement"),
            ("TA0011", "Command and Control"),
            ("TA0010", "Exfiltration"),
        ]

        for mitre_id, name in tactic_data:
            obj, _ = MitreTactic.objects.update_or_create(
                mitre_id=mitre_id,
                defaults={
                    "name": name,
                },
            )
            tactics_by_mitre_id[mitre_id] = obj

        tactic_phase_data = [
            ("TA0001", 3),
            ("TA0001", 4),
            ("TA0002", 4),
            ("TA0003", 5),
            ("TA0004", 5),
            ("TA0005", 5),
            ("TA0006", 4),  # FIXED
            ("TA0008", 6),  # FIXED
            ("TA0011", 6),
            ("TA0010", 7),
        ]

        for mitre_id, phase_id in tactic_phase_data:
            try:
                tactic = MitreTactic.objects.get(mitre_id=mitre_id)
                phase = KillChainPhase.objects.get(id=phase_id)
            except (MitreTactic.DoesNotExist, KillChainPhase.DoesNotExist):
                continue

            TacticPhaseMap.objects.update_or_create(
                tactic=tactic,
                phase=phase,
                defaults={},
            )

        techniques_by_mitre_id = {}

        technique_data = [
            # INITIAL ACCESS
            ("T1190", "Exploit Public-Facing Application","Taking advantage of vulnerable public-facing services like web servers to gain initial access.","TA0001"),
            ("T1566", "Phishing","Sending deceptive emails or messages with malicious links or attachments to trick users into executing malware.","TA0001"),
            ("T1204.002", "User Execution: Malicious File","Tricking users into executing malicious files such as documents or installers delivered via email or download.","TA0001"),
            # EXECUTION
            ("T1059.001", "Command and Scripting Interpreter: PowerShell","Executing malicious code via PowerShell for interactive command execution and payload delivery.","TA0002"),
            ("T1059.003", "Command and Scripting Interpreter: Windows Command Shell","Using cmd.exe to run commands and scripts for system manipulation.","TA0002"),
            # PERSISTENCE
            ("T1547.001", "Boot or Logon Autostart Execution: Registry Run Keys","Adding malicious executables to Windows Registry Run keys for persistence after reboot.","TA0003"),
            ("T1543.003", "Create or Modify System Process: Windows Service","Installing backdoors as Windows services to maintain persistent access.","TA0003"),
            ("T1053.005", "Scheduled Task/Job: Scheduled Task","Abusing Windows Task Scheduler to execute malicious code persistently or on a schedule.","TA0003"),
            # PRIVILEGE ESCALATION
            ("T1068", "Exploitation for Privilege Escalation","Exploiting software vulnerabilities to elevate from user to administrator privileges.","TA0004"),
            ("T1548.002", "Bypass User Account Control","Abusing legitimate OS mechanisms to bypass UAC prompts and gain elevated privileges.","TA0004"),
            # DEFENSE EVASION
            ("T1562.001", "Impair Defenses: Disable or Modify Tools","Stopping antivirus, EDR, or Windows Defender through service manipulation or DLL replacement.","TA0005"),
            ("T1027", "Obfuscated Files or Information","Encoding payloads with Base64, XOR, or compression to evade signature-based detection.","TA0005"),
            # CREDENTIAL ACCESS
            ("T1003.001", "OS Credential Dumping: LSASS Memory","Extracting credentials from LSASS process memory using tools like Mimikatz.","TA0006"),
            ("T1552.001", "Unsecured Credentials: Credentials In Files","Searching local files like configuration files or registry hives for plaintext credentials.","TA0006"),
            # LATERAL MOVEMENT
            ("T1021.001", "Remote Services: Remote Desktop Protocol", "Using RDP to move laterally between compromised Windows systems.","TA0008"),
            ("T1570", "Lateral Tool Transfer","Copying malware or tools to target systems via SMB, WMI, or PsExec.","TA0008"),
            ("T1595", "Active Scanning","Scanning networks and services to identify live hosts, open ports, and exposed services.","TA0008"),
            # COMMAND AND CONTROL
            ("T1090.001", "Proxy: Internal Proxy","Using compromised internal hosts as proxy servers to blend C2 traffic with legitimate traffic.","TA0011"),
            ("T1095", "Non-Application Layer Protocol","Tunneling command and control communications over protocols like DNS, ICMP, or custom protocols.","TA0011"),
            # EXFILTRATION
            ("T1041", "Exfiltration Over C2 Channel","Using existing command and control infrastructure to stealthily extract sensitive data.","TA0010"),
            ("T1560.001", "Archive Collected Data: Archive via Utility","Compressing stolen data with utilities like ZIP or RAR prior to exfiltration.","TA0010"),
            # Additional techniques to ensure each tactic has some linked techniques
            ("T1078", "Valid Accounts", "Use of stolen, default, or misconfigured accounts to gain access.", "TA0006"),
            ("T1562.002", "Impair Defenses: Modify Security Tools", "Altering or disabling security tooling and controls to avoid detection.", "TA0005"),
            ("T1548.001", "Exploitation for Privilege Escalation: Kernel Exploit", "Exploiting kernel vulnerabilities to gain SYSTEM or higher privileges.", "TA0004"),
            ("T1071.001", "Application Layer Protocol: Web Protocols", "Using HTTP/HTTPS to communicate with command and control infrastructure.", "TA0011"),
            ("T1021.002", "Remote Services: SMB/Windows Admin Shares", "Using SMB or Windows admin shares to move laterally between hosts.", "TA0008"),
            ("T1204.001", "User Execution: Malicious Link", "Convincing a user to click a malicious link leading to payload execution or credential capture.", "TA0002"),
        ]


        for mitre_id, name, description, tactic_mitre_id in technique_data:
            try:
                tactic = MitreTactic.objects.get(mitre_id=tactic_mitre_id)
            except MitreTactic.DoesNotExist:
                continue

            obj, _ = MitreTechnique.objects.update_or_create(
                mitre_id=mitre_id,
                defaults={
                    "name": name,
                    "description": description,
                    "tactic": tactic,
                },
            )
            techniques_by_mitre_id[mitre_id] = obj

        paths_by_slug = {}

        path_data = [
            ("SOC Fundamentals", "soc-fundamentals", "standard"),
            ("Threat Hunting ATT&CK", "threat-hunting-attck", "campaign"),
            ("Advanced Detection Engineering", "advanced-detection-engineering", "standard"),
        ]

        for title, slug, path_type in path_data:
            obj, _ = Path.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "type": path_type,
                },
            )
            paths_by_slug[slug] = obj




        modules_by_path_and_order = {}

        module_data = [
            ("soc-fundamentals", "Introduction to SOC Operations", 1),
            ("soc-fundamentals", "Network Traffic Analysis", 2),
            ("soc-fundamentals", "Windows Event Logs", 3),
            ("soc-fundamentals", "Email Security and Phishing", 4),
            ("soc-fundamentals", "Basic Incident Response", 5),
            ("threat-hunting-attck", "Threat Hunting Principles", 1),
            ("threat-hunting-attck", "Hunting for Persistence", 2),
            ("threat-hunting-attck", "Hunting for Privilege Escalation", 3),
            ("threat-hunting-attck", "Lateral Movement Detection", 4),
            ("threat-hunting-attck", "C2 Beacon Analysis", 5),
            ("advanced-detection-engineering", "Detection Logic Basics", 1),
            ("advanced-detection-engineering", "SIGMA Rule Development", 2),
            ("advanced-detection-engineering", "SIEM Query Optimization", 3),
            ("advanced-detection-engineering", "Adversary Emulation", 4),
            ("advanced-detection-engineering", "Building High-Fidelity Alerts", 5),
        ]

        for path_slug, module_title, order_index in module_data:
            try:
                path = Path.objects.get(slug=path_slug)
            except Path.DoesNotExist:
                continue

            obj, _ = Module.objects.update_or_create(
                path=path,
                order_index=order_index,
                defaults={
                        "title": module_title,

                },
            )
            modules_by_path_and_order[(path_slug, order_index)] = obj

        lessons_by_title = {}

        lesson_data = [
            ("soc-fundamentals", 1, "What is a SOC?", "what-is-soc",
            "Learners understand the role, responsibilities, and daily workflow of Security Operations Center analysts. Core functions include monitoring, triage, investigation, and escalation. SOCs operate 24/7 using SIEM, EDR, and threat intelligence.",
            "high-severity alerts spiking\nunusual login patterns from new geolocations\nSIEM rule violations during off-hours"),

            ("soc-fundamentals", 1, "SOC Tooling Overview", "soc-tooling-overview",
            "Learners identify primary tools used in modern SOC environments. Key platforms include SIEM (Splunk/Elastic), EDR (CrowdStrike), and network monitoring (Zeek). Integration between tools enables correlated alerting and response.",
            "multiple tool alerts correlating to same host\nnew agent installations on endpoints\ntool license usage anomalies"),

            ("soc-fundamentals", 2, "Packet Capture Basics", "packet-capture-basics",
            "Learners interpret basic PCAP files to identify malicious network activity. Focus on protocol anomalies, unusual payloads, and beaconing patterns. PCAP analysis reveals what logs might miss.",
            "suspicious DNS queries to rare domains\nHTTP POSTs to unknown IPs\nnon-standard TLS certificates"),

            ("soc-fundamentals", 2, "Network Scanning Detection", "network-scanning-detection",
            "Learners recognize reconnaissance scanning patterns in network traffic. Port scans, banner grabbing, and vulnerability probing indicate active targeting. Early detection prevents exploitation.",
            "high port scan volume from single source\nSYN floods without completion\nICMP sweeps across subnets"),

            ("soc-fundamentals", 3, "Windows Event ID 4624", "windows-event-4624",
            "Learners analyze successful logon events for compromise indicators. Focus on Logon Type, authentication packages, and source addresses. Correlate with baseline normal activity.",
            "Logon Type 3 from external IPs\nunexpected Kerberos pre-auth failures\nservice account logins to workstations"),

            ("soc-fundamentals", 3, "PowerShell Event Logs", "powershell-event-logs",
            "Learners detect malicious PowerShell execution through event logs. Module 4103/4104 scripts reveal obfuscation, downloads, and command execution. PowerShell is attackers' favorite interpreter.",
            "encoded command parameters\nscript block logging with AMSI bypass attempts\nPowerShell.exe spawned from unusual parents"),

            ("soc-fundamentals", 4, "Phishing Email Indicators", "phishing-email-indicators",
            "Learners identify phishing artifacts in email headers and content. Focus on sender spoofing, malicious links, and attachment anomalies. Phishing remains primary initial access vector.",
            "mismatched DKIM/SPF signatures\nURLs with double encoding\nunexpected macro-enabled Office docs"),

            ("soc-fundamentals", 4, "Malicious Attachment Analysis", "malicious-attachment-analysis",
            "Learners safely analyze Office documents and PDFs for exploits. Embedded macros, JavaScript, and shellcode indicate weaponized payloads. Static/dynamic analysis reveals true intent.",
            "CVE references in metadata\nsuspicious VBA macros\nembedded OLE objects with exploits"),

            ("threat-hunting-attck", 1, "Hypothesis-Driven Hunting", "hypothesis-driven-hunting",
            "Learners build hunting hypotheses based on threat intel and internal changes. Hypotheses link adversary TTPs to detectable log evidence. Proactive hunting finds threats SIEM misses.",
            "sudden increase in admin shares accessed\nunexpected service installations\nanomalous process trees"),

            ("threat-hunting-attck", 1, "Hypothesis Testing Framework", "hypothesis-testing-framework",
            "Learners validate hunting hypotheses through iterative log queries. False positives get refined; true positives trigger investigation. Framework ensures systematic threat discovery.",
            "queries returning consistent anomalies over time\nlow-confidence alerts becoming high-volume\nuncharted log sources lighting up"),

            ("threat-hunting-attck", 2, "Registry Run Key Hunting", "hunting-registry-run-keys",
            "Learners hunt persistence via Registry Run/RunOnce keys. Focus on non-standard paths, unusual filenames, and recent modifications. Run keys enable reboot persistence.",
            "recent modifications to HKLM Software Microsoft Windows CurrentVersion Run\nDLLs in Run key values\nuser-writable Run key locations"),

            ("threat-hunting-attck", 2, "Scheduled Task Persistence", "hunting-scheduled-tasks",
            "Learners detect persistence via Windows Task Scheduler abuse. Malicious tasks run hidden with SYSTEM privileges. Cross-reference task creation events with execution logs.",
            "tasks created outside patch windows\nS4U logon types in task execution\nrecurring tasks with unusual binaries"),

            ("advanced-detection-engineering", 1, "Boolean Logic in SIEM", "boolean-logic-siem",
            "Learners master AND OR NOT operators for precise alert logic. Complex conditions reduce noise while maintaining coverage. Proper logic prevents alert fatigue.",
            "overly broad alerts firing constantly\nmissed detections due to missing exclusions\nlogic errors creating coverage gaps"),

            ("advanced-detection-engineering", 1, "Time Window Correlation", "time-window-correlation",
            "Learners correlate events across time windows for behavioral detection. Sliding windows catch multi-stage attacks. Time-based logic reveals sequences logs hide.",
            "events clustering within 5 minutes\nprecursor activities preceding exploitation\ncoordinated activity across endpoints"),
        ]


        for path_slug, order_index, title, router_link, description, key_indicators in lesson_data:
            try:
                module = Module.objects.get(path__slug=path_slug, order_index=order_index)
            except Module.DoesNotExist:
                continue

            obj, _ = Lesson.objects.update_or_create(
                module=module,
                title=title,
                defaults={
                    "router_link": router_link,
                    "description": description,
                    "key_indicators": key_indicators,
                },
            )
            lessons_by_title[title] = obj

        lesson_technique_data = [
            ("network-scanning-detection", "T1190"),
            ("network-scanning-detection", "T1595"),
            
            ("powershell-event-logs", "T1059.001"),
            ("powershell-event-logs", "T1027"),
            ("phishing-email-indicators", "T1566"),
            ("malicious-attachment-analysis", "T1566"),
            ("malicious-attachment-analysis", "T1204.002"),
            ("hunting-registry-run-keys", "T1547.001"),
            ("hunting-registry-run-keys", "T1027"),
            ("hunting-scheduled-tasks", "T1053.005"),
            ("hunting-scheduled-tasks", "T1543.003"),
            ("boolean-logic-siem", "T1027"),
            ("time-window-correlation", "T1021.001"),
            ("time-window-correlation", "T1059.003"),
        ]

        for router_link, technique_mitre_id in lesson_technique_data:
            try:
                lesson = Lesson.objects.get(router_link=router_link)
                technique = MitreTechnique.objects.get(mitre_id=technique_mitre_id)
            except (Lesson.DoesNotExist, MitreTechnique.DoesNotExist):
                continue

            LessonTechniqueMap.objects.update_or_create(
                lesson=lesson,
                technique=technique,
                defaults={},
            )

        quizzes_by_module = {}

        quiz_data = [
            ("soc-fundamentals", 1, "SOC Operations & Tooling Quiz"),
            ("soc-fundamentals", 2, "Network Traffic & PCAP Analysis Quiz"),
            ("soc-fundamentals", 3, "Windows Events & PowerShell Logs Quiz"),
            ("soc-fundamentals", 4, "Email Security & Phishing Quiz"),
            ("soc-fundamentals", 5, "Incident Response Basics Quiz"),
            ("threat-hunting-attck", 1, "Hunting Principles & Hypothesis Quiz"),
            ("threat-hunting-attck", 2, "Persistence Mechanisms Quiz"),
            ("threat-hunting-attck", 3, "Privilege Escalation Hunting Quiz"),
            ("threat-hunting-attck", 4, "Lateral Movement Detection Quiz"),
            ("threat-hunting-attck", 5, "C2 & Beaconing Analysis Quiz"),
            ("advanced-detection-engineering", 1, "Detection Logic & Boolean Quiz"),
            ("advanced-detection-engineering", 2, "SIGMA Rules Assessment"),
            ("advanced-detection-engineering", 3, "Query Optimization Quiz"),
            ("advanced-detection-engineering", 4, "Adversary Emulation Quiz"),
            ("advanced-detection-engineering", 5, "High-Fidelity Alerting Quiz"),
        ]

        for path_slug, order_index, title in quiz_data:
            try:
                module = Module.objects.get(path__slug=path_slug, order_index=order_index)
            except Module.DoesNotExist:
                continue

            obj, _ = Quiz.objects.update_or_create(
                module=module,
                defaults={
                    "title": title,
                },
            )
            quizzes_by_module[(path_slug, order_index)] = obj

        quiz_question_data = [
            ("soc-fundamentals", "SOC Operations & Tooling Quiz", "What is the primary function of a Security Operations Center (SOC)?",
            ["To develop new software applications", "To monitor, detect, analyze, and respond to cybersecurity incidents", "To manage IT helpdesk tickets", "To audit financial compliance"],
            "To monitor, detect, analyze, and respond to cybersecurity incidents"),
            ("soc-fundamentals", "SOC Operations & Tooling Quiz", "Which tool is primarily responsible for aggregating logs from various sources for correlation?",
            ["Firewall", "EDR", "SIEM", "Antivirus"],
            "SIEM"),
            ("soc-fundamentals", "SOC Operations & Tooling Quiz", "What distinguishes EDR from traditional Antivirus?",
            ["EDR is free", "EDR focuses on behavioral monitoring and recording endpoint activity", "EDR only scans files on download", "EDR replaces the firewall"],
            "EDR focuses on behavioral monitoring and recording endpoint activity"),
            ("soc-fundamentals", "Network Traffic & PCAP Analysis Quiz", "Which protocol is commonly used by attackers for command and control but often looks like normal web traffic?",
            ["HTTP/HTTPS", "FTP", "Telnet", "SMTP"],
            "HTTP/HTTPS"),
            ("soc-fundamentals", "Network Traffic & PCAP Analysis Quiz", "In a PCAP, what might indicate a port scan?",
            ["A single connection to port 80", "Thousands of SYN packets to different ports from a single IP", "A large file download", "Encrypted SSL traffic"],
            "Thousands of SYN packets to different ports from a single IP"),
            ("soc-fundamentals", "Network Traffic & PCAP Analysis Quiz", "What is 'beaconing' in network traffic analysis?",
            ["A continuous high-bandwidth download", "Regular, heartbeat-like connections to an external IP", "Random connection attempts to internal servers", "Broadcasting ARP requests"],
            "Regular, heartbeat-like connections to an external IP"),
            ("soc-fundamentals", "Windows Events & PowerShell Logs Quiz", "Which Windows Event ID signifies a successful logon?",
            ["4624", "4625", "4688", "4104"],
            "4624"),
            ("soc-fundamentals", "Windows Events & PowerShell Logs Quiz", "Why is PowerShell a frequent target for attackers?",
            ["It is not installed by default", "It allows powerful administration and automation capabilities", "It cannot be logged", "It is only used for web browsing"],
            "It allows powerful administration and automation capabilities"),
            ("soc-fundamentals", "Windows Events & PowerShell Logs Quiz", "What does Event ID 4688 represent?",
            ["A new process has been created", "A user failed to log on", "A file was deleted", "A network share was accessed"],
            "A new process has been created"),
            ("soc-fundamentals", "Email Security & Phishing Quiz", "Which record helps verify that an email actually came from the claimed domain?",
            ["SPF/DKIM", "HTTP", "FTP", "DHCP"],
            "SPF/DKIM"),
            ("soc-fundamentals", "Email Security & Phishing Quiz", "What is a common indicator of a malicious attachment?",
            ["It is a PDF file", "It contains VBA macros that execute on opening", "It is a text file", "It is larger than 10MB"],
            "It contains VBA macros that execute on opening"),
            ("soc-fundamentals", "Email Security & Phishing Quiz", "What is 'typosquatting' in the context of phishing?",
            ["Sending emails with typos", "Registering domains that look visually similar to legitimate ones", "Using poor grammar in email bodies", "Crashing the email server"],
            "Registering domains that look visually similar to legitimate ones"),
            ("soc-fundamentals", "Incident Response Basics Quiz", "What is the first step in the Incident Response lifecycle after preparation?",
            ["Eradication", "Identification (Detection & Analysis)", "Recovery", "Lessons Learned"],
            "Identification (Detection & Analysis)"),
            ("soc-fundamentals", "Incident Response Basics Quiz", "Why is 'containment' critical during an incident?",
            ["To punish the user", "To stop the spread of the attack and prevent further damage", "To delete all logs", "To reboot the server immediately"],
            "To stop the spread of the attack and prevent further damage"),
            ("soc-fundamentals", "Incident Response Basics Quiz", "What is the purpose of the 'Lessons Learned' phase?",
            ["To assign blame", "To improve future response capabilities based on the incident", "To archive data forever", "To fire the security team"],
            "To improve future response capabilities based on the incident"),
            ("threat-hunting-attck", "Hunting Principles & Hypothesis Quiz", "What drives a proactive threat hunt?",
            ["An automated SIEM alert", "A hypothesis based on intelligence or behavioral anomalies", "A user complaint", "A scheduled virus scan"],
            "A hypothesis based on intelligence or behavioral anomalies"),
            ("threat-hunting-attck", "Hunting Principles & Hypothesis Quiz", "What is the goal of hypothesis testing?",
            ["To prove the hypothesis is always true", "To validate if a specific threat behavior exists in the environment", "To generate more logs", "To slow down the network"],
            "To validate if a specific threat behavior exists in the environment"),
            ("threat-hunting-attck", "Hunting Principles & Hypothesis Quiz", "Which is a strong indicator for a hunt hypothesis?",
            ["Normal business hours login", "Sudden use of administrative tools by a non-admin account", "Standard Windows updates", "Daily backup success"],
            "Sudden use of administrative tools by a non-admin account"),
            ("threat-hunting-attck", "Persistence Mechanisms Quiz", "Where do attackers often hide persistence mechanisms in Windows?",
            ["Recycle Bin", "Registry Run Keys (HKLM/HKCU...Run)", "My Documents folder", "Browser History"],
            "Registry Run Keys (HKLM/HKCU...Run)"),
            ("threat-hunting-attck", "Persistence Mechanisms Quiz", "How can Scheduled Tasks be abused for persistence?",
            ["They speed up the system", "They can execute malicious code at specific times or events, even after reboot", "They prevent users from logging in", "They only run standard Microsoft updates"],
            "They can execute malicious code at specific times or events, even after reboot"),
            ("threat-hunting-attck", "Persistence Mechanisms Quiz", "What is a 'service' in the context of persistence?",
            ["A customer support ticket", "A background process that starts automatically on boot", "A network cable", "A firewall rule"],
            "A background process that starts automatically on boot"),
            ("threat-hunting-attck", "Privilege Escalation Hunting Quiz", "What is UAC bypass?",
            ["Skipping the login screen", "Evading the User Account Control prompt to gain elevated privileges silently", "Cracking a password", "Resetting the BIOS"],
            "Evading the User Account Control prompt to gain elevated privileges silently"),
            ("threat-hunting-attck", "Privilege Escalation Hunting Quiz", "Which technique involves exploiting a vulnerability to gain higher access?",
            ["Phishing", "Exploitation for Privilege Escalation", "Port Scanning", "Denial of Service"],
            "Exploitation for Privilege Escalation"),
            ("threat-hunting-attck", "Privilege Escalation Hunting Quiz", "Why might an attacker target LSASS memory?",
            ["To crash the system", "To dump cleartext credentials or hashes", "To increase RAM speed", "To install a printer"],
            "To dump cleartext credentials or hashes"),
            ("threat-hunting-attck", "Lateral Movement Detection Quiz", "What is 'Pass-the-Hash'?",
            ["Sending a password via email", "Authenticating using a hashed password without knowing the cleartext", "Resetting a user's password", "Encrypting the hard drive"],
            "Authenticating using a hashed password without knowing the cleartext"),
            ("threat-hunting-attck", "Lateral Movement Detection Quiz", "Which protocol is frequently used for lateral movement in Windows environments?",
            ["SMB/RPC", "HTTP", "FTP", "SMTP"],
            "SMB/RPC"),
            ("threat-hunting-attck", "Lateral Movement Detection Quiz", "What might indicate lateral movement via RDP?",
            ["RDP connections from external IPs", "RDP connections between workstations", "RDP connections to a domain controller from a workstation", "All of the above"],
            "All of the above"),
            ("threat-hunting-attck", "C2 & Beaconing Analysis Quiz", "What characterizes a 'jitter' in C2 beaconing?",
            ["Consistent 1-second intervals", "Randomized timing between callbacks to evade detection", "A fast network connection", "Packet loss"],
            "Randomized timing between callbacks to evade detection"),
            ("threat-hunting-attck", "C2 & Beaconing Analysis Quiz", "Why do attackers use Domain Generation Algorithms (DGA)?",
            ["To save money on domains", "To dynamically generate many domain names to evade blacklisting", "To improve website SEO", "To encrypt traffic"],
            "To dynamically generate many domain names to evade blacklisting"),
            ("threat-hunting-attck", "C2 & Beaconing Analysis Quiz", "What is 'DNS Tunneling'?",
            ["Using DNS queries to encode and transport data", "Blocking DNS requests", "Accelerating DNS resolution", "A VPN protocol"],
            "Using DNS queries to encode and transport data"),
            ("advanced-detection-engineering", "Detection Logic & Boolean Quiz", "What does the boolean operator 'AND' achieve in a detection rule?",
            ["Broadens the search results", "Narrows the criteria so all conditions must be met", "Excludes specific results", "Prioritizes the first term"],
            "Narrows the criteria so all conditions must be met"),
            ("advanced-detection-engineering", "Detection Logic & Boolean Quiz", "Why is 'NOT' useful in query logic?",
            ["To include everything", "To filter out known good behavior (whitelisting)", "To make the query faster", "To delete logs"],
            "To filter out known good behavior (whtelisting)"),
            ("advanced-detection-engineering", "Detection Logic & Boolean Quiz", "What is a false positive?",
            ["A missed attack", "A benign event incorrectly flagged as malicious", "A malicious event correctly identified", "A system crash"],
            "A benign event incorrectly flagged as malicious"),
            ("advanced-detection-engineering", "SIGMA Rules Assessment", "What is the primary purpose of SIGMA rules?",
            ["To block firewalls", "To provide a generic, vendor-agnostic format for describing detection signatures", "To encrypt logs", "To manage user passwords"],
            "To provide a generic, vendor-agnostic format for describing detection signatures"),
            ("advanced-detection-engineering", "SIGMA Rules Assessment", "Which field in a SIGMA rule describes the log source?",
            ["detection", "logsource", "condition", "title"],
            "logsource"),
            ("advanced-detection-engineering", "SIGMA Rules Assessment", "How are SIGMA rules typically used?",
            ["They are run directly on the endpoint", "They are converted into SIEM-specific queries (Splunk, ELK, etc.)", "They replace antivirus", "They operate only on network traffic"],
            "They are converted into SIEM-specific queries (Splunk, ELK, etc.)"),
            ("advanced-detection-engineering", "Query Optimization Quiz", "Why should you avoid leading wildcards (e.g., *malware) in queries?",
            ["It looks ugly", "It is computationally expensive and slow", "It returns too few results", "It crashes the internet"],
            "It is computationally expensive and slow"),
            ("advanced-detection-engineering", "Query Optimization Quiz", "What is the benefit of filtering by 'sourcetype' or 'index' first?",
            ["It limits the dataset early, improving search speed", "It makes the query longer", "It hides data", "It is required by law"],
            "It limits the dataset early, improving search speed"),
            ("advanced-detection-engineering", "Query Optimization Quiz", "When should you use 'stats' or aggregation commands?",
            ["Always", "To summarize data and identify patterns or counts", "Never", "Only for graphical charts"],
            "To summarize data and identify patterns or counts"),
            ("advanced-detection-engineering", "Adversary Emulation Quiz", "What is the goal of adversary emulation?",
            ["To hack competitors", "To test defenses by mimicking known adversary TTPs", "To train AI models", "To check internet speed"],
            "To test defenses by mimicking known adversary TTPs"),
            ("advanced-detection-engineering", "Adversary Emulation Quiz", "Which tool is commonly used for atomic test execution?",
            ["Wireshark", "Atomic Red Team", "Notepad++", "Calculator"],
            "Atomic Red Team"),
            ("advanced-detection-engineering", "Adversary Emulation Quiz", "How does emulation differ from vulnerability scanning?",
            ["It focuses on behavior and detection validation, not just software flaws", "It is cheaper", "It is automated only", "It runs on Linux only"],
            "It focuses on behavior and detection validation, not just software flaws"),
            ("advanced-detection-engineering", "High-Fidelity Alerting Quiz", "What characterizes a high-fidelity alert?",
            ["Low confidence, high volume", "High confidence, low false positive rate, actionable", "Random generation", "Informational only"],
            "High confidence, low false positive rate, actionable"),
            ("advanced-detection-engineering", "High-Fidelity Alerting Quiz", "What is 'alert fatigue'?",
            ["Being tired from work", "Desensitization to alerts due to high volume of false positives", "A feature of SIEMs", "A type of malware"],
            "Desensitization to alerts due to high volume of false positives"),
            ("advanced-detection-engineering", "High-Fidelity Alerting Quiz", "How can you improve alert fidelity?",
            ["Remove all logic", "Tune logic to exclude known benign behavior and add context", "Alert on every event", "Turn off the SIEM"],
            "Tune logic to exclude known benign behavior and add context"),
        ]

        for path_slug, quiz_title, question_text, options, correct_answer in quiz_question_data:
            try:
                quiz = Quiz.objects.get(
                    module__path__slug=path_slug,
                    title=quiz_title,
                )
            except Quiz.DoesNotExist:
                continue

            QuizQuestion.objects.update_or_create(
                quiz=quiz,
                question_text=question_text,
                defaults={
                    "options": options,
                    "correct_answer": correct_answer,
                },
            )

        


        print("✅ Seeding completed")
            