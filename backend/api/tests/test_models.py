import pytest
from api.models import MitreTactic, MitreTechnique


# @pytest.fixture
# def tactic_technique(db):
#     """
#     Verify that a Tactic can be created and a Technique can be linked to it.
#     """
#     # 1. Setup: Create a Tactic (The 'Parent' object)
#     tactic = MitreTactic.objects.create(
#         mitre_id="TA0001",
#         name="Initial Access",
#         description="The adversary is trying to get into your network."
#     )
#     # 2. Setup: Create a Technique linked to that Tactic
#     technique = MitreTechnique.objects.create(
#         mitre_id="T1566",
#         name="Phishing",
#         tactic=tactic,
#         description="Sending emails to gain access."
#     )
#     # Verify our custom 'save' logic for sub-techniques
#     sub_tech = MitreTechnique.objects.create(
#         mitre_id="T1566.001",
#         name="Spearphishing Attachment",
#         tactic=tactic
#     )
#     return {
#         "tactic": tactic,
#         "tech": technique,
#         "sub": sub_tech
#     }

# def test_mitre_tactic_technique(db,tactic_technique):
#     # 3. Assertions: Check if the relationship works
#     assert tactic_technique["tactic"].count() == 1
#     assert MitreTactic.objects.count() == 1
#     assert MitreTechnique.objects.count() == 2

# def test_mitre_tactic_technique_relationship(db, tactic_technique):    
#     # Check the reverse relationship (Tactic -> Techniques)
#     assert MitreTechnique.objects.count() == 2
#     assert MitreTechnique.objects.first().name == "Phishing"

# def test_mitre_technique_subtechnique_logic(db,tactic_technique):
#     # check if the subtechnique mapping works
#     assert tactic_technique["sub"].is_subtechnique is True  # Tests the logic in your save() method!

def test_mitre_technique_relationship(db):
    """
    Verify that Techniques can be linked to Tactics correctly.
    """
    # Create a Tactic
    tactic = MitreTactic.objects.create(
        mitre_id="TA0002",
        name="Execution",
        description="The adversary is trying to run malicious code."
    )
    # Create Techniques linked to that Tactic
    technique = MitreTechnique.objects.create(
        mitre_id="T1059",
        name="Command and Scripting Interpreter",
        tactic=tactic,
        description="Use of command-line interfaces and scripting languages."
    )

    assert MitreTactic.objects.count() == 1
    assert MitreTechnique.objects.count() == 1

    sub_technique = MitreTechnique.objects.create(
        mitre_id="T1059.001",
        name="PowerShell",
        tactic=tactic,
        description="Use of PowerShell commands and scripts."
    )

    assert sub_technique.is_subtechnique is True  # Tests the logic in your save() method!
    assert MitreTechnique.objects.count() == 2
    
