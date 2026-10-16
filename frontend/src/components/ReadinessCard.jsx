import "./ReadinessCard.css";

function ReadinessCard({ analysis, averageScore }) {
    const readiness =
        analysis?.job_readiness || {};

    const readinessScore =
        Number(
            readiness.score ??
            readiness.readiness_score ??
            averageScore
        );

    const status =
        readiness.status ||
        (
            readinessScore >= 80
                ? "Excellent"
                : readinessScore >= 60
                ? "Good"
                : readinessScore >= 40
                ? "Needs Improvement"
                : "Getting Started"
        );

    return (
        <div className="readiness-card">
            <div className="readiness-header">
                <div>
                    <p className="eyebrow">
                        CAREER READINESS
                    </p>

                    <h2>{status}</h2>
                </div>

                <div className="readiness-score">
                    {readinessScore.toFixed(0)}%
                </div>
            </div>

            <div className="readiness-progress">
                <div
                    className="readiness-progress-fill"
                    style={{
                        width: `${Math.min(
                            readinessScore,
                            100
                        )}%`,
                    }}
                />
            </div>

            <p className="readiness-description">
                Your readiness is based on your current
                job compatibility and AI career analysis.
            </p>
        </div>
    );
}

export default ReadinessCard;