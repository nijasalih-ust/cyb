import pytest
from api.models import MitreTactic, MitreTechnique
from api.serializers import MitreTacticSerializer, MitreTechniqueSerializer


@pytest.mark.django_db
class TestMitreTacticSerializer:
    def test_tactic_serialization(self):
        """Tactic should serialize with id, mitre_id, name"""
        tactic = MitreTactic.objects.create(
            mitre_id="TA0001",
            name="Initial Access",
            description="Test desc"
        )
        data = MitreTacticSerializer(tactic).data
        
        assert data["mitre_id"] == "TA0001"
        assert data["name"] == "Initial Access"
        assert "id" in data
        assert "description" not in data


@pytest.mark.django_db
class TestMitreTechniqueSerializer:
    def test_technique_serialization_with_nested_tactic(self):
        """Technique should nest tactic data (read_only)"""
        tactic = MitreTactic.objects.create(mitre_id="TA0002", name="Execution")
        technique = MitreTechnique.objects.create(
            mitre_id="T1059",
            name="Command Interpreter",
            tactic=tactic
        )
        data = MitreTechniqueSerializer(technique).data
        
        assert data["mitre_id"] == "T1059"
        assert data["name"] == "Command Interpreter"
        assert data["tactic"]["mitre_id"] == "TA0002"
        assert data["tactic"]["name"] == "Execution"

    def test_tactic_field_read_only(self):
        """Tactic field should not be writable via serializer"""
        tactic = MitreTactic.objects.create(mitre_id="TA0003", name="Persistence")
        technique = MitreTechnique.objects.create(
            mitre_id="T1053",
            name="Scheduled Task",
            tactic=tactic
        )
        
        serializer = MitreTechniqueSerializer(
            technique,
            data={"name": "Updated Name"},
            partial=True
        )
        assert serializer.is_valid()
        updated = serializer.save()
        
        assert updated.tactic == tactic

    def test_all_required_fields_present(self):
        """Serializer should expose id, mitre_id, name, description, tactic"""
        tactic = MitreTactic.objects.create(mitre_id="TA0004", name="Test")
        technique = MitreTechnique.objects.create(
            mitre_id="T1001",
            name="Test Tech",
            description="Test description",
            tactic=tactic
        )
        data = MitreTechniqueSerializer(technique).data
        
        assert "id" in data
        assert "mitre_id" in data
        assert "name" in data
        assert "description" in data
        assert "tactic" in data
