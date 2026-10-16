import "./ResumeSkills.css";

function ResumeSkills({ skills = [] }) {

    return (
        <div className="resume-section-card">

            <div className="section-title">

                <div>
                    <p className="eyebrow">
                        TECHNICAL PROFILE
                    </p>

                    <h2>
                        Skills
                    </h2>
                </div>

                <span className="count-badge">
                    {skills.length}
                </span>

            </div>


            {skills.length === 0 ? (

                <div className="section-empty">
                    No skills detected.
                </div>

            ) : (

                <div className="resume-skills-list">

                    {skills.map((skill) => (

                        <div
                            key={skill.id || skill.name}
                            className="resume-skill-item"
                        >

                            <div>

                                <strong>
                                    {skill.name}
                                </strong>

                                {skill.category && (
                                    <span>
                                        {skill.category}
                                    </span>
                                )}

                            </div>


                            <div className="skill-confidence">

                                <div className="confidence-bar">

                                    <div
                                        className="confidence-fill"
                                        style={{
                                            width: `${
                                                Math.min(
                                                    Number(
                                                        skill.confidence ||
                                                        0
                                                    ) * 100,
                                                    100
                                                )
                                            }%`,
                                        }}
                                    />

                                </div>

                                <small>
                                    {(
                                        Number(
                                            skill.confidence ||
                                            0
                                        ) * 100
                                    ).toFixed(0)}
                                    %
                                </small>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default ResumeSkills;