from resumes.services.skill_extractor import (
    extract_skills
)


REQUIRED_KEYWORDS = [
    "required",
    "must have",
    "must-have",
    "mandatory",
    "essential",
    "required skills",
    "requirements",
]


PREFERRED_KEYWORDS = [
    "preferred",
    "nice to have",
    "nice-to-have",
    "good to have",
    "plus",
    "bonus",
    "preferred skills",
]


def classify_skill_importance(
    text,
    skill_name
):
    """
    Determine whether a skill is required
    or preferred based on nearby text.
    """

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    skill_lower = skill_name.lower()

    for index, line in enumerate(lines):

        line_lower = line.lower()

        if skill_lower not in line_lower:
            continue

        context_start = max(
            0,
            index - 2
        )

        context_end = min(
            len(lines),
            index + 3
        )

        context = " ".join(
            lines[
                context_start:context_end
            ]
        ).lower()

        if any(
            keyword in context
            for keyword in PREFERRED_KEYWORDS
        ):
            return "preferred"

        if any(
            keyword in context
            for keyword in REQUIRED_KEYWORDS
        ):
            return "required"

    return "required"


def analyze_job_description(text):
    """
    Analyze a job description and extract
    skills with importance.
    """

    extracted_skills = extract_skills(text)

    skills = []

    for skill in extracted_skills:

        importance = classify_skill_importance(
            text,
            skill["name"]
        )

        skills.append({
            "name": skill["name"],
            "category": skill["category"],
            "confidence": skill["confidence"],
            "importance": importance,
        })

    return {
        "skills": skills
    }