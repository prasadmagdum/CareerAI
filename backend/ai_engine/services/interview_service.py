import json
import os

from ollama import chat


OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


def generate_interview_preparation(
    resume_text,
    job_description,
    match_result
):
    """
    Generate personalized interview preparation
    using Ollama.
    """

    resume_skills = match_result.get(
        "resume_skills",
        []
    )

    matched_skills = match_result.get(
        "matched_skills",
        []
    )

    missing_required_skills = match_result.get(
        "missing_required_skills",
        []
    )

    missing_preferred_skills = match_result.get(
        "missing_preferred_skills",
        []
    )

    prompt = f"""
You are an expert technical interviewer and career coach.

Generate personalized interview preparation for the
candidate based on their resume and target job.

IMPORTANT RULES:

1. Use the supplied matching information as authoritative.
2. Do not claim the candidate has skills that are missing.
3. Do not invent projects or work experience.
4. Questions should be relevant to the target job.
5. Questions should also reflect the candidate's actual skills.
6. Include questions about skill gaps.
7. Skill-gap questions should test understanding, not assume experience.
8. Include technical, project, skill-gap, and HR questions.
9. Return ONLY valid JSON.
10. Do not return Markdown.


========================================
CANDIDATE RESUME
========================================

{resume_text}


========================================
JOB DESCRIPTION
========================================

{job_description}


========================================
AUTHORITATIVE MATCHING INFORMATION
========================================

Resume Skills:
{json.dumps(resume_skills, indent=2)}

Matched Skills:
{json.dumps(matched_skills, indent=2)}

Missing Required Skills:
{json.dumps(missing_required_skills, indent=2)}

Missing Preferred Skills:
{json.dumps(missing_preferred_skills, indent=2)}

Overall Match Score:
{match_result.get("overall_score", 0)}


========================================
QUESTION REQUIREMENTS
========================================

Generate:

1. Technical Questions
   - Python
   - Django
   - SQL
   - APIs
   - other relevant matched skills

2. Project Questions
   - Questions based on projects or experience
     actually present in the resume.
   - Do not invent projects.

3. Skill Gap Questions
   - Focus on missing required skills first.
   - Then missing preferred skills.
   - Do not assume the candidate has practical experience
     with these technologies.

4. HR Questions
   - General behavioral questions.
   - Career motivation.
   - Strengths and weaknesses.
   - Job-specific motivation.


========================================
JSON FORMAT
========================================

Return exactly:

{{
    "technical_questions": [
        {{
            "skill": "Python",
            "question": "Question here",
            "difficulty": "easy | medium | hard",
            "why_asked": "Why this question is relevant"
        }}
    ],

    "project_questions": [
        {{
            "question": "Question here",
            "difficulty": "easy | medium | hard",
            "why_asked": "Why this question is relevant"
        }}
    ],

    "skill_gap_questions": [
        {{
            "skill": "Docker",
            "question": "Question here",
            "difficulty": "easy | medium | hard",
            "why_asked": "Why this question is relevant"
        }}
    ],

    "hr_questions": [
        {{
            "question": "Question here",
            "difficulty": "easy | medium | hard",
            "why_asked": "Why this question is relevant"
        }}
    ]
}}
"""

    try:

        response = chat(
            model=OLLAMA_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional technical "
                        "interviewer. Generate realistic "
                        "interview preparation and return "
                        "only valid JSON."
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

    except Exception as exc:

        raise RuntimeError(
            f"Ollama interview request failed: {exc}"
        )

    content = response["message"]["content"]

    if not content:
        raise ValueError(
            "Ollama returned an empty response."
        )

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