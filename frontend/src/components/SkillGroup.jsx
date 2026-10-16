import "./SkillGroup.css";

function SkillGroup({
    title,
    skills = [],
    type = "default",
}) {

    return (
        <div className="skill-group">

            <div className="skill-group-header">

                <h3>
                    {title}
                </h3>

                <span>
                    {skills.length}
                </span>

            </div>


            {skills.length === 0 ? (

                <p className="skill-group-empty">
                    None
                </p>

            ) : (

                <div className="skill-tags">

                    {skills.map(
                        (skill, index) => (

                            <span
                                key={`${skill}-${index}`}
                                className={
                                    `skill-tag ${type}`
                                }
                            >
                                {skill}
                            </span>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default SkillGroup;