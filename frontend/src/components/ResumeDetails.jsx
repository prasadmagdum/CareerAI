import "./ResumeDetails.css";

function ResumeDetails({
    education = [],
    experience = [],
    projects = [],
    certifications = [],
}) {

    return (
        <div className="resume-details-grid">

            {/* EDUCATION */}

            <div className="resume-section-card">

                <p className="eyebrow">
                    EDUCATION
                </p>

                <h2>
                    Education
                </h2>

                {education.length === 0 ? (

                    <p className="section-empty">
                        No education information detected.
                    </p>

                ) : (

                    education.map((item, index) => (

                        <div
                            key={index}
                            className="timeline-item"
                        >

                            <div className="timeline-dot">
                                🎓
                            </div>

                            <div>

                                <h3>
                                    {item.degree ||
                                        item.title ||
                                        "Education"}
                                </h3>

                                <p>
                                    {item.institution ||
                                        item.college ||
                                        ""}
                                </p>

                                {item.year && (
                                    <small>
                                        {item.year}
                                    </small>
                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>


            {/* EXPERIENCE */}

            <div className="resume-section-card">

                <p className="eyebrow">
                    EXPERIENCE
                </p>

                <h2>
                    Experience
                </h2>

                {experience.length === 0 ? (

                    <p className="section-empty">
                        No experience information detected.
                    </p>

                ) : (

                    experience.map((item, index) => (

                        <div
                            key={index}
                            className="timeline-item"
                        >

                            <div className="timeline-dot">
                                💼
                            </div>

                            <div>

                                <h3>
                                    {item.role ||
                                        item.position ||
                                        "Experience"}
                                </h3>

                                <p>
                                    {item.company || ""}
                                </p>

                                {item.duration && (
                                    <small>
                                        {item.duration}
                                    </small>
                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>


            {/* PROJECTS */}

            <div className="resume-section-card">

                <p className="eyebrow">
                    PROJECT PORTFOLIO
                </p>

                <h2>
                    Projects
                </h2>

                {projects.length === 0 ? (

                    <p className="section-empty">
                        No projects detected.
                    </p>

                ) : (

                    projects.map((project, index) => (

                        <div
                            key={index}
                            className="project-item"
                        >

                            <h3>
                                {project.name ||
                                    project.title ||
                                    "Project"}
                            </h3>

                            <p>
                                {project.description ||
                                    ""}
                            </p>

                        </div>

                    ))

                )}

            </div>


            {/* CERTIFICATIONS */}

            <div className="resume-section-card">

                <p className="eyebrow">
                    CERTIFICATIONS
                </p>

                <h2>
                    Certifications
                </h2>

                {certifications.length === 0 ? (

                    <p className="section-empty">
                        No certifications detected.
                    </p>

                ) : (

                    certifications.map(
                        (certificate, index) => (

                            <div
                                key={index}
                                className="certificate-item"
                            >

                                🏆{" "}

                                {certificate.name ||
                                    certificate.title ||
                                    certificate}

                            </div>

                        )
                    )

                )}

            </div>

        </div>
    );
}

export default ResumeDetails;