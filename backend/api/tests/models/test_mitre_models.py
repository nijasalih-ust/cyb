import pytest
from django.db import IntegrityError
from api.models import MitreTactic, MitreTechnique


@pytest.mark.django_db
class TestMitreTactic:
    def test_tactic_creation(self):
        tactic = MitreTactic.objects.create(
            mitre_id="TA0001",
            name="Initial Access",
            description="Test description"
        )
        assert tactic.mitre_id == "TA0001"
        assert str(tactic) == "TA0001 - Initial Access"

    def test_mitre_id_unique(self):
        MitreTactic.objects.create(mitre_id="TA0002", name="Execution")
        with pytest.raises(IntegrityError):
            MitreTactic.objects.create(mitre_id="TA0002", name="Duplicate")


@pytest.mark.django_db
class TestMitreTechnique:
    def test_technique_creation(self):
        tactic = MitreTactic.objects.create(mitre_id="TA0001", name="Initial Access")
        tech = MitreTechnique.objects.create(
            mitre_id="T1059",
            name="Command Interpreter",
            tactic=tactic
        )
        assert tech.mitre_id == "T1059"
        assert tech.tactic == tactic
        assert tech.is_subtechnique is False

    def test_subtechnique_auto_detection(self):
        tactic = MitreTactic.objects.create(mitre_id="TA0002", name="Execution")
        parent = MitreTechnique.objects.create(
            mitre_id="T1059",
            name="Command Interpreter",
            tactic=tactic
        )
        subtech = MitreTechnique.objects.create(
            mitre_id="T1059.001",
            name="PowerShell",
            tactic=tactic,
            parent_technique=parent
        )
        subtech.refresh_from_db()
        assert subtech.is_subtechnique is True
        assert subtech.parent_technique == parent

    def test_technique_tactic_relationship(self):
        tactic = MitreTactic.objects.create(mitre_id="TA0003", name="Persistence")
        tech1 = MitreTechnique.objects.create(mitre_id="T1053", name="Scheduled Task", tactic=tactic)
        tech2 = MitreTechnique.objects.create(mitre_id="T1543", name="Create Service", tactic=tactic)
        
        assert list(tactic.techniques.all()) == [tech1, tech2]
