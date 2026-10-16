import "./ScoreBreakdown.css";

function ScoreBreakdown({
    skillScore = 0,
    semanticScore = 0,
    experienceScore = 0,
}) {

    const scores = [
        {
            label: "Skill Match",
            value: skillScore,
            icon: "🧠",
        },
        {
            label: "Semantic Similarity",
            value: semanticScore,
            icon: "🔎",
        },
        {
            label: "Experience Match",
            value: experienceScore,
            icon: "💼",
        },
    ];


    return (
        <div className="score-breakdown">

            {scores.map((score) => {

                const value =
                    Number(score.value || 0);

                return (
                    <div
                        key={score.label}
                        className="score-breakdown-item"
                    >

                        <div className="score-breakdown-header">

                            <span>
                                {score.icon}{" "}
                                {score.label}
                            </span>

                            <strong>
                                {value.toFixed(1)}%
                            </strong>

                        </div>


                        <div className="score-bar">

                            <div
                                className="score-bar-fill"
                                style={{
                                    width: `${Math.min(
                                        value,
                                        100
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>
                );
            })}

        </div>
    );
}

export default ScoreBreakdown;