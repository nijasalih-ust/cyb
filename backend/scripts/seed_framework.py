"""
Standalone MITRE ATT&CK seeder for CYB.LIB
- Fetches STIX objects from MITRE TAXII (Enterprise ATT&CK)
- Maps MITRE tactics to Kill Chain phases (hardcoded)
- Picks a primary tactic per technique to satisfy schema (tactic FK)
- Inserts/updates `mitre_tactics`, `mitre_techniques`, and `tactic_phase_map`

Run (from repo root):
    python backend/scripts/seed_framework.py

Requirements:
    pip install taxii2-client stix2 psycopg2-binary python-dotenv

Note: This script uses the Django DB directly via psycopg2 to avoid importing project settings.
If you'd rather use Django ORM, I can provide a management command version.
"""

import os
import uuid
import sys
from pprint import pprint

# Optional: load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
except Exception:
    pass

DB_CONFIG = {
    "dbname": os.getenv('DB_NAME', 'cybdb'),
    "user": os.getenv('DB_USER', 'postgres'),
    "password": os.getenv('DB_PASSWORD', ''),
    "host": os.getenv('DB_HOST', 'localhost'),
    "port": os.getenv('DB_PORT', '5432'),
}

# TAXII server
TAXII_URL = "https://cti-taxii.mitre.org/stix/collections/"  # alternative to attack-taxii

# Map MITRE tactic names to Kill Chain step numbers (1-7)
TACTIC_TO_PHASE_MAP = {
    "reconnaissance": 1,
    "resource-development": 2,  # weaponization-ish
    "initial-access": 3,
    "execution": 4,
    "persistence": 5,
    "privilege-escalation": 4,
    "defense-evasion": 5,
    "credential-access": 6,
    "discovery": 1,
    "lateral-movement": 6,
    "command-and-control": 6,
    "exfiltration": 7,
    "impact": 7,
}

# Tables used by project (adjust names if your migrations use different names)
TABLE_KILL_CHAIN = 'api_killchainphase'
TABLE_MITRE_TACTIC = 'api_mitretactic'
TABLE_MITRE_TECH = 'api_mitretechnique'
TABLE_TACTIC_PHASE = 'api_tacticphasemap'


def fetch_from_taxii():
    """Fetch STIX objects from MITRE TAXII using taxii2-client and stix2."""
    try:
        from taxii2client.v21 import Server
        from stix2 import TAXIICollectionSource, Filter
    except Exception as e:
        print("Missing dependencies: please install 'taxii2-client stix2' (pip install taxii2-client stix2)")
        raise

    print("Connecting to TAXII server...", TAXII_URL)
    server = Server(TAXII_URL)
    api_roots = server.api_roots
    if not api_roots:
        raise RuntimeError("No API roots from TAXII server")
    api_root = api_roots[0]

    # Find Enterprise ATT&CK collection title matching common names
    collection = None
    for c in api_root.collections:
        title = getattr(c, 'title', '') or getattr(c, 'id', '')
        if 'Enterprise' in title or 'enterprise-attack' in title.lower():
            collection = c
            break
    if not collection:
        # fallback to first collection
        collection = api_root.collections[0]

    src = TAXIICollectionSource(collection)

    tactics = list(src.query(Filter('type', '=', 'x-mitre-tactic')))
    techniques = list(src.query([Filter('type', '=', 'attack-pattern'), Filter('revoked', '!=', True)]))

    print(f"Fetched {len(tactics)} tactics and {len(techniques)} techniques")
    return tactics, techniques


def upsert(db, cursor, sql, params):
    cursor.execute(sql, params)
    try:
        return cursor.fetchone()
    except Exception:
        return None


def seed():
    import psycopg2

    print("Connecting to DB", {k: DB_CONFIG[k] for k in ('dbname','host','port','user')})
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Ensure kill chain phases exist (step_number 1..7)
    phases = [
        (1, 'Reconnaissance', 'Planning and research.'),
        (2, 'Weaponization', 'Preparation of tools.'),
        (3, 'Delivery', 'Transmission to target.'),
        (4, 'Exploitation', 'Triggering the weapon.'),
        (5, 'Installation', 'Establishing persistence.'),
        (6, 'Command and Control', 'Remote manipulation.'),
        (7, 'Actions on Objectives', 'Data theft or destruction.'),
    ]

    for step, name, desc in phases:
        cur.execute(f"INSERT INTO {TABLE_KILL_CHAIN} (step_number, name, description) VALUES (%s,%s,%s) ON CONFLICT (step_number) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description RETURNING id;", (step, name, desc))
        res = cur.fetchone()
        if res:
            pass

    tactics, techniques = fetch_from_taxii()

    # Map stix tactic shortname to DB id
    tactic_short_to_dbid = {}

    print("Seeding tactics...")
    for t in tactics:
        # find mitre id from external_references
        mitre_id = None
        for ref in getattr(t, 'external_references', []) or []:
            if getattr(ref, 'source_name', '') == 'mitre-attack' and getattr(ref, 'external_id', None):
                mitre_id = ref.external_id
                break
        if not mitre_id:
            continue
        name = getattr(t, 'name', mitre_id)
        short = getattr(t, 'x_mitre_shortname', None) or (name.lower().replace(' ', '-'))

        # insert tactic
        cur.execute(f"INSERT INTO {TABLE_MITRE_TACTIC} (id, mitre_id, name) VALUES (%s,%s,%s) ON CONFLICT (mitre_id) DO UPDATE SET name=EXCLUDED.name RETURNING id;", (str(uuid.uuid4()), mitre_id, name))
        dbid = cur.fetchone()[0]
        tactic_short_to_dbid[short] = dbid

        # map to phase if possible
        key = (getattr(t, 'x_mitre_shortname', '') or name).lower()
        phase_num = TACTIC_TO_PHASE_MAP.get(key) or TACTIC_TO_PHASE_MAP.get(name.lower())
        if phase_num:
            cur.execute(f"SELECT id FROM {TABLE_KILL_CHAIN} WHERE step_number = %s", (phase_num,))
            row = cur.fetchone()
            if row:
                phase_id = row[0]
                cur.execute(f"INSERT INTO {TABLE_TACTIC_PHASE} (tactic_id, phase_id) VALUES (%s,%s) ON CONFLICT DO NOTHING;", (dbid, phase_id))

    print("Seeding techniques (assigning primary tactic)...")
    for tech in techniques:
        mitre_id = None
        for ref in getattr(tech, 'external_references', []) or []:
            if getattr(ref, 'source_name', '') == 'mitre-attack' and getattr(ref, 'external_id', None):
                mitre_id = ref.external_id
                break
        if not mitre_id:
            continue

        name = getattr(tech, 'name', mitre_id)
        desc = getattr(tech, 'description', '')

        # try to pick a primary tactic from kill_chain_phases or x_mitre_domains
        primary_dbid = None

        # Many STIX objects include 'kill_chain_phases' as list of dicts
        for kcp in getattr(tech, 'kill_chain_phases', []) or []:
            phase_name = kcp.get('phase_name', '').lower()
            # Some phase_name values are actually tactic shortnames
            if phase_name in tactic_short_to_dbid:
                primary_dbid = tactic_short_to_dbid[phase_name]
                break
            # fall back to mapping by name
            if phase_name in TACTIC_TO_PHASE_MAP:
                # pick any tactic mapped to that phase
                # we search tactic_short_to_dbid for an entry with matching phase mapping
                for short, dbid in tactic_short_to_dbid.items():
                    if TACTIC_TO_PHASE_MAP.get(short) == TACTIC_TO_PHASE_MAP[phase_name]:
                        primary_dbid = dbid
                        break
                if primary_dbid:
                    break

        # If still no tactic, attempt to use x_mitre_contributors or x_mitre_tactic refs
        if not primary_dbid:
            # try x_mitre_platforms or x_mitre_tactics
            x_tactics = getattr(tech, 'x_mitre_tactics', None) or []
            for xt in x_tactics:
                key = xt.lower().replace(' ', '-')
                if key in tactic_short_to_dbid:
                    primary_dbid = tactic_short_to_dbid[key]
                    break

        # Last resort: pick any tactic (to avoid skipping)
        if not primary_dbid and tactic_short_to_dbid:
            primary_dbid = list(tactic_short_to_dbid.values())[0]

        # Insert technique
        if primary_dbid:
            cur.execute(f"INSERT INTO {TABLE_MITRE_TECH} (id, mitre_id, name, description, tactic_id) VALUES (%s,%s,%s,%s,%s) ON CONFLICT (mitre_id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description, tactic_id=EXCLUDED.tactic_id RETURNING id;", (str(uuid.uuid4()), mitre_id, name, desc, primary_dbid))
            try:
                cur.fetchone()
            except Exception:
                pass

    conn.commit()
    cur.close()
    conn.close()
    print("Done seeding MITRE framework data.")


if __name__ == '__main__':
    try:
        seed()
    except Exception as e:
        print('Error:', e)
        sys.exit(1)
