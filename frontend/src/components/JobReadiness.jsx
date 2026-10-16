import "./JobReadiness.css";

function JobReadiness({ readiness = {} }) {
    if (!readiness || typeof readiness !== "object") {
        return null;
    }

    const score = Number(
        readiness.score ??
        readiness.readiness_score ??
        readiness.percentage ??
        0
    );

    const status =
        readiness.status ||
        readiness.level ||
        readiness.label ||
        "Not Available";

    const explanation =
        readiness.explanation ||
        readiness.reason ||
        readiness.message ||
        "";

    return (
        <div className="job-readiness-card">
            <div className="job-readiness-header">
                <div>
                    <span className="section-eyebrow">
                        AI Assessment
                    </span>

                    <h2>🎯 Job Readiness</h2>
                </div>

                <div className="readiness-score">
                    {score.toFixed(0)}%
                </div>
            </div>

            <div className="readiness-progress">
                <div
                    className="readiness-progress-fill"
                    style={{
                        width: `${Math.min(
                            Math.max(score, 0),
                            100
                        )}%`,
                    }}
                />
            </div>

            <div className="readiness-status">
                <strong>{status}</strong>

                {explanation && (
                    <p>{explanation}</p>
                )}
            </div>

            {Object.entries(readiness).length > 0 && (
                <div className="readiness-details">
                    {Object.entries(readiness)
                        .filter(
                            ([key]) =>
                                ![
                                    "score",
                                    "readiness_score",
                                    "percentage",
                                    "status",
                                    "level",
                                    "label",
                                    "explanation",
                                    "reason",
                                    "message",
                                ].includes(key)
                        )
                        .map(([key, value]) => (
                            <div
                                key={key}
                                className="readiness-detail"
                            >
                                <span>
                                    {key
                                        .replaceAll("_", " ")
                                        .replace(
                                            /\b\w/g,
                                            (char) =>
                                                char.toUpperCase()
                                        )}
                                </span>

                                <strong>
                                    {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                </strong>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default JobReadiness;