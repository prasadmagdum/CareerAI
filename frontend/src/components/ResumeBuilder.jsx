import { useState } from "react";
import { Download, FileText, Sparkles } from "lucide-react";

import "./ResumeBuilder.css";

const templates = [
    {
        id: "professional",
        name: "Professional",
        description: "A clear, classic layout that works well across industries.",
        suggestion: "Recommended for most roles",
    },
    {
        id: "modern",
        name: "Modern",
        description: "A confident style for technology, product, and creative roles.",
        suggestion: "Great for experienced professionals",
    },
    {
        id: "early-career",
        name: "Early career",
        description: "Puts skills, education, and projects up front.",
        suggestion: "Ideal for students and career changers",
    },
];

const initialResume = {
    fullName: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
};

const resumeSections = [
    {
        id: "summary",
        label: "Professional summary",
        placeholder: "Write 2–3 sentences about your experience, strengths, and career goals.",
        rows: 3,
    },
    {
        id: "experience",
        label: "Work experience",
        placeholder: "Role | Company | Dates\nAdd achievements and impact, one per line.",
        rows: 5,
    },
    {
        id: "education",
        label: "Education",
        placeholder: "Degree | School | Graduation year",
        rows: 3,
    },
    {
        id: "skills",
        label: "Skills",
        placeholder: "Separate skills with commas, for example: React, Python, Communication",
        rows: 2,
    },
    {
        id: "projects",
        label: "Projects and achievements",
        placeholder: "Project or achievement | Add a short description on each line.",
        rows: 3,
    },
];

function ResumeBuilder({ id, onClose }) {
    const [template, setTemplate] = useState("professional");
    const [resume, setResume] = useState(initialResume);
    const [error, setError] = useState("");

    function updateResume(event) {
        const { name, value } = event.target;
        setResume((current) => ({ ...current, [name]: value }));
    }

    function printResume() {
        if (!resume.fullName.trim()) {
            setError("Add your name before printing your resume.");
            return;
        }

        setError("");
        window.print();
    }

    const skills = resume.skills
        .split(/[,\n]/)
        .map((skill) => skill.trim())
        .filter(Boolean);

    return (
        <section className="resume-builder-card" id={id} aria-labelledby="resume-builder-title">
            <div className="resume-builder-heading">
                <div>
                    <p className="eyebrow">RESUME STUDIO</p>
                    <h2 id="resume-builder-title">Create a resume from a template</h2>
                    <p>Choose a starting point, add your details, then print or save it as a PDF.</p>
                </div>
                <Sparkles className="resume-builder-sparkle" size={23} aria-hidden="true" />
            </div>

            <div className="resume-template-list" aria-label="Resume templates">
                {templates.map((item) => (
                    <button
                        type="button"
                        key={item.id}
                        className={`resume-template-option ${template === item.id ? "selected" : ""}`}
                        aria-pressed={template === item.id}
                        onClick={() => setTemplate(item.id)}
                    >
                        <span className={`resume-template-swatch ${item.id}`} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </span>
                        <span className="resume-template-copy">
                            <strong>{item.name}</strong>
                            <span>{item.description}</span>
                            <small>{item.suggestion}</small>
                        </span>
                    </button>
                ))}
            </div>

            <div className="resume-builder-workspace">
                <form
                    className="resume-builder-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        printResume();
                    }}
                >
                    <div className="resume-builder-form-heading">
                        <div>
                            <h3>Your details</h3>
                            <p>Use concise, specific details that match the roles you want.</p>
                        </div>
                    </div>

                    <div className="resume-builder-fields">
                        <label>
                            Full name <span aria-hidden="true">*</span>
                            <input
                                name="fullName"
                                autoComplete="name"
                                placeholder="e.g. Jordan Lee"
                                value={resume.fullName}
                                onChange={updateResume}
                            />
                        </label>
                        <label>
                            Target role
                            <input
                                name="role"
                                placeholder="e.g. Product Designer"
                                value={resume.role}
                                onChange={updateResume}
                            />
                        </label>
                        <label>
                            Email
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={resume.email}
                                onChange={updateResume}
                            />
                        </label>
                        <label>
                            Phone
                            <input
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                placeholder="+1 555 010 1234"
                                value={resume.phone}
                                onChange={updateResume}
                            />
                        </label>
                        <label className="resume-builder-wide-field">
                            Location or LinkedIn
                            <input
                                name="location"
                                placeholder="e.g. Austin, TX · linkedin.com/in/you"
                                value={resume.location}
                                onChange={updateResume}
                            />
                        </label>
                        {resumeSections.map(({ id: field, label, placeholder, rows }) => (
                            <label className="resume-builder-wide-field" key={field}>
                                {label}
                                <textarea
                                    name={field}
                                    rows={rows}
                                    placeholder={placeholder}
                                    value={resume[field]}
                                    onChange={updateResume}
                                />
                            </label>
                        ))}
                    </div>

                    {error && <p className="resume-builder-error" role="alert">{error}</p>}

                    <div className="resume-builder-actions">
                        <button type="submit" className="btn btn-primary">
                            <Download size={16} />
                            Print / Save as PDF
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Done
                        </button>
                    </div>
                    <p className="resume-builder-note">
                        To add this resume to your library and run CareerAI analysis, save it as a PDF and upload it above.
                    </p>
                </form>

                <article className={`resume-builder-preview template-${template} resume-builder-print-preview`}>
                    <header className="resume-preview-header">
                        <p className="resume-preview-name">{resume.fullName || "Your Name"}</p>
                        <p className="resume-preview-role">{resume.role || "Your target role"}</p>
                        <div className="resume-preview-contact">
                            {[resume.email, resume.phone, resume.location].filter(Boolean).join("  ·  ")
                                || "Email · Phone · Location"}
                        </div>
                    </header>

                    {resume.summary && (
                        <section className="resume-preview-section">
                            <h4>Profile</h4>
                            <p>{resume.summary}</p>
                        </section>
                    )}

                    {resume.experience && (
                        <section className="resume-preview-section">
                            <h4>Experience</h4>
                            <p>{resume.experience}</p>
                        </section>
                    )}

                    {resume.projects && (
                        <section className="resume-preview-section">
                            <h4>Projects &amp; achievements</h4>
                            <p>{resume.projects}</p>
                        </section>
                    )}

                    {resume.education && (
                        <section className="resume-preview-section">
                            <h4>Education</h4>
                            <p>{resume.education}</p>
                        </section>
                    )}

                    {skills.length > 0 && (
                        <section className="resume-preview-section">
                            <h4>Skills</h4>
                            <p>{skills.join("  ·  ")}</p>
                        </section>
                    )}

                    {!resume.summary && !resume.experience && !resume.education && !resume.skills && !resume.projects && (
                        <div className="resume-preview-empty">
                            <FileText size={22} aria-hidden="true" />
                            <p>Your resume preview will update as you add details.</p>
                        </div>
                    )}
                </article>
            </div>
        </section>
    );
}

export default ResumeBuilder;
