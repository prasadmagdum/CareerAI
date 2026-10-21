from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def normalize_skill(skill):
    """
    Normalize skill names so comparisons are consistent.
    """
    return skill.strip().lower()


def get_resume_skills(resume):
    """
    Get all skills from the resume.
    """
    return {
        normalize_skill(skill.name)
        for skill in resume.skills.all()
    }


def get_job_required_skills(job):
    """
    Get required skills from the job.
    """

    required_skills = set()
    preferred_skills = set()

    for skill in job.skills.all():
        skill_name = normalize_skill(skill.name)
        importance = (skill.importance or "required").strip().lower()

        if importance == "preferred":
            preferred_skills.add(skill_name)
        else:
            required_skills.add(skill_name)

    return required_skills, preferred_skills


def calculate_skill_match(resume, job):
    """
    Compare resume skills against job skills.

    Separates:
        Required skills
        Preferred skills
    """

    resume_skills = get_resume_skills(resume)

    required_skills, preferred_skills = (
        get_job_required_skills(job)
    )

    all_job_skills = (
        required_skills | preferred_skills
    )

    # No skills in job
    if not all_job_skills:
        return {
            "score": 0.0,
            "matched_skills": [],
            "missing_skills": [],
            "extra_skills": [],

            "matched_required_skills": [],
            "missing_required_skills": [],

            "matched_preferred_skills": [],
            "missing_preferred_skills": [],
        }

    # --------------------------------------------------
    # Required Skills
    # --------------------------------------------------

    matched_required_skills = sorted(
        resume_skills.intersection(
            required_skills
        )
    )

    missing_required_skills = sorted(
        required_skills.difference(
            resume_skills
        )
    )

    # --------------------------------------------------
    # Preferred Skills
    # --------------------------------------------------

    matched_preferred_skills = sorted(
        resume_skills.intersection(
            preferred_skills
        )
    )

    missing_preferred_skills = sorted(
        preferred_skills.difference(
            resume_skills
        )
    )

    # --------------------------------------------------
    # All Skills
    # --------------------------------------------------

    matched_skills = sorted(
        resume_skills.intersection(
            all_job_skills
        )
    )

    missing_skills = sorted(
        all_job_skills.difference(
            resume_skills
        )
    )

    extra_skills = sorted(
        resume_skills.difference(
            all_job_skills
        )
    )

    # --------------------------------------------------
    # Overall Skill Score
    # --------------------------------------------------

    score = (
        len(matched_skills) /
        len(all_job_skills)
    ) * 100

    return {
        "score": float(
            round(score, 2)
        ),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "extra_skills": extra_skills,

        "matched_required_skills":
            matched_required_skills,

        "missing_required_skills":
            missing_required_skills,

        "matched_preferred_skills":
            matched_preferred_skills,

        "missing_preferred_skills":
            missing_preferred_skills,
    }


def calculate_tfidf_similarity(
    resume_text,
    job_text
):
    """
    Calculate semantic similarity between
    resume and job description using TF-IDF.
    """

    if not resume_text or not job_text:
        return 0.0

    documents = [
        resume_text,
        job_text,
    ]

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    try:
        tfidf_matrix = vectorizer.fit_transform(
            documents
        )
    except ValueError:
        return 0.0

    similarity_matrix = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )

    similarity = similarity_matrix[0][0]

    return float(
        round(
            similarity * 100,
            2
        )
    )


def calculate_experience_score(
    resume,
    job
):
    """
    Calculate experience compatibility score.
    """

    resume_experience = 0

    if (
        hasattr(resume, "analysis")
        and resume.analysis
    ):
        resume_experience = (
            resume.analysis.total_experience_years
            or 0
        )

    required_experience = (
        job.required_experience_years
        or 0
    )

    # Job does not require experience
    if required_experience == 0:
        return 100.0

    # Candidate meets requirement
    if resume_experience >= required_experience:
        return 100.0

    score = (
        float(resume_experience)
        / float(required_experience)
    ) * 100

    return float(
        round(
            min(score, 100),
            2
        )
    )


def calculate_education_score(
    resume,
    job
):
    """
    Calculate education compatibility.

    Education matching will be implemented
    when education requirements are available
    in the Job model.

    Currently returns a neutral score.
    """

    return 100.0


def calculate_overall_score(
    skill_score,
    semantic_score,
    experience_score,
    education_score
):
    """
    Calculate weighted overall matching score.

    Skill Match       = 40%
    Semantic Match    = 30%
    Experience Match  = 20%
    Education Match   = 10%
    """

    overall_score = (
        float(skill_score) * 0.40
        + float(semantic_score) * 0.30
        + float(experience_score) * 0.20
        + float(education_score) * 0.10
    )

    return float(
        round(
            overall_score,
            2
        )
    )


def match_resume_with_job(
    resume,
    job
):
    """
    Perform complete resume-job matching.
    """

    # --------------------------------------------------
    # 1. Skill Matching
    # --------------------------------------------------

    skill_result = calculate_skill_match(
        resume,
        job
    )

    # --------------------------------------------------
    # 2. TF-IDF Semantic Similarity
    # --------------------------------------------------

    semantic_score = calculate_tfidf_similarity(
        resume.extracted_text,
        job.extracted_text
    )

    # --------------------------------------------------
    # 3. Experience Matching
    # --------------------------------------------------

    experience_score = calculate_experience_score(
        resume,
        job
    )

    # --------------------------------------------------
    # 4. Education Matching
    # --------------------------------------------------

    education_score = calculate_education_score(
        resume,
        job
    )

    # --------------------------------------------------
    # 5. Overall Score
    # --------------------------------------------------

    overall_score = calculate_overall_score(
        skill_result["score"],
        semantic_score,
        experience_score,
        education_score
    )

    # --------------------------------------------------
    # 6. Final Result
    # --------------------------------------------------

    return {
        "skill_match_score":
            skill_result["score"],

        "semantic_similarity_score":
            semantic_score,

        "experience_match_score":
            experience_score,

        "education_match_score":
            education_score,

        "overall_score":
            overall_score,

        "matched_skills":
            skill_result["matched_skills"],

        "missing_skills":
            skill_result["missing_skills"],

        "extra_skills":
            skill_result["extra_skills"],

        "matched_required_skills":
            skill_result[
                "matched_required_skills"
            ],

        "missing_required_skills":
            skill_result[
                "missing_required_skills"
            ],

        "matched_preferred_skills":
            skill_result[
                "matched_preferred_skills"
            ],

        "missing_preferred_skills":
            skill_result[
                "missing_preferred_skills"
            ],
    }
