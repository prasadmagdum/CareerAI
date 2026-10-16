import "./ResumeAnalysisCard.css";

function ResumeAnalysisCard({ analysis }) {

    if (!analysis) {
        return (
            <div className="resume-analysis-card">
                <div className="empty-state">
                    <div className="empty-icon">
                        🤖
                    </div>

                    <h3>
                        No analysis available
                    </h3>

                    <p>
                        Upload a resume to generate
                        your career profile.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="resume-analysis-card">

            <div className="card-header">

                <div>
                    <p className="eyebrow">
                        AI RESUME INTELLIGENCE
                    </p>

                    <h2>
                        Candidate Profile
                    </h2>
                </div>

                <span className="analysis-status">
                    ✓ Analyzed
                </span>

            </div>


            <div className="candidate-info-grid">

                <div className="candidate-info-item">
                    <span>Name</span>
                    <strong>
                        {analysis.candidate_name ||
                            "Not detected"}
                    </strong>
                </div>


                <div className="candidate-info-item">
                    <span>Email</span>
                    <strong>
                        {analysis.email ||
                            "Not detected"}
                    </strong>
                </div>


                <div className="candidate-info-item">
                    <span>Phone</span>
                    <strong>
                        {analysis.phone ||
                            "Not detected"}
                    </strong>
                </div>


                <div className="candidate-info-item">
                    <span>Experience</span>
                    <strong>
                        {analysis.total_experience_years ||
                            0} years
                    </strong>
                </div>

            </div>


            {analysis.summary && (
                <div className="resume-summary">

                    <h3>
                        Professional Summary
                    </h3>

                    <p>
                        {analysis.summary}
                    </p>

                </div>
            )}

        </div>
    );
}

export default ResumeAnalysisCard;