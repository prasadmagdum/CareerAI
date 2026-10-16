import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import MatchResultCard from "../components/MatchResultCard";
import "./Jobs.css";

import {
    getMyJobs,
    createJob,
    matchResumeWithJob,
    getMyMatches,
} from "../services/jobService";

import { getMyResumes } from "../services/resumeService";

function Jobs() {

    const [jobs, setJobs] = useState([]);

    const [resumes, setResumes] =
        useState([]);

    const [matches, setMatches] =
        useState([]);

    const [selectedResume, setSelectedResume] =
        useState("");

    const [selectedJob, setSelectedJob] =
        useState("");

    const [title, setTitle] =
        useState("");

    const [company, setCompany] =
        useState("");

    const [location, setLocation] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [experience, setExperience] =
        useState("0");


    const [loading, setLoading] =
        useState(true);

    const [matching, setMatching] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [latestMatch, setLatestMatch] =
        useState(null);


    useEffect(() => {
        loadData();
    }, []);


    async function loadData() {

        try {

            setLoading(true);
            setError("");

            const [
                jobsResponse,
                resumesResponse,
                matchesResponse,
            ] = await Promise.all([
                getMyJobs(),
                getMyResumes(),
                getMyMatches(),
            ]);


            const jobsData =
                jobsResponse?.results ||
                jobsResponse?.data ||
                jobsResponse ||
                [];


            const resumesData =
                resumesResponse?.results ||
                resumesResponse?.data ||
                resumesResponse ||
                [];


            const matchesData =
                matchesResponse?.results ||
                matchesResponse?.data ||
                matchesResponse ||
                [];


            setJobs(jobsData);
            setResumes(resumesData);
            setMatches(matchesData);


            if (resumesData.length > 0) {
                setSelectedResume(
                    resumesData[0].id
                );
            }

            if (jobsData.length > 0) {
                setSelectedJob(
                    jobsData[0].id
                );
            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load jobs and resumes."
            );

        } finally {

            setLoading(false);

        }
    }


    async function handleCreateJob(event) {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            !title.trim() ||
            !description.trim()
        ) {

            setError(
                "Job title and description are required."
            );

            return;
        }


        try {

            setCreating(true);


            const response =
                await createJob({
                    title,
                    company,
                    location,
                    description,
                    required_experience_years:
                        Number(experience),
                });


            const newJob =
                response?.data ||
                response;


            setJobs((previous) => [
                newJob,
                ...previous,
            ]);


            setSelectedJob(
                newJob.id
            );


            setTitle("");
            setCompany("");
            setLocation("");
            setDescription("");
            setExperience("0");


            setSuccess(
                "Job created successfully."
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to create the job."
            );

        } finally {

            setCreating(false);

        }
    }


    async function handleMatch() {

        setError("");
        setSuccess("");


        if (!selectedResume) {

            setError(
                "Please select a resume."
            );

            return;
        }


        if (!selectedJob) {

            setError(
                "Please select a job."
            );

            return;
        }


        try {

            setMatching(true);


            const response =
                await matchResumeWithJob(
                    selectedResume,
                    selectedJob
                );


            const match =
                response?.data ||
                response;


            setLatestMatch(match);


            setMatches((previous) => [
                match,
                ...previous.filter(
                    (item) =>
                        item.id !== match.id
                ),
            ]);


            setSuccess(
                "Resume matched successfully."
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to match resume with job."
            );

        } finally {

            setMatching(false);

        }
    }


    if (loading) {

        return (
            <Layout>

                <LoadingState
                    message="Loading job matching..."
                />

            </Layout>
        );
    }


    if (error && jobs.length === 0 &&
        resumes.length === 0) {

        return (
            <Layout>

                <ErrorState
                    message={error}
                />

            </Layout>
        );
    }


    return (
        <Layout>

            <div className="jobs-page">

                {/* HEADER */}

                <header className="jobs-header">
                    <div>
                        <h1 className="jobs-title">Job Matches</h1>
                        <p className="jobs-subtitle">
                            Discover opportunities that match your skills and experience.
                        </p>
                    </div>
                </header>



                {/* ALERTS */}

                {error && (
                    <div className="form-error">
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div className="form-success">
                        ✓ {success}
                    </div>
                )}


                {/* CREATE JOB */}

                <div className="job-create-card">

                    <div className="card-header">

                        <div>

                            <p className="eyebrow">
                                JOB DESCRIPTION
                            </p>

                            <h2>
                                Add Job Opportunity
                            </h2>

                        </div>

                        <span className="upload-icon">
                            💼
                        </span>

                    </div>


                    <form
                        onSubmit={
                            handleCreateJob
                        }
                        className="job-form"
                    >

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Job Title
                                </label>

                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Python Developer"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Company
                                </label>

                                <input
                                    value={company}
                                    onChange={(e) =>
                                        setCompany(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Company Name"
                                />

                            </div>

                        </div>


                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Pune / Remote"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Required Experience
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={experience}
                                    onChange={(e) =>
                                        setExperience(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Job Description
                            </label>

                            <textarea
                                rows="8"
                                value={description}
                                onChange={(e) =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter the complete job description, required skills, responsibilities and qualifications..."
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={creating}
                        >
                            {creating
                                ? "Creating..."
                                : "Create Job"}
                        </button>

                    </form>

                </div>


                {/* MATCH CONTROLS */}

                <div className="match-control-card">

                    <div className="card-header">

                        <div>

                            <p className="eyebrow">
                                MATCH ENGINE
                            </p>

                            <h2>
                                Analyze Compatibility
                            </h2>

                        </div>

                        <span className="upload-icon">
                            🎯
                        </span>

                    </div>


                    <div className="match-controls">

                        <div className="form-group">

                            <label>
                                Select Resume
                            </label>

                            <select
                                value={
                                    selectedResume
                                }
                                onChange={(e) =>
                                    setSelectedResume(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Resume
                                </option>

                                {resumes.map(
                                    (resume) => (

                                        <option
                                            key={resume.id}
                                            value={resume.id}
                                        >
                                            {resume.title}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Select Job
                            </label>

                            <select
                                value={
                                    selectedJob
                                }
                                onChange={(e) =>
                                    setSelectedJob(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Job
                                </option>

                                {jobs.map(
                                    (job) => (

                                        <option
                                            key={job.id}
                                            value={job.id}
                                        >
                                            {job.title}
                                            {job.company
                                                ? ` — ${job.company}`
                                                : ""}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <button
                            type="button"
                            className="btn btn-primary match-button"
                            onClick={handleMatch}
                            disabled={
                                matching ||
                                !selectedResume ||
                                !selectedJob
                            }
                        >
                            {matching
                                ? "Analyzing..."
                                : "🚀 Match Resume"}
                        </button>

                    </div>

                </div>


                {/* RESULT */}

                {latestMatch && (

                    <MatchResultCard
                        match={latestMatch}
                    />

                )}


                {/* HISTORY */}

                <div className="matches-history-card">

                    <div className="card-header">

                        <div>

                            <p className="eyebrow">
                                HISTORY
                            </p>

                            <h2>
                                Previous Matches
                            </h2>

                        </div>

                        <span className="count-badge">
                            {matches.length}
                        </span>

                    </div>


                    {matches.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                🎯
                            </div>

                            <h3>
                                No matches yet
                            </h3>

                            <p>
                                Match your resume with
                                a job to see your
                                compatibility.
                            </p>

                        </div>

                    ) : (

                        <div className="match-history-list">

                            {matches
                                .slice(0, 10)
                                .map((match) => (

                                    <button
                                        key={match.id}
                                        className="match-history-item"
                                        onClick={() =>
                                            setLatestMatch(
                                                match
                                            )
                                        }
                                    >

                                        <div>

                                            <strong>
                                                {
                                                    match.job
                                                        ?.title ||
                                                    match.job_title ||
                                                    "Job"
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    match.job
                                                        ?.company ||
                                                    match.company ||
                                                    "Company"
                                                }
                                            </span>

                                        </div>


                                        <strong>
                                            {Number(
                                                match.overall_score ||
                                                0
                                            ).toFixed(1)}
                                            %
                                        </strong>

                                    </button>

                                ))}

                        </div>

                    )}

                </div>

            </div>

        </Layout>
    );
}


export default Jobs;