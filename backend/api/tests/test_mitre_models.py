import pytest
from api.models import MitreTactic, MitreTechnique


def test_mitre_tactic_technique_relationship(db):
    """
    Verify that a Tactic can be created and a Technique can be linked to it.
    """
    # 1. Setup: Create a Tactic (The 'Parent' object)
    tactic = MitreTactic.objects.create(
        mitre_id="TA0001",
        name="Initial Access",
        description="The adversary is trying to get into your network."
    )

    # 2. Setup: Create a Technique linked to that Tactic
    technique = MitreTechnique.objects.create(
        mitre_id="T1566",
        name="Phishing",
        tactic=tactic,
        description="Sending emails to gain access."
    )

    # 3. Assertions: Check if the relationship works
    assert MitreTactic.objects.count() == 1
    assert MitreTechnique.objects.count() == 1
    
    # Check the reverse relationship (Tactic -> Techniques)
    assert tactic.techniques.count() == 1
    assert tactic.techniques.first().name == "Phishing"

    # Verify our custom 'save' logic for sub-techniques
    sub_tech = MitreTechnique.objects.create(
        mitre_id="T1566.001",
        name="Spearphishing Attachment",
        tactic=tactic
    )
    assert sub_tech.is_subtechnique is True  # Tests the logic in your save() method!