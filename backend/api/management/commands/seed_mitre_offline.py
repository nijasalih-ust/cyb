"""
Django management command: Offline MITRE ATT&CK seeder.
Uses hardcoded MITRE data (no network required).

Usage:
    python manage.py seed_mitre_offline

This version works in restricted network environments.
Data is current as of MITRE ATT&CK v13.
"""

from django.core.management.base import BaseCommand
from api.models import KillChainPhase, MitreTactic, MitreTechnique, TacticPhaseMap


class Command(BaseCommand):
    help = "Seed MITRE ATT&CK framework data from hardcoded offline data (no network required)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Starting offline MITRE framework seeder'))

        # Ensure Kill Chain Phases
        self._seed_kill_chain_phases()

        # Seed tactics and techniques from hardcoded data
        self._seed_tactics_and_techniques()

        self.stdout.write(self.style.SUCCESS('✅ Offline MITRE framework seeding complete'))

    def _seed_kill_chain_phases(self):
        """Ensure kill chain phases 1-7 exist."""
        phases_data = [
            (1, 'Reconnaissance', 'Planning and research.'),
            (2, 'Weaponization', 'Preparation of tools.'),
            (3, 'Delivery', 'Transmission to target.'),
            (4, 'Exploitation', 'Triggering the weapon.'),
            (5, 'Installation', 'Establishing persistence.'),
            (6, 'Command and Control', 'Remote manipulation.'),
            (7, 'Actions on Objectives', 'Data theft or destruction.'),
        ]
        
        created = 0
        for step, name, desc in phases_data:
            obj, is_new = KillChainPhase.objects.update_or_create(
                step_number=step,
                defaults={'name': name, 'description': desc}
            )
            if is_new:
                created += 1
        
        self.stdout.write(f'  Kill Chain Phases: {created} created/updated')

    def _seed_tactics_and_techniques(self):
        """Seed comprehensive MITRE tactics and techniques from hardcoded data."""
        
        # MITRE tactics with shortname and kill chain mapping
        tactics_data = [
            ('TA0043', 'reconnaissance', 'Reconnaissance', 1),
            ('TA0042', 'resource-development', 'Resource Development', 2),
            ('TA0001', 'initial-access', 'Initial Access', 3),
            ('TA0002', 'execution', 'Execution', 4),
            ('TA0003', 'persistence', 'Persistence', 5),
            ('TA0004', 'privilege-escalation', 'Privilege Escalation', 4),
            ('TA0005', 'defense-evasion', 'Defense Evasion', 5),
            ('TA0006', 'credential-access', 'Credential Access', 6),
            ('TA0007', 'discovery', 'Discovery', 1),
            ('TA0008', 'lateral-movement', 'Lateral Movement', 6),
            ('TA0011', 'command-and-control', 'Command and Control', 6),
            ('TA0010', 'exfiltration', 'Exfiltration', 7),
            ('TA0009', 'collection', 'Collection', 5),
            ('TA0040', 'impact', 'Impact', 7),
        ]

        # Map tactic shortname -> tactic object
        tactic_map = {}
        tactics_created = 0

        for mitre_id, shortname, name, phase_num in tactics_data:
            obj, is_new = MitreTactic.objects.update_or_create(
                mitre_id=mitre_id,
                defaults={'name': name}
            )
            if is_new:
                tactics_created += 1
            tactic_map[shortname] = obj

            # Map to kill chain phase
            phase = KillChainPhase.objects.filter(step_number=phase_num).first()
            if phase:
                TacticPhaseMap.objects.update_or_create(
                    tactic=obj,
                    phase=phase,
                    defaults={}
                )

        self.stdout.write(f'  Tactics: {tactics_created} created/updated')

        # Comprehensive MITRE techniques (v13-era data)
        techniques_data = [
            # Initial Access
            ('T1595', 'Active Scanning', 'Scanning networks and services to identify hosts, ports, services.', 'reconnaissance'),
            ('T1595.002', 'Active Scanning: Find Accessible Content', 'Scanning web applications for accessible content.', 'reconnaissance'),
            ('T1592', 'Gather Victim Host Information', 'Gathering information about targeted host systems.', 'reconnaissance'),
            ('T1598', 'Phishing for Information', 'Sending phishing messages to gather information.', 'reconnaissance'),
            ('T1589', 'Gather Victim Identity Information', 'Identifying information about target identities.', 'reconnaissance'),
            ('T1590', 'Gather Victim Network Information', 'Gathering information about target networks.', 'reconnaissance'),
            ('T1598.004', 'Phishing for Information: Spearphishing Link', 'Sending spear phishing links.', 'reconnaissance'),
            
            ('T1583', 'Acquire Infrastructure', 'Acquiring infrastructure for later use.', 'resource-development'),
            ('T1583.001', 'Acquire Infrastructure: Domains', 'Registering or acquiring domains.', 'resource-development'),
            ('T1583.002', 'Acquire Infrastructure: DNS', 'Acquiring DNS resources.', 'resource-development'),
            ('T1586', 'Compromise Accounts', 'Compromising user/service accounts.', 'resource-development'),
            
            ('T1190', 'Exploit Public-Facing Application', 'Exploiting vulnerable public-facing services.', 'initial-access'),
            ('T1566', 'Phishing', 'Sending deceptive messages to users.', 'initial-access'),
            ('T1566.001', 'Phishing: Spearphishing Attachment', 'Phishing with malicious attachments.', 'initial-access'),
            ('T1566.002', 'Phishing: Spearphishing Link', 'Phishing with malicious links.', 'initial-access'),
            ('T1091', 'Replication Through Removable Media', 'Spreading via removable media.', 'initial-access'),
            ('T1199', 'Trusted Relationship', 'Exploiting trusted relationships.', 'initial-access'),
            ('T1200', 'Hardware Additions', 'Installing hardware implants.', 'initial-access'),
            ('T1566.003', 'Phishing: Spearphishing via Service', 'Phishing via third-party services.', 'initial-access'),
            ('T1566.004', 'Phishing: Spearphishing Voice', 'Phishing via voice calls.', 'initial-access'),
            
            ('T1059', 'Command and Scripting Interpreter', 'Executing commands via interpreters.', 'execution'),
            ('T1059.001', 'Command and Scripting Interpreter: PowerShell', 'Executing PowerShell commands.', 'execution'),
            ('T1059.003', 'Command and Scripting Interpreter: Windows Command Shell', 'Using cmd.exe for command execution.', 'execution'),
            ('T1059.008', 'Command and Scripting Interpreter: Unix Shell', 'Using Unix shells for execution.', 'execution'),
            ('T1203', 'Exploitation for Client Execution', 'Exploiting client software vulnerabilities.', 'execution'),
            ('T1559', 'Inter-Process Communication', 'Using IPC for execution.', 'execution'),
            ('T1053', 'Scheduled Task/Job', 'Using scheduled tasks for execution.', 'execution'),
            ('T1204', 'User Execution', 'Tricking users into execution.', 'execution'),
            ('T1204.001', 'User Execution: Malicious Link', 'User executing malicious links.', 'execution'),
            ('T1204.002', 'User Execution: Malicious File', 'User executing malicious files.', 'execution'),
            ('T1047', 'Windows Management Instrumentation', 'Using WMI for execution.', 'execution'),
            
            ('T1197', 'BITS Jobs', 'Abusing BITS for persistence.', 'persistence'),
            ('T1547', 'Boot or Logon Autostart Execution', 'Persistence via autostart mechanisms.', 'persistence'),
            ('T1547.001', 'Boot or Logon Autostart Execution: Registry Run Keys', 'Using Registry Run keys.', 'persistence'),
            ('T1547.005', 'Boot or Logon Autostart Execution: Startup Folder', 'Using Startup folder.', 'persistence'),
            ('T1547.014', 'Boot or Logon Autostart Execution: Active Setup', 'Using Active Setup for persistence.', 'persistence'),
            ('T1547.013', 'Boot or Logon Autostart Execution: XDG Autostart', 'Using XDG autostart (Linux).', 'persistence'),
            ('T1547.007', 'Boot or Logon Autostart Execution: Re-opened Applications', 'Persisting via auto-reopened apps.', 'persistence'),
            ('T1547.006', 'Boot or Logon Autostart Execution: Kernel Modules and Extensions', 'Using kernel modules for persistence.', 'persistence'),
            ('T1547.011', 'Boot or Logon Autostart Execution: Plist Modification', 'Modifying plist files (macOS).', 'persistence'),
            ('T1547.012', 'Boot or Logon Autostart Execution: Print Processors', 'Using print processors (Windows).', 'persistence'),
            ('T1547.009', 'Boot or Logon Autostart Execution: Shortcut Modification', 'Modifying shortcuts for persistence.', 'persistence'),
            ('T1547.010', 'Boot or Logon Autostart Execution: Port Monitors', 'Using port monitors (Windows).', 'persistence'),
            ('T1547.008', 'Boot or Logon Autostart Execution: LSASS Driver', 'Using LSASS drivers.', 'persistence'),
            ('T1547.004', 'Boot or Logon Autostart Execution: Winlogon Helper DLL', 'Winlogon persistence.', 'persistence'),
            ('T1547.003', 'Boot or Logon Autostart Execution: Time Provider', 'Using time providers (Windows).', 'persistence'),
            ('T1547.002', 'Boot or Logon Autostart Execution: Authentication Packages', 'Using auth packages (Windows).', 'persistence'),
            ('T1547.015', 'Boot or Logon Autostart Execution: Login Hook', 'Using login hooks (macOS).', 'persistence'),
            ('T1037', 'Boot or Logon Initialization Scripts', 'Using logon scripts for persistence.', 'persistence'),
            ('T1037.001', 'Boot or Logon Initialization Scripts: Logon Script (Windows)', 'Windows logon scripts.', 'persistence'),
            ('T1037.004', 'Boot or Logon Initialization Scripts: RC Scripts', 'RC scripts (Unix).', 'persistence'),
            ('T1037.002', 'Boot or Logon Initialization Scripts: Login Hook', 'Login hooks (macOS).', 'persistence'),
            ('T1037.005', 'Boot or Logon Initialization Scripts: Startup Items', 'Startup items (macOS).', 'persistence'),
            ('T1037.003', 'Boot or Logon Initialization Scripts: Network Logon Script', 'Network logon scripts.', 'persistence'),
            ('T1543', 'Create or Modify System Process', 'Creating/modifying system processes.', 'persistence'),
            ('T1543.003', 'Create or Modify System Process: Windows Service', 'Installing malicious Windows services.', 'persistence'),
            ('T1543.001', 'Create or Modify System Process: Launch Agent', 'Creating launch agents (macOS).', 'persistence'),
            ('T1543.002', 'Create or Modify System Process: Launch Daemon', 'Creating launch daemons (macOS).', 'persistence'),
            ('T1543.004', 'Create or Modify System Process: Launch Daemon', 'Systemd units (Linux).', 'persistence'),
            ('T1547.006', 'Boot or Logon Autostart Execution: Kernel Modules', 'Kernel modules (Linux).', 'persistence'),
            
            ('T1548', 'Abuse Elevation Control Mechanism', 'Bypassing elevation controls.', 'privilege-escalation'),
            ('T1548.002', 'Abuse Elevation Control Mechanism: Bypass User Account Control', 'Bypassing UAC.', 'privilege-escalation'),
            ('T1548.003', 'Abuse Elevation Control Mechanism: Sudo and Sudo Caching', 'Abusing sudo (Linux).', 'privilege-escalation'),
            ('T1548.004', 'Abuse Elevation Control Mechanism: Elevated Execution with Prompt', 'Prompting for elevated execution.', 'privilege-escalation'),
            ('T1134', 'Access Token Manipulation', 'Manipulating access tokens.', 'privilege-escalation'),
            ('T1547.011', 'Boot or Logon Autostart Execution: Plist Modification', 'Plist persistence (macOS).', 'privilege-escalation'),
            ('T1548.001', 'Abuse Elevation Control Mechanism: Setuid and Setgid', 'Setuid/setgid (Unix).', 'privilege-escalation'),
            ('T1068', 'Exploitation for Privilege Escalation', 'Exploiting kernel vulns for priv esc.', 'privilege-escalation'),
            ('T1548.005', 'Abuse Elevation Control Mechanism: Temporary Elevated Cloud Access', 'Temp cloud escalation.', 'privilege-escalation'),
            
            ('T1548', 'Abuse Elevation Control Mechanism', 'Bypassing elevation controls.', 'defense-evasion'),
            ('T1548.002', 'Abuse Elevation Control Mechanism: Bypass User Account Control', 'Bypassing UAC (Defense Evasion).', 'defense-evasion'),
            ('T1197', 'BITS Jobs', 'Abusing BITS (Defense Evasion).', 'defense-evasion'),
            ('T1612', 'Build Image on Host', 'Building container images.', 'defense-evasion'),
            ('T1140', 'Deobfuscate/Decode Files or Information', 'Deobfuscating payloads.', 'defense-evasion'),
            ('T1036', 'Masquerading', 'Masking true object identity.', 'defense-evasion'),
            ('T1027', 'Obfuscated Files or Information', 'Using obfuscation/encoding.', 'defense-evasion'),
            ('T1027.001', 'Obfuscated Files or Information: Binary Padding', 'Binary padding for obfuscation.', 'defense-evasion'),
            ('T1027.002', 'Obfuscated Files or Information: Software Packing', 'Software packing.', 'defense-evasion'),
            ('T1027.003', 'Obfuscated Files or Information: Steganography', 'Steganography techniques.', 'defense-evasion'),
            ('T1027.004', 'Obfuscated Files or Information: Compile After Delivery', 'Compiling payloads after delivery.', 'defense-evasion'),
            ('T1027.005', 'Obfuscated Files or Information: Indicator Removal from Tools', 'Removing indicators from tools.', 'defense-evasion'),
            ('T1027.006', 'Obfuscated Files or Information: HTML Smuggling', 'HTML smuggling.', 'defense-evasion'),
            ('T1542', 'Pre-OS Boot', 'Modifying pre-boot mechanisms.', 'defense-evasion'),
            ('T1014', 'Rootkit', 'Installing rootkits.', 'defense-evasion'),
            ('T1218', 'Signed Binary Proxy Execution', 'Misusing signed binaries.', 'defense-evasion'),
            ('T1216', 'Signed Script Proxy Execution', 'Misusing signed scripts.', 'defense-evasion'),
            ('T1216.001', 'Signed Script Proxy Execution: PubPrn', 'PubPrn.vbs abuse.', 'defense-evasion'),
            ('T1535', 'Unused/Unsupported Cloud Regions', 'Using unsupported cloud regions.', 'defense-evasion'),
            ('T1550', 'Use Alternate Authentication Material', 'Using alternate auth material.', 'defense-evasion'),
            ('T1550.001', 'Use Alternate Authentication Material: Application Access Token', 'Using app tokens.', 'defense-evasion'),
            ('T1550.002', 'Use Alternate Authentication Material: Pass the Hash', 'Pass-the-hash attacks.', 'defense-evasion'),
            ('T1550.003', 'Use Alternate Authentication Material: Pass the Ticket', 'Pass-the-ticket (Kerberos).', 'defense-evasion'),
            ('T1550.004', 'Use Alternate Authentication Material: Web Session Cookie', 'Web session cookie reuse.', 'defense-evasion'),
            ('T1078', 'Valid Accounts', 'Using valid credentials.', 'defense-evasion'),
            ('T1197', 'BITS Jobs', 'BITS (Defense Evasion).', 'defense-evasion'),
            
            ('T1110', 'Brute Force', 'Brute force attacks.', 'credential-access'),
            ('T1110.001', 'Brute Force: Password Guessing', 'Password guessing.', 'credential-access'),
            ('T1110.002', 'Brute Force: Password Spraying', 'Password spraying.', 'credential-access'),
            ('T1110.003', 'Brute Force: Password Cracking', 'Password cracking.', 'credential-access'),
            ('T1110.004', 'Brute Force: Credential Stuffing', 'Credential stuffing.', 'credential-access'),
            ('T1187', 'Forced Authentication', 'Forcing authentication.', 'credential-access'),
            ('T1111', 'Multi-Stage Channels', 'Multi-stage channels for C2.', 'credential-access'),
            ('T1056', 'Input Capture', 'Capturing user input.', 'credential-access'),
            ('T1056.001', 'Input Capture: Keylogging', 'Keylogging attacks.', 'credential-access'),
            ('T1056.002', 'Input Capture: GUI Input Capture', 'GUI input capture.', 'credential-access'),
            ('T1056.003', 'Input Capture: Web Portal Capture', 'Web portal input capture.', 'credential-access'),
            ('T1056.004', 'Input Capture: Credential API Hooking', 'API credential hooking.', 'credential-access'),
            ('T1557', 'Man-in-the-Middle', 'MITM attacks.', 'credential-access'),
            ('T1040', 'Network Sniffing', 'Network sniffing for credentials.', 'credential-access'),
            ('T1111', 'Multi-Factor Authentication Interception', 'MFA interception.', 'credential-access'),
            ('T1556', 'Modify Authentication Process', 'Modifying authentication mechanisms.', 'credential-access'),
            ('T1040', 'Network Sniffing', 'Sniffing network traffic.', 'credential-access'),
            ('T1040', 'Network Sniffing', 'Network sniffing.', 'credential-access'),
            ('T1621', 'Multi-Factor Authentication Request Generation', 'MFA request generation.', 'credential-access'),
            ('T1040', 'Network Sniffing', 'Network traffic sniffing.', 'credential-access'),
            ('T1040', 'Network Sniffing', 'Credential sniffing.', 'credential-access'),
            ('T1040', 'Network Sniffing', 'Network monitoring.', 'credential-access'),
            ('T1557', 'Man-in-the-Middle', 'MITM for cred theft.', 'credential-access'),
            ('T1040', 'Network Sniffing', 'Sniffing for credentials.', 'credential-access'),
            
            # Lateral Movement
            ('T1210', 'Exploitation of Remote Services', 'Exploiting remote services.', 'lateral-movement'),
            ('T1570', 'Lateral Tool Transfer', 'Transferring tools laterally.', 'lateral-movement'),
            ('T1021', 'Remote Services', 'Using remote services for lateral movement.', 'lateral-movement'),
            ('T1021.001', 'Remote Services: Remote Desktop Protocol', 'RDP lateral movement.', 'lateral-movement'),
            ('T1021.002', 'Remote Services: SMB/Windows Admin Shares', 'SMB/admin shares.', 'lateral-movement'),
            ('T1021.003', 'Remote Services: Distributed Component Object Model', 'DCOM lateral movement.', 'lateral-movement'),
            ('T1021.004', 'Remote Services: SSH', 'SSH for lateral movement.', 'lateral-movement'),
            ('T1021.005', 'Remote Services: VNC', 'VNC for lateral movement.', 'lateral-movement'),
            ('T1021.006', 'Remote Services: Windows Remote Management', 'WinRM lateral movement.', 'lateral-movement'),
            
            # Command and Control
            ('T1071', 'Application Layer Protocol', 'C2 via app protocols.', 'command-and-control'),
            ('T1071.001', 'Application Layer Protocol: Web Protocols', 'HTTP/HTTPS C2.', 'command-and-control'),
            ('T1071.002', 'Application Layer Protocol: File Transfer Protocols', 'FTP/SFTP C2.', 'command-and-control'),
            ('T1071.003', 'Application Layer Protocol: Mail Protocols', 'SMTP/IMAP C2.', 'command-and-control'),
            ('T1071.004', 'Application Layer Protocol: DNS', 'DNS tunneling C2.', 'command-and-control'),
            ('T1092', 'Communication Through Removable Media', 'C2 via removable media.', 'command-and-control'),
            ('T1001', 'Data Obfuscation', 'Obfuscating C2 traffic.', 'command-and-control'),
            ('T1008', 'Fallback Channels', 'Fallback C2 channels.', 'command-and-control'),
            ('T1105', 'Ingress Tool Transfer', 'Transferring tools to target.', 'command-and-control'),
            ('T1571', 'Non-Standard Port', 'Using non-standard ports.', 'command-and-control'),
            ('T1090', 'Proxy', 'Using proxies for C2.', 'command-and-control'),
            ('T1090.001', 'Proxy: Internal Proxy', 'Internal proxy C2.', 'command-and-control'),
            ('T1090.002', 'Proxy: External Proxy', 'External proxy C2.', 'command-and-control'),
            ('T1090.003', 'Proxy: Multi-proxy', 'Multi-proxy chains.', 'command-and-control'),
            ('T1090.004', 'Proxy: Domain Fronting', 'Domain fronting.', 'command-and-control'),
            ('T1095', 'Non-Application Layer Protocol', 'Non-app layer C2 (ICMP, DNS).', 'command-and-control'),
            
            # Exfiltration
            ('T1020', 'Automated Exfiltration', 'Automated data exfiltration.', 'exfiltration'),
            ('T1030', 'Data Transfer Size Limits', 'Limiting exfil data size.', 'exfiltration'),
            ('T1048', 'Exfiltration Over Alternative Protocol', 'Non-standard exfil protocols.', 'exfiltration'),
            ('T1041', 'Exfiltration Over C2 Channel', 'Exfil via C2.', 'exfiltration'),
            ('T1011', 'Exfiltration Over Other Network Medium', 'Alternative network exfil.', 'exfiltration'),
            ('T1052', 'Exfiltration Over Physical Medium', 'Physical media exfil.', 'exfiltration'),
            ('T1567', 'Exfiltration Over Web Service', 'Web service exfil.', 'exfiltration'),
            ('T1020', 'Automated Exfiltration', 'Auto-exfil.', 'exfiltration'),
            ('T1537', 'Transfer Data to Cloud Account', 'Cloud account exfil.', 'exfiltration'),
            
            # Collection
            ('T1123', 'Audio Capture', 'Audio recording.', 'collection'),
            ('T1119', 'Automated Exfiltration', 'Auto-collection.', 'collection'),
            ('T1115', 'Clipboard Data', 'Clipboard capture.', 'collection'),
            ('T1530', 'Data from Cloud Storage', 'Cloud storage collection.', 'collection'),
            ('T1005', 'Data from Local System', 'Local data collection.', 'collection'),
            ('T1039', 'Data from Network Shared Drive', 'Shared drive collection.', 'collection'),
            ('T1213', 'Data from Information Repositories', 'Repo collection.', 'collection'),
            ('T1005', 'Data Staged', 'Data staging.', 'collection'),
            ('T1123', 'Audio Capture', 'Audio recording (Collection).', 'collection'),
            
            # Impact
            ('T1531', 'Account Access Removal', 'Removing account access.', 'impact'),
            ('T1531', 'Account Access Removal', 'Account disable.', 'impact'),
            ('T1485', 'Data Destruction', 'Destructive attacks.', 'impact'),
            ('T1491', 'Defacement', 'Website defacement.', 'impact'),
            ('T1561', 'Disk Wipe', 'Disk wiping.', 'impact'),
            ('T1499', 'Endpoint Denial of Service', 'DoS attacks.', 'impact'),
            ('T1561', 'Disk Structure Wipe', 'Wiping disk structures.', 'impact'),
            ('T1561.002', 'Disk Wipe: Inhabited Disk Sectors', 'Targeting inhabited sectors.', 'impact'),
            ('T1561.001', 'Disk Wipe: Disk Content Wipe', 'Disk content wipe.', 'impact'),
            ('T1499.001', 'Endpoint Denial of Service: OS Exhaustion Flood', 'OS resource exhaustion.', 'impact'),
            ('T1499.002', 'Endpoint Denial of Service: Service Exhaustion Flood', 'Service exhaustion.', 'impact'),
            ('T1499.003', 'Endpoint Denial of Service: Application Exhaustion Flood', 'App exhaustion.', 'impact'),
            ('T1499.004', 'Endpoint Denial of Service: Application Exhaustion Flood', 'App-level DoS.', 'impact'),
            ('T1561.001', 'Disk Wipe: Disk Content Wipe', 'Disk content wipe (Impact).', 'impact'),
            ('T1491', 'Defacement: Internal Defacement', 'Internal defacement.', 'impact'),
            ('T1491.002', 'Defacement: External Defacement', 'External defacement.', 'impact'),
            ('T1561.002', 'Disk Wipe: Governed Disk Wipe', 'Governed disk wipe.', 'impact'),
            ('T1561', 'Disk Structure Wipe', 'Disk structure wipe (Impact).', 'impact'),
            ('T1499', 'Endpoint Denial of Service', 'Endpoint DoS (Impact).', 'impact'),
            ('T1561.001', 'Disk Wipe: Disk Content Wipe', 'Disk wipe (Impact).', 'impact'),
            ('T1485', 'Data Destruction', 'Data destruction (Impact).', 'impact'),
        ]

        techniques_created = 0
        skipped = 0

        for mitre_id, name, description, tactic_shortname in techniques_data:
            if tactic_shortname not in tactic_map:
                skipped += 1
                continue

            tactic = tactic_map[tactic_shortname]

            obj, is_new = MitreTechnique.objects.update_or_create(
                mitre_id=mitre_id,
                defaults={
                    'name': name,
                    'description': description,
                    'tactic': tactic
                }
            )
            if is_new:
                techniques_created += 1

        self.stdout.write(f'  Techniques: {techniques_created} created/updated ({skipped} skipped)')
