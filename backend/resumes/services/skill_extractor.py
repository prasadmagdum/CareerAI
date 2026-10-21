import re


TECHNICAL_SKILLS = {
    "programming": [
        "python",
        "java",
        "c",
        "c++",
        "javascript",
        "typescript",
        "go",
        "rust",
    ],

    "web": [
        "html",
        "css",
        "react",
        "angular",
        "vue",
        "django",
        "flask",
        "fastapi",
        "node.js",
        "express",
    ],

    "database": [
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "redis",
        "sqlite",
        "oracle",
    ],

    "ai_ml": [
        "machine learning",
        "deep learning",
        "artificial intelligence",
        "natural language processing",
        "nlp",
        "computer vision",
        "scikit-learn",
        "tensorflow",
        "pytorch",
        "pandas",
        "numpy",
        "opencv",
    ],

    "cloud_devops": [
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "git",
        "github",
        "jenkins",
    ],

    "apis": [
        "rest api",
        "rest",
        "graphql",
        "api",
        "json",
        "soap",
    ],
}

def extract_skills(text):
    """
    Extract known technical skills from text.
    """

    extracted_skills = []

    for category, skills in TECHNICAL_SKILLS.items():

        for skill in skills:

            if skill_exists(text, skill):

                extracted_skills.append({
                    "name": skill,
                    "category": category,
                    "confidence": 1.0,
                })

    return extracted_skills


def get_all_skills():
    """
    Return all supported technical skills.
    """

    all_skills = []

    for skills in TECHNICAL_SKILLS.values():
        all_skills.extend(skills)

    return all_skills


def skill_exists(text, skill):
    """
    Check whether a skill exists in the text.
    """

    pattern = rf"(?<!\w){re.escape(skill)}(?!\w)"
    return re.search(pattern, text, re.IGNORECASE) is not None