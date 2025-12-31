"""
Django management command to seed MITRE ATT&CK from a local enterprise-attack.json file.

Usage:
    python manage.py seed_mitre_from_file --file ../enterprise-attack.json

This parses the STIX JSON bundle and upserts tactics and techniques,
mapping techniques to their primary tactic.
"""

import os
import json
from django.core.management.base import BaseCommand
from api.models import MitreTactic, MitreTechnique

class Command(BaseCommand):
    help = 'Seed MITRE ATT&CK from local enterprise-attack.json (Schema v1.1)'

    def add_arguments(self, parser):
        # Default assumes file is one level up from backend/
        parser.add_argument('--file', dest='file', default='data/enterprise-attack.json', help='Path to enterprise-attack.json')

    def handle(self, *args, **options):
        file_path = options['file']
        
        # Resolve absolute path
        if not os.path.isabs(file_path):
            file_path = os.path.normpath(os.path.join(os.getcwd(), file_path))

        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return

        self.stdout.write(self.style.NOTICE(f'Loading STIX bundle from {file_path}'))
        
        try:
            with open(file_path, 'r', encoding='utf-8') as fh:
                data = json.load(fh)
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR(f'Invalid JSON in file: {file_path}'))
            return

        objects = data.get('objects', [])
        
        # 1. Extract Tactics
        # ------------------
        tactics = [o for o in objects if o.get('type') == 'x-mitre-tactic']
        techniques = [o for o in objects if o.get('type') == 'attack-pattern' and not o.get('revoked')]

        self.stdout.write(f"Found {len(tactics)} tactics and {len(techniques)} techniques.")

        # Map shortname -> Tactic Object (for linking techniques later)
        tactic_map = {}
        tactics_created = 0

        for t in tactics:
            mitre_id = None
            # Find external ID (e.g., TA0001)
            for ref in t.get('external_references', []):
                if ref.get('source_name') == 'mitre-attack' and ref.get('external_id'):
                    mitre_id = ref.get('external_id')
                    break
            
            if not mitre_id:
                continue

            name = t.get('name') or mitre_id
            shortname = t.get('x_mitre_shortname') or name.lower().replace(' ', '-')

            obj, created = MitreTactic.objects.update_or_create(
                mitre_id=mitre_id, 
                defaults={'name': name}
            )
            
            tactic_map[shortname] = obj
            if created:
                tactics_created += 1

        self.stdout.write(self.style.SUCCESS(f'Tactics processed: {tactics_created} new.'))

        # 2. Extract Techniques
        # ---------------------
        techniques_created = 0
        techniques_skipped = 0

        for tech in techniques:
            mitre_id = None
            for ref in tech.get('external_references', []):
                if ref.get('source_name') == 'mitre-attack' and ref.get('external_id'):
                    mitre_id = ref.get('external_id')
                    break
            
            if not mitre_id:
                techniques_skipped += 1
                continue

            name = tech.get('name') or mitre_id
            desc = tech.get('description') or ''

            # Determine primary tactic
            primary_tactic = None
            
            # Try kill_chain_phases first (standard STIX location)
            for kcp in tech.get('kill_chain_phases', []):
                phase_name = kcp.get('phase_name', '').lower()
                if phase_name in tactic_map:
                    primary_tactic = tactic_map[phase_name]
                    break  # Use first valid tactic found
            
            # Fallback: try x_mitre_tactics (legacy/custom)
            if not primary_tactic:
                for xt in tech.get('x_mitre_tactics', []):
                    key = xt.lower().replace(' ', '-')
                    if key in tactic_map:
                        primary_tactic = tactic_map[key]
                        break

            # If still no tactic, skip (cannot create without FK)
            if not primary_tactic:
                # Optional: You could assign a 'catch-all' tactic here if desired
                techniques_skipped += 1
                continue

            obj, created = MitreTechnique.objects.update_or_create(
                mitre_id=mitre_id,
                defaults={
                    'name': name, 
                    'description': desc, 
                    'tactic': primary_tactic
                }
            )
            if created:
                techniques_created += 1

        self.stdout.write(self.style.SUCCESS(f'Techniques processed: {techniques_created} new, {techniques_skipped} skipped.'))
        
        # Final Summary
        self.stdout.write(self.style.SUCCESS('--------------------------------------'))
        self.stdout.write(self.style.SUCCESS(f'Total Tactics DB: {MitreTactic.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Total Techniques DB: {MitreTechnique.objects.count()}'))
        self.stdout.write(self.style.SUCCESS('--------------------------------------'))