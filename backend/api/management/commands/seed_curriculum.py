import uuid
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from api.models import Path, Module, Lesson, MitreTechnique, LessonTechniqueMap

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the Learning Curriculum (Paths -> Modules -> Lessons)'

    def handle(self, *args, **kwargs):
        # 1. Check Prerequisite
        if not MitreTechnique.objects.exists():
            self.stdout.write(self.style.ERROR("Error: MITRE data missing. Run 'seed_mitre_from_file' first."))
            return

        self.stdout.write("🚀 Seeding Curriculum...")

        try:
            with transaction.atomic():
                # ---------------------------------------------------------
                # 1. Create Superuser (if not exists)
                # ---------------------------------------------------------
                if not User.objects.filter(username='admin').exists():
                    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
                    self.stdout.write("   Created Superuser: admin / admin")

                # ---------------------------------------------------------
                # 2. Paths
                # ---------------------------------------------------------
                path_data = [
                    ("SOC Fundamentals", "soc-fundamentals", "standard"),
                    ("Threat Hunting ATT&CK", "threat-hunting-attck", "campaign"),
                    ("Advanced Detection Engineering", "advanced-detection-engineering", "standard"),
                ]

                for title, slug, path_type in path_data:
                    Path.objects.update_or_create(
                        slug=slug,
                        defaults={"title": title, "type": path_type},
                    )
                self.stdout.write(f"   Processed {len(path_data)} Paths")

                # ---------------------------------------------------------
                # 3. Modules
                # ---------------------------------------------------------
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

                for path_slug, title, order in module_data:
                    path = Path.objects.get(slug=path_slug)
                    Module.objects.update_or_create(
                        path=path,
                        order_index=order,
                        defaults={"title": title}
                    )
                self.stdout.write(f"   Processed {len(module_data)} Modules")

                # ---------------------------------------------------------
                # 4. Lessons
                # ---------------------------------------------------------
                # (Path Slug, Module Order, Title, Route, Description, Key Indicators)
                lesson_data = [
                    ("soc-fundamentals", 1, "What is a SOC?", "what-is-soc",
                    "Learners understand the role, responsibilities, and daily workflow of Security Operations Center analysts.",
                    "high-severity alerts spiking\nunusual login patterns"),

                    ("soc-fundamentals", 1, "SOC Tooling Overview", "soc-tooling-overview",
                    "Learners identify primary tools used in modern SOC environments: SIEM, EDR, Zeek.",
                    "correlated alerts\nagent installations"),

                    ("soc-fundamentals", 2, "Packet Capture Basics", "packet-capture-basics",
                    "Learners interpret basic PCAP files to identify malicious network activity.",
                    "suspicious DNS queries\nHTTP POSTs to unknown IPs"),

                    ("soc-fundamentals", 2, "Network Scanning Detection", "network-scanning-detection",
                    "Learners recognize reconnaissance scanning patterns in network traffic.",
                    "high port scan volume\nSYN floods"),

                    ("soc-fundamentals", 3, "Windows Event ID 4624", "windows-event-4624",
                    "Learners analyze successful logon events for compromise indicators.",
                    "Logon Type 3\nexternal IPs"),

                    ("soc-fundamentals", 3, "PowerShell Event Logs", "powershell-event-logs",
                    "Learners detect malicious PowerShell execution through event logs.",
                    "encoded command parameters\nAMSI bypass"),

                    ("soc-fundamentals", 4, "Phishing Email Indicators", "phishing-email-indicators",
                    "Learners identify phishing artifacts in email headers and content.",
                    "mismatched DKIM/SPF\ndouble encoding"),

                    ("soc-fundamentals", 4, "Malicious Attachment Analysis", "malicious-attachment-analysis",
                    "Learners safely analyze Office documents and PDFs for exploits.",
                    "CVE references\nembedded OLE objects"),

                    ("threat-hunting-attck", 1, "Hypothesis-Driven Hunting", "hypothesis-driven-hunting",
                    "Learners build hunting hypotheses based on threat intel.",
                    "admin shares accessed\nunexpected service installations"),

                    ("threat-hunting-attck", 1, "Hypothesis Testing Framework", "hypothesis-testing-framework",
                    "Learners validate hunting hypotheses through iterative log queries.",
                    "consistent anomalies\nlow-confidence alerts"),

                    ("threat-hunting-attck", 2, "Registry Run Key Hunting", "hunting-registry-run-keys",
                    "Learners hunt persistence via Registry Run/RunOnce keys.",
                    "HKLM Run modifications\nunusual filenames"),

                    ("threat-hunting-attck", 2, "Scheduled Task Persistence", "hunting-scheduled-tasks",
                    "Learners detect persistence via Windows Task Scheduler abuse.",
                    "tasks outside patch windows\nS4U logon types"),

                    ("advanced-detection-engineering", 1, "Boolean Logic in SIEM", "boolean-logic-siem",
                    "Learners master AND OR NOT operators for precise alert logic.",
                    "broad alerts\nmissing exclusions"),

                    ("advanced-detection-engineering", 1, "Time Window Correlation", "time-window-correlation",
                    "Learners correlate events across time windows for behavioral detection.",
                    "events clustering\nprecursor activities"),
                ]

                # Counter for order_index within modules
                # This logic assumes the lesson_data list is ordered correctly
                module_lesson_counters = {} 

                for p_slug, m_order, title, route, desc, indicators in lesson_data:
                    module = Module.objects.get(path__slug=p_slug, order_index=m_order)
                    
                    # Auto-increment lesson order
                    key = f"{p_slug}-{m_order}"
                    current_order = module_lesson_counters.get(key, 1)
                    module_lesson_counters[key] = current_order + 1

                    Lesson.objects.update_or_create(
                        module=module,
                        title=title,
                        defaults={
                            "router_link": route,
                            "description": desc,
                            "key_indicators": indicators,
                            "order_index": current_order,
                            "content_type": "text" 
                        }
                    )
                self.stdout.write(f"   Processed {len(lesson_data)} Lessons")

                # ---------------------------------------------------------
                # 5. Link Lessons to MITRE Techniques
                # ---------------------------------------------------------
                lesson_technique_data = [
                    ("network-scanning-detection", ["T1190", "T1595"]),
                    ("powershell-event-logs", ["T1059.001", "T1027"]),
                    ("phishing-email-indicators", ["T1566"]),
                    ("malicious-attachment-analysis", ["T1566", "T1204.002"]),
                    ("hunting-registry-run-keys", ["T1547.001", "T1027"]),
                    ("hunting-scheduled-tasks", ["T1053.005", "T1543.003"]),
                    ("boolean-logic-siem", ["T1027"]),
                    ("time-window-correlation", ["T1021.001", "T1059.003"]),
                ]

                links_created = 0
                for route, tech_ids in lesson_technique_data:
                    try:
                        lesson = Lesson.objects.get(router_link=route)
                        for t_id in tech_ids:
                            # Fuzzy search because MITRE IDs might have sub-techniques
                            # We grab the exact match if possible
                            tech = MitreTechnique.objects.filter(mitre_id=t_id).first()
                            
                            if tech:
                                LessonTechniqueMap.objects.get_or_create(
                                    lesson=lesson,
                                    technique=tech
                                )
                                links_created += 1
                            else:
                                self.stdout.write(self.style.WARNING(f"Warning: Technique {t_id} not found in DB"))
                    except Lesson.DoesNotExist:
                        continue
                
                self.stdout.write(f"   Created {links_created} Lesson-Technique Links")

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Seeding Failed: {e}"))
            return

        self.stdout.write(self.style.SUCCESS("✅ Curriculum Seeding Completed Successfully"))