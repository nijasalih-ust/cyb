"""
Django management command to seed MITRE ATT&CK from a local enterprise-attack.json file.

Usage:
    python manage.py seed_mitre_from_file --file ../enterprise-attack.json

This parses the STIX JSON bundle and upserts tactics, maps them to Kill Chain phases,
and upserts techniques selecting a primary tactic to satisfy your schema.
"""

import os
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import KillChainPhase, MitreTactic, MitreTechnique, TacticPhaseMap


class Command(BaseCommand):
    help = 'Seed MITRE ATT&CK from local enterprise-attack.json'

    def add_arguments(self, parser):
        parser.add_argument('--file', dest='file', default='../enterprise-attack.json', help='Path to enterprise-attack.json (relative to backend/)')

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

        self.stdout.write(self.style.NOTICE(f'  Kill Chain Phases ensured: {created} created/updated'))

    def handle(self, *args, **options):
        file_path = options['file']
        # If file path is relative, make it relative to backend/ (manage.py location)
        if not os.path.isabs(file_path):
            file_path = os.path.normpath(os.path.join(os.getcwd(), file_path))

        if not os.path.exists(file_path):
            raise FileNotFoundError(f'File not found: {file_path}')

        self.stdout.write(self.style.NOTICE(f'Loading STIX bundle from {file_path}'))
        with open(file_path, 'r', encoding='utf-8') as fh:
            data = json.load(fh)

        objects = data.get('objects') or []

        # Ensure kill chain phases exist
        self._seed_kill_chain_phases()

        # Extract tactics and techniques
        tactics = [o for o in objects if o.get('type') == 'x-mitre-tactic']
        techniques = [o for o in objects if o.get('type') == 'attack-pattern' and not o.get('revoked')]

        self.stdout.write(self.style.NOTICE(f'Found {len(tactics)} tactics and {len(techniques)} techniques in file'))

        # Map tactic shortname -> DB object
        tactic_short_map = {}

        # Phase mapping from MITRE names/shortnames -> step numbers
        tactic_to_phase = {
            'reconnaissance': 1,
            'resource-development': 2,
            'initial-access': 3,
            'execution': 4,
            'persistence': 5,
            'privilege-escalation': 4,
            'defense-evasion': 5,
            'credential-access': 6,
            'discovery': 1,
            'lateral-movement': 6,
            'command-and-control': 6,
            'exfiltration': 7,
            'impact': 7,
            'collection': 5,
        }

        tactics_created = 0
        for t in tactics:
            # find mitre external id
            mitre_id = None
            for ref in t.get('external_references', []) or []:
                if ref.get('source_name') == 'mitre-attack' and ref.get('external_id'):
                    mitre_id = ref.get('external_id')
                    break
            if not mitre_id:
                continue
            name = t.get('name') or mitre_id
            short = t.get('x_mitre_shortname') or name.lower().replace(' ', '-')

            obj, created = MitreTactic.objects.update_or_create(mitre_id=mitre_id, defaults={'name': name})
            if created:
                tactics_created += 1
            tactic_short_map[short] = obj

            # Map to phase if applicable
            phase_num = tactic_to_phase.get(short) or tactic_to_phase.get(name.lower())
            if phase_num:
                phase = KillChainPhase.objects.filter(step_number=phase_num).first()
                if phase:
                    TacticPhaseMap.objects.update_or_create(tactic=obj, phase=phase, defaults={})

        self.stdout.write(self.style.SUCCESS(f'  Tactics created/updated: {tactics_created}'))

        techniques_created = 0
        techniques_skipped = 0
        for tech in techniques:
            mitre_id = None
            for ref in tech.get('external_references', []) or []:
                if ref.get('source_name') == 'mitre-attack' and ref.get('external_id'):
                    mitre_id = ref.get('external_id')
                    break
            if not mitre_id:
                techniques_skipped += 1
                continue

            name = tech.get('name') or mitre_id
            desc = tech.get('description') or ''

            # Determine primary tactic: prefer kill_chain_phases, then x_mitre_tactics
            primary_tactic = None
            for kcp in tech.get('kill_chain_phases', []) or []:
                # STIX kill_chain_phases entries may be dicts with phase_name
                phase_name = kcp.get('phase_name') if isinstance(kcp, dict) else None
                if phase_name:
                    key = phase_name.lower()
                    if key in tactic_short_map:
                        primary_tactic = tactic_short_map[key]
                        break
            if not primary_tactic:
                for xt in tech.get('x_mitre_tactics', []) or []:
                    key = xt.lower().replace(' ', '-')
                    if key in tactic_short_map:
                        primary_tactic = tactic_short_map[key]
                        break

            # Fallback: pick any tactic
            if not primary_tactic and tactic_short_map:
                primary_tactic = next(iter(tactic_short_map.values()))

            if not primary_tactic:
                techniques_skipped += 1
                continue

            obj, created = MitreTechnique.objects.update_or_create(
                mitre_id=mitre_id,
                defaults={'name': name, 'description': desc, 'tactic': primary_tactic}
            )
            if created:
                techniques_created += 1

        self.stdout.write(self.style.SUCCESS(f'  Techniques created: {techniques_created}, skipped: {techniques_skipped}'))

        # Summary counts
        total_tactics = MitreTactic.objects.count()
        total_techniques = MitreTechnique.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Total tactics in DB: {total_tactics}'))
        self.stdout.write(self.style.SUCCESS(f'Total techniques in DB: {total_techniques}'))
