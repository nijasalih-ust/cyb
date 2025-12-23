"""
Django management command to seed MITRE ATT&CK framework from official TAXII server.

Usage:
    python manage.py seed_mitre_framework

This command:
- Fetches STIX objects from MITRE TAXII (Enterprise ATT&CK)
- Ensures Kill Chain phases exist (static: Reconnaissance -> Actions on Objectives)
- Maps MITRE tactics to Kill Chain phases
- Seeds mitre_tactics, mitre_techniques, and tactic_phase_map

If network is blocked, this will fail gracefully.
"""

from django.core.management.base import BaseCommand, CommandError
from api.models import KillChainPhase, MitreTactic, MitreTechnique, TacticPhaseMap


class Command(BaseCommand):
    help = "Seed MITRE ATT&CK framework data from official TAXII server"

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-network',
            action='store_true',
            help='Skip network fetch; only ensure kill chain phases exist',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Starting MITRE framework seeder'))

        # Step 1: Ensure Kill Chain Phases exist
        self._seed_kill_chain_phases()

        # Step 2: Fetch and seed tactics/techniques from TAXII
        if not options['skip_network']:
            try:
                self._fetch_and_seed_from_taxii()
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  TAXII fetch failed (network issue?): {e}')
                )
                self.stdout.write(self.style.WARNING('Continuing with existing data...'))
        else:
            self.stdout.write(self.style.WARNING('Skipping network fetch (--skip-network)'))

        self.stdout.write(self.style.SUCCESS('✅ MITRE framework seeding complete'))

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

    def _fetch_and_seed_from_taxii(self):
        """Fetch MITRE ATT&CK from TAXII and seed database."""
        import ssl
        import urllib3
        from taxii2client.v21 import Server
        from stix2 import TAXIICollectionSource, Filter

        # Suppress SSL warnings (for testing only)
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        ssl_verify = False

        self.stdout.write('  Connecting to MITRE TAXII server...')
        server = Server('https://cti-taxii.mitre.org/stix/collections/', verify=ssl_verify)
        api_roots = server.api_roots
        if not api_roots:
            raise RuntimeError('No API roots found on TAXII server')
        
        api_root = api_roots[0]

        # Find Enterprise ATT&CK collection
        collection = None
        for c in api_root.collections:
            title = getattr(c, 'title', '') or getattr(c, 'id', '')
            if 'Enterprise' in title or 'enterprise-attack' in title.lower():
                collection = c
                break
        if not collection:
            collection = api_root.collections[0]

        src = TAXIICollectionSource(collection)

        self.stdout.write('  Fetching MITRE tactics and techniques...')
        tactics = list(src.query(Filter('type', '=', 'x-mitre-tactic')))
        techniques = list(src.query([
            Filter('type', '=', 'attack-pattern'),
            Filter('revoked', '!=', True)
        ]))

        self.stdout.write(f'  Fetched {len(tactics)} tactics and {len(techniques)} techniques')

        # Map tactic shortname -> DB id
        tactic_short_to_dbid = {}

        # Seed tactics and map to phases
        self.stdout.write('  Seeding tactics...')
        tactics_created = 0
        for t in tactics:
            # Extract MITRE ID
            mitre_id = None
            for ref in getattr(t, 'external_references', []) or []:
                if getattr(ref, 'source_name', '') == 'mitre-attack':
                    mitre_id = getattr(ref, 'external_id', None)
                    if mitre_id:
                        break
            if not mitre_id:
                continue

            name = getattr(t, 'name', mitre_id)
            shortname = getattr(t, 'x_mitre_shortname', None) or name.lower().replace(' ', '-')

            # Upsert tactic
            obj, is_new = MitreTactic.objects.update_or_create(
                mitre_id=mitre_id,
                defaults={'name': name}
            )
            if is_new:
                tactics_created += 1
            tactic_short_to_dbid[shortname] = obj.id

            # Map to phase if defined
            phase_key = shortname.lower()
            phase_mapping = {
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
            }
            phase_num = phase_mapping.get(phase_key) or phase_mapping.get(name.lower())
            if phase_num:
                phase = KillChainPhase.objects.filter(step_number=phase_num).first()
                if phase:
                    TacticPhaseMap.objects.update_or_create(
                        tactic=obj,
                        phase=phase,
                        defaults={}
                    )

        self.stdout.write(f'    {tactics_created} tactics created')

        # Seed techniques
        self.stdout.write('  Seeding techniques...')
        techniques_created = 0
        for tech in techniques:
            # Extract MITRE ID
            mitre_id = None
            for ref in getattr(tech, 'external_references', []) or []:
                if getattr(ref, 'source_name', '') == 'mitre-attack':
                    mitre_id = getattr(ref, 'external_id', None)
                    if mitre_id:
                        break
            if not mitre_id:
                continue

            name = getattr(tech, 'name', mitre_id)
            desc = getattr(tech, 'description', '')

            # Determine primary tactic
            primary_tactic = None

            # Try kill_chain_phases attribute (common in STIX)
            for kcp in getattr(tech, 'kill_chain_phases', []) or []:
                phase_name = kcp.get('phase_name', '').lower() if isinstance(kcp, dict) else getattr(kcp, 'phase_name', '').lower()
                if phase_name in tactic_short_to_dbid:
                    primary_tactic = MitreTactic.objects.filter(id=tactic_short_to_dbid[phase_name]).first()
                    break

            # Try x_mitre_tactics attribute
            if not primary_tactic:
                x_tactics = getattr(tech, 'x_mitre_tactics', []) or []
                for xt in x_tactics:
                    key = xt.lower().replace(' ', '-') if isinstance(xt, str) else str(xt).lower().replace(' ', '-')
                    if key in tactic_short_to_dbid:
                        primary_tactic = MitreTactic.objects.filter(id=tactic_short_to_dbid[key]).first()
                        if primary_tactic:
                            break

            # Fallback: pick any tactic
            if not primary_tactic and tactic_short_to_dbid:
                first_id = list(tactic_short_to_dbid.values())[0]
                primary_tactic = MitreTactic.objects.filter(id=first_id).first()

            # Upsert technique
            if primary_tactic:
                obj, is_new = MitreTechnique.objects.update_or_create(
                    mitre_id=mitre_id,
                    defaults={
                        'name': name,
                        'description': desc,
                        'tactic': primary_tactic
                    }
                )
                if is_new:
                    techniques_created += 1

        self.stdout.write(f'    {techniques_created} techniques created')
