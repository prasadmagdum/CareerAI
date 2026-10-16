import re

from .skill_extractor import extract_skills


def extract_email(text):
    """
    Extract the first email address found in the text.
    """

    pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return ""


def extract_phone(text):
    """
    Extract a likely phone number from resume text.
    """

    pattern = r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return ""

def extract_candidate_name(text):
    """
    Attempt to identify the candidate's name.
    """

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return ""

    ignored_words = {
        "resume",
        "curriculum vitae",
        "cv",
        "profile",
        "objective",
        "summary",
    }

    for line in lines[:10]:

        if len(line) > 60:
            continue

        if "@" in line:
            continue

        if any(char.isdigit() for char in line):
            continue

        if line.lower() in ignored_words:
            continue

        words = line.split()

        if 2 <= len(words) <= 5:

            if all(
                word.replace("-", "").replace("'", "").isalpha()
                for word in words
            ):
                return line

    return ""


def extract_education(text):
    """
    Extract education-related lines from the resume.
    """

    education_keywords = [
        "education",
        "b.tech",
        "b.e",
        "bachelor",
        "master",
        "m.tech",
        "mca",
        "bca",
        "mba",
        "b.sc",
        "m.sc",
        "hsc",
        "ssc",
        "12th",
        "10th",
        "degree",
    ]

    results = []

    for line in text.splitlines():

        clean_line = line.strip()

        if not clean_line:
            continue

        line_lower = clean_line.lower()

        if any(
            keyword in line_lower
            for keyword in education_keywords
        ):
            results.append(clean_line)

    return results[:20]


def extract_experience(text):
    """
    Extract lines that appear to describe work experience.
    """

    experience_keywords = [
        "experience",
        "intern",
        "internship",
        "developer",
        "engineer",
        "software developer",
        "software engineer",
        "work history",
        "employment",
    ]

    results = []

    for line in text.splitlines():

        clean_line = line.strip()

        if not clean_line:
            continue

        line_lower = clean_line.lower()

        if any(
            keyword in line_lower
            for keyword in experience_keywords
        ):
            results.append(clean_line)

    return results[:30]


def extract_projects(text):
    """
    Extract lines related to projects.
    """

    project_keywords = [
        "project",
        "developed",
        "built",
        "created",
        "implemented",
        "application",
        "system",
    ]

    results = []

    for line in text.splitlines():

        clean_line = line.strip()

        if not clean_line:
            continue

        line_lower = clean_line.lower()

        if any(
            keyword in line_lower
            for keyword in project_keywords
        ):
            results.append(clean_line)

    return results[:30]


def extract_certifications(text):
    """
    Extract certification-related lines.
    """

    certification_keywords = [
        "certification",
        "certified",
        "certificate",
        "aws certified",
        "microsoft certified",
        "google certified",
    ]

    results = []

    for line in text.splitlines():

        clean_line = line.strip()

        if not clean_line:
            continue

        line_lower = clean_line.lower()

        if any(
            keyword in line_lower
            for keyword in certification_keywords
        ):
            results.append(clean_line)

    return results[:20]


def analyze_resume(text):
    """
    Run all resume extraction operations.
    """

    skills = extract_skills(text)

    analysis = {
        "candidate_name": extract_candidate_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "summary": "",
        "total_experience_years": 0,
        "education": extract_education(text),
        "experience": extract_experience(text),
        "projects": extract_projects(text),
        "certifications": extract_certifications(text),
        "skills": skills,
    }

    return analysis