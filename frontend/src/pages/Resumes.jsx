import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import Layout from "../components/Layout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import ResumeAnalysisCard from "../components/ResumeAnalysisCard";
import ResumeSkills from "../components/ResumeSkills";
import ResumeDetails from "../components/ResumeDetails";
import ResumeBuilder from "../components/ResumeBuilder";

import {
    getMyResumes,
    uploadResume,
} from "../services/resumeService";

import "./Resumes.css";


function Resumes() {

    const [resumes, setResumes] = useState([]);

    const [selectedResume, setSelectedResume] =
        useState(null);

    const [title, setTitle] = useState("");

    const [file, setFile] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [uploading, setUploading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [showBuilder, setShowBuilder] =
        useState(false);


    useEffect(() => {
        loadResumes();
    }, []);


    async function loadResumes() {

        try {

            setLoading(true);
            setError("");

            const response =
                await getMyResumes();

            const data =
                response?.results ||
                response?.data ||
                response ||
                [];

            setResumes(data);

            if (data.length > 0) {
                setSelectedResume(data[0]);
            }

        } catch (error) {

            console.error(
                "Resume loading error:",
                error
            );

            setError(
                "Unable to load your resumes."
            );

        } finally {

            setLoading(false);

        }
    }


    async function handleUpload(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!title.trim()) {

            setError(
                "Please enter a resume title."
            );

            return;
        }


        if (!file) {

            setError(
                "Please select a PDF file."
            );

            return;
        }


        if (
            !file.name
                .toLowerCase()
                .endsWith(".pdf")
        ) {

            setError(
                "Only PDF files are allowed."
            );

            return;
        }


        try {

            setUploading(true);

            const response =
                await uploadResume(
                    title,
                    file
                );


            const uploadedResume =
                response?.data?.resume ||
                response?.resume ||
                null;


            setSuccess(
                "Resume uploaded and analyzed successfully."
            );


            setTitle("");
            setFile(null);


            if (uploadedResume) {

                setSelectedResume(
                    uploadedResume
                );

            }


            await loadResumes();

        } catch (error) {

            console.error(
                "Resume upload error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Resume upload failed."
            );

        } finally {

            setUploading(false);

        }
    }


    if (loading) {

        return (
            <Layout>
                <LoadingState
                    message="Loading your resumes..."
                />
            </Layout>
        );
    }


    if (error && resumes.length === 0) {

        return (
            <Layout>
                <ErrorState
                    message={error}
                />
            </Layout>
        );
    }


    const analysis =
        selectedResume?.analysis ||
        selectedResume?.resume_analysis ||
        null;


    const skills =
        selectedResume?.skills ||
        analysis?.skills ||
        [];


    return (
        <Layout>

            <div className="resumes-page">
                <header className="resumes-header">
                    <div>
                        <h1 className="resumes-title">My Resumes</h1>
                        <p className="resumes-subtitle">
                            Manage your resumes and prepare for your next opportunity.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary resumes-create-button"
                        aria-expanded={showBuilder}
                        aria-controls="resume-builder"
                        onClick={() => setShowBuilder((visible) => !visible)}
                    >
                        {showBuilder ? <X size={16} /> : <Plus size={16} />}
                        {showBuilder ? "Close builder" : "Create a resume"}
                    </button>
                </header>

                {showBuilder && (
                    <ResumeBuilder
                        id="resume-builder"
                        onClose={() => setShowBuilder(false)}
                    />
                )}

                {/* UPLOAD */}

                <div className="upload-card">

                    <div className="upload-header">

                        <div>

                            <p className="eyebrow">
                                NEW RESUME
                            </p>

                            <h2>
                                Upload Resume
                            </h2>

                        </div>

                    </div>


                    <form
                        onSubmit={handleUpload}
                        className="resume-upload-form"
                    >

                        <div className="form-group">

                            <label>
                                Resume Title
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Software Developer Resume"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                PDF File
                            </label>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) =>
                                    setFile(
                                        e.target.files?.[0] ||
                                        null
                                    )
                                }
                            />

                        </div>


                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}


                        {success && (
                            <div className="form-success">
                                ✓ {success}
                            </div>
                        )}


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={uploading}
                        >
                            {uploading
                                ? "Analyzing Resume..."
                                : "Upload & Analyze"}
                        </button>

                    </form>

                </div>


                {/* RESUME LIST */}

                <div className="resume-list-card">

                    <div className="card-header">

                        <div>

                            <p className="eyebrow">
                                YOUR DOCUMENTS
                            </p>

                            <h2>
                                Uploaded Resumes
                            </h2>

                        </div>

                        <span className="count-badge">
                            {resumes.length}
                        </span>

                    </div>


                    {resumes.length === 0 ? (

                        <div className="empty-state">

                            <h3>
                                No resumes uploaded
                            </h3>

                            <p>
                                Upload your first resume
                                to start your CareerAI
                                analysis.
                            </p>

                        </div>

                    ) : (

                        <div className="resume-list">

                            {resumes.map((resume) => (

                                <button
                                    key={resume.id}
                                    className={
                                        `resume-list-item ${
                                            selectedResume?.id ===
                                            resume.id
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        setSelectedResume(
                                            resume
                                        )
                                    }
                                >

                                    <div>

                                        <strong>
                                            {resume.title}
                                        </strong>

                                        <span>
                                            Uploaded{" "}
                                            {new Date(
                                                resume.uploaded_at
                                            ).toLocaleDateString()}
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </div>


                {/* ANALYSIS */}

                {selectedResume && (

                    <>

                        <div className="resume-analysis-heading">
                            <p className="eyebrow">SELECTED RESUME</p>
                            <h2>{selectedResume.title}</h2>
                        </div>

                        <ResumeAnalysisCard
                            analysis={analysis}
                        />


                        <ResumeSkills
                            skills={skills}
                        />


                        <ResumeDetails
                            education={
                                analysis?.education ||
                                []
                            }
                            experience={
                                analysis?.experience ||
                                []
                            }
                            projects={
                                analysis?.projects ||
                                []
                            }
                            certifications={
                                analysis?.certifications ||
                                []
                            }
                        />

                    </>
                )}

            </div>

        </Layout>
    );
}


export default Resumes;