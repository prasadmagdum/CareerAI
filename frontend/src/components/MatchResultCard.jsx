import ScoreBreakdown from "./ScoreBreakdown";
import SkillGroup from "./SkillGroup";
import "./MatchResultCard.css";


function MatchResultCard({ match }) {

    if (!match) {
        return null;
    }


    const overallScore =
        Number(
            match.overall_score || 0
        );


    const jobTitle =
        match.job?.title ||
        match.job_title ||
        "Job Opportunity";


    const company =
        match.job?.company ||
        match.company ||
        "Company";


    const resumeTitle =
        match.resume?.title ||
        match.resume_title ||
        "Resume";


    return (
        <div className="match-result-card">

            {/* HEADER */}

            <div className="match-result-header">

                <div>

                    <p className="eyebrow">
                        MATCH ANALYSIS
                    </p>

                    <h2>
                        {jobTitle}
                    </h2>

                    <p>
                        {company}
                    </p>

                </div>


                <div className="overall-score">

                    <strong>
                        {overallScore.toFixed(1)}%
                    </strong>

                    <span>
                        Overall Match
                    </span>

                </div>

            </div>


            {/* RESUME */}

            <div className="match-resume-label">

                Resume:

                <strong>
                    {resumeTitle}
                </strong>

            </div>


            {/* SCORE BREAKDOWN */}

            <ScoreBreakdown
                skillScore={
                    match.skill_match_score
                }
                semanticScore={
                    match.semantic_similarity_score
                }
                experienceScore={
                    match.experience_match_score
                }
            />


            {/* SKILLS */}

            <div className="skill-groups">

                <SkillGroup
                    title="Matched Skills"
                    skills={
                        match.matched_skills ||
                        []
                    }
                    type="matched"
                />


                <SkillGroup
                    title="Missing Skills"
                    skills={
                        match.missing_skills ||
                        []
                    }
                    type="missing"
                />


                <SkillGroup
                    title="Required Skills"
                    skills={
                        match.matched_required_skills ||
                        []
                    }
                    type="required"
                />


                <SkillGroup
                    title="Preferred Skills"
                    skills={
                        match.matched_preferred_skills ||
                        []
                    }
                    type="preferred"
                />

            </div>


            {/* REQUIRED GAPS */}

            {(match.missing_required_skills?.length >
                0) && (

                <div className="critical-gap-box">
                    <div>

                        <h3>
                            Critical Skill Gaps
                        </h3>

                        <p>
                            These required skills
                            are currently missing
                            from your resume.
                        </p>

                        <div className="skill-tags">

                            {match.missing_required_skills.map(
                                (skill, index) => (

                                    <span
                                        key={`${skill}-${index}`}
                                        className="skill-tag missing"
                                    >
                                        {skill}
                                    </span>

                                )
                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default MatchResultCard;