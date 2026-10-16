def normalize_skill(skill):
    """
    Normalize skill names for reliable comparison.
    """
    return skill.strip().lower()


def validate_ai_analysis(
    ai_result,
    match_result
):
    """
    Validate and correct AI-generated skill-gap data.

    The deterministic matching engine is authoritative.
    """

    resume_skills = {
        normalize_skill(skill)
        for skill in match_result.get(
            "resume_skills",
            []
        )
    }

    matched_skills = {
        normalize_skill(skill)
        for skill in match_result.get(
            "matched_skills",
            []
        )
    }

    missing_required = {
        normalize_skill(skill)
        for skill in match_result.get(
            "missing_required_skills",
            []
        )
    }

    missing_preferred = {
        normalize_skill(skill)
        for skill in match_result.get(
            "missing_preferred_skills",
            []
        )
    }

    # --------------------------------------------------
    # VALIDATE CRITICAL GAPS
    # --------------------------------------------------

    valid_critical_gaps = []

    for gap in ai_result.get(
        "critical_skill_gaps",
        []
    ):

        skill = normalize_skill(
            gap.get("skill", "")
        )

        if not skill:
            continue

        # Skill must actually be a missing required skill
        if skill not in missing_required:
            continue

        # Never allow a resume/matched skill as a gap
        if skill in resume_skills:
            continue

        if skill in matched_skills:
            continue

        valid_critical_gaps.append(
            gap
        )

    ai_result["critical_skill_gaps"] = (
        valid_critical_gaps
    )

    # --------------------------------------------------
    # VALIDATE PREFERRED GAPS
    # --------------------------------------------------

    valid_preferred_gaps = []

    for gap in ai_result.get(
        "preferred_skill_gaps",
        []
    ):

        skill = normalize_skill(
            gap.get("skill", "")
        )

        if not skill:
            continue

        # Skill must actually be missing preferred skill
        if skill not in missing_preferred:
            continue

        if skill in resume_skills:
            continue

        if skill in matched_skills:
            continue

        valid_preferred_gaps.append(
            gap
        )

    ai_result["preferred_skill_gaps"] = (
        valid_preferred_gaps
    )

    return ai_result