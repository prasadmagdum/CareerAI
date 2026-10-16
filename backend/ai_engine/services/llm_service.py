import json
import os
from ollama import chat


OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


def generate_ai_analysis(
    resume_text,
    job_description,
    match_result
):
    """
    Generate grounded AI analysis using Ollama.

    Important:
    The deterministic matching engine is the source of truth.
    The LLM is only responsible for explaining the results.
    """

    resume_skills = match_result.get(
        "resume_skills",
        []
    )

    matched_skills = match_result.get(
        "matched_skills",
        []
    )

    missing_skills = match_result.get(
        "missing_skills",
        []
    )

    matched_required_skills = match_result.get(
        "matched_required_skills",
        []
    )

    missing_required_skills = match_result.get(
        "missing_required_skills",
        []
    )

    matched_preferred_skills = match_result.get(
        "matched_preferred_skills",
        []
    )

    missing_preferred_skills = match_result.get(
        "missing_preferred_skills",
        []
    )

    prompt = f"""
You are an AI career advisor inside a Resume-JD matching system.

Your job is to analyze the candidate using the deterministic
matching results supplied below.

IMPORTANT:
The matching engine is AUTHORITATIVE.

You MUST NOT change, reinterpret, or contradict its skill results.

AUTHORITATIVE RESUME SKILLS:
{json.dumps(resume_skills, indent=2)}

AUTHORITATIVE MATCHED SKILLS:
{json.dumps(matched_skills, indent=2)}

AUTHORITATIVE MISSING SKILLS:
{json.dumps(missing_skills, indent=2)}

AUTHORITATIVE MATCHED REQUIRED SKILLS:
{json.dumps(matched_required_skills, indent=2)}

AUTHORITATIVE MISSING REQUIRED SKILLS:
{json.dumps(missing_required_skills, indent=2)}

AUTHORITATIVE MATCHED PREFERRED SKILLS:
{json.dumps(matched_preferred_skills, indent=2)}

AUTHORITATIVE MISSING PREFERRED SKILLS:
{json.dumps(missing_preferred_skills, indent=2)}

MATCH SCORES:
{json.dumps(match_result, indent=2)}

CANDIDATE RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}


GROUNDING RULES:

1. NEVER claim that a skill is missing if it exists in
   AUTHORITATIVE RESUME SKILLS.

2. NEVER claim that a skill is missing if it exists in
   AUTHORITATIVE MATCHED SKILLS.

3. CRITICAL SKILL GAPS may contain ONLY skills from
   AUTHORITATIVE MISSING REQUIRED SKILLS.

4. PREFERRED SKILL GAPS may contain ONLY skills from
   AUTHORITATIVE MISSING PREFERRED SKILLS.

5. NEVER invent a missing skill.

6. NEVER move a matched skill into a skill-gap section.

7. NEVER modify or recalculate the matching scores.

8. The AI is allowed to explain why a skill gap matters,
   but it cannot decide whether the skill is missing.

9. If there are no missing required skills, return:
   "critical_skill_gaps": []

10. If there are no missing preferred skills, return:
    "preferred_skill_gaps": []

11. Recommendations must be realistic and must NOT encourage
    the candidate to falsely claim experience.

12. If a skill is missing, recommend learning it, practicing it,
    or building a project using it.

13. If a skill is already matched, recommendations may suggest
    improving or demonstrating that skill, but must not describe
    it as missing.

14. Keep the analysis concise, practical, and career-focused.


RETURN ONLY VALID JSON.

Use exactly this structure:

{{
    "summary": "string",

    "strengths": [
        "string"
    ],

    "weaknesses": [
        "string"
    ],

    "critical_skill_gaps": [
        {{
            "skill": "string",
            "reason": "string",
            "action": "string"
        }}
    ],

    "preferred_skill_gaps": [
        {{
            "skill": "string",
            "reason": "string",
            "action": "string"
        }}
    ],

    "recommendations": [
        "string"
    ],

    "skill_gap_explanation": [
        "string"
    ],

    "interview_questions": [
        {{
            "category": "string",
            "question": "string",
            "difficulty": "easy | medium | hard"
        }}
    ],

    "resume_improvements": [
        "string"
    ],

    "job_readiness": {{
        "level": "beginner | developing | ready | highly_ready",
        "explanation": "string"
    }}
}}
"""

    response = chat(
        model=OLLAMA_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a grounded career analysis AI. "
                    "Always follow the deterministic matching "
                    "results supplied by the application."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        options={
            "temperature": 0.2
        }
    )

    content = response["message"]["content"]

    # Remove accidental markdown code fences
    content = content.strip()

    if content.startswith("```json"):
        content = content[7:]

    elif content.startswith("```"):
        content = content[3:]

    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    try:
        return json.loads(content)

    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Ollama returned invalid JSON: {exc}"
        )