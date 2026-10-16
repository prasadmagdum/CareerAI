import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import MatchMiniCard from "../components/MatchMiniCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import Footer from "../components/Footer";

import heroArtwork from "../assets/hero.png";
import { getDashboardData } from "../services/dashboardService";

import "./Dashboard.css";
function Dashboard() {

    const [dashboard, setDashboard] = useState({
        resumes: [],
        matches: [],
        analyses: [],
        interviews: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    async function loadDashboard() {

        try {
            const data =
                await getDashboardData();

            setDashboard(data);

        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

            setError(
                "Unable to load your dashboard. Please check that the backend server is running."
            );

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    const {
        resumes,
        matches,
        analyses,
        interviews,
    } = dashboard;


    const averageMatch =
        matches.length > 0
            ? matches.reduce(
                  (total, match) =>
                      total +
                      Number(
                          match.overall_score || 0
                      ),
                  0
              ) / matches.length
            : 0;


    const latestAnalysis =
        analyses.length > 0
            ? analyses[0]
            : null;


    const latestMatch =
        matches[0] || null;


    if (loading) {

        return (
            <Layout footer={<Footer />}>
                <LoadingState
                    message="Loading your CareerAI dashboard..."
                />
            </Layout>
        );
    }


    if (error) {

        return (
            <Layout footer={<Footer />}>
                <ErrorState
                    message={error}
                />
            </Layout>
        );
    }

    return (
        <Layout footer={<Footer />}>

            <div className="dashboard">

                {/* HEADER */}

                <div className="dashboard-page">
                    <header className="dashboard-welcome">
                        <div className="dashboard-welcome-copy">
                            <p className="dashboard-eyebrow">
                                CAREERAI INTELLIGENCE
                            </p>

                            <h1 className="dashboard-title">
                                Your next career move starts here
                            </h1>

                            <p className="dashboard-subtitle">
                                Discover your strengths, find roles that fit, and prepare to stand out with CareerAI.
                            </p>
                        </div>
                        <img
                            className="dashboard-welcome-art"
                            src={heroArtwork}
                            alt=""
                            aria-hidden="true"
                        />
                    </header>

                </div>


                {/* STATISTICS */}

                <div className="stats-grid">

                    <StatCard
                        title="My Resumes"
                        value={resumes.length}
                        icon="CV"
                        description="Uploaded resumes"
                        to="/resumes"
                    />

                    <StatCard
                        title="Job Matches"
                        value={matches.length}
                        icon="JOB"
                        description="Matched opportunities"
                        to="/jobs"
                    />

                    <StatCard
                        title="Average Match"
                        value={`${averageMatch.toFixed(1)}%`}
                        icon="FIT"
                        description="Overall compatibility"
                        to="/jobs"
                    />

                    <StatCard
                        title="Interview Prep"
                        value={interviews.length}
                        icon="AI"
                        description="Prepared interviews"
                        to="/interview"
                    />

                </div>


                {/* MAIN GRID */}

                <div className="dashboard-grid">

                    {/* RECENT MATCHES */}

                    <div className="dashboard-card dashboard-matches-card">

                        <div className="card-header">

                            <div>
                                <p className="eyebrow">
                                    OPPORTUNITIES
                                </p>

                                <h2>
                                    Latest Job Match
                                </h2>
                            </div>

                            <Link to="/jobs">
                                View All →
                            </Link>

                        </div>


                        {!latestMatch ? (

                            <div className="empty-state">

                                <h3>
                                    No job matches yet
                                </h3>

                                <p>
                                    Match your resume with a
                                    job description to discover
                                    your compatibility score.
                                </p>

                                <Link
                                    to="/jobs"
                                    className="primary-action"
                                >
                                    Find Job Matches
                                </Link>

                            </div>

                        ) : (

                            <div className="recent-matches">
                                <MatchMiniCard
                                    key={latestMatch.id}
                                    match={latestMatch}
                                />
                            </div>

                        )}

                    </div>


                    {/* RESUME */}

                    <div className="dashboard-card dashboard-resume-card">

                        <div className="card-header">

                            <div>
                                <p className="eyebrow">
                                    RESUME
                                </p>

                                <h2>
                                    Resume on File
                                </h2>
                            </div>

                            <Link to="/resumes">
                                Manage →
                            </Link>

                        </div>


                        {resumes.length === 0 ? (

                            <div className="empty-state">

                                <h3>
                                    No resume uploaded
                                </h3>

                                <p>
                                    Upload your resume to
                                    unlock AI-powered career
                                    analysis.
                                </p>

                                <Link
                                    to="/resumes"
                                    className="primary-action"
                                >
                                    Upload Resume
                                </Link>

                            </div>

                        ) : (

                            <div className="recent-resume">

                                <div>

                                    <h3>
                                        {resumes[0].title}
                                    </h3>

                                    <p>
                                        Uploaded{" "}
                                        {new Date(
                                            resumes[0].uploaded_at
                                        ).toLocaleDateString()}
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* AI INSIGHTS */}

                <div className="dashboard-card ai-dashboard-card">

                    <div className="card-header">

                        <div>

                            <p className="eyebrow">
                                AI CAREER INTELLIGENCE
                            </p>

                            <h2>
                                Latest Career Analysis
                            </h2>

                        </div>

                        <Link to="/analysis">
                            Analyze →
                        </Link>

                    </div>


                    {latestAnalysis ? (

                        <div className="ai-dashboard-content">

                            <p className="ai-summary">
                                {latestAnalysis.summary ||
                                    "Your AI career analysis is ready."}
                            </p>


                            <div className="ai-insight-grid">

                                <div>
                                    <strong>
                                        Strengths
                                    </strong>

                                    <span>
                                        {
                                            latestAnalysis
                                                .strengths
                                                ?.length || 0
                                        }
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        Weaknesses
                                    </strong>

                                    <span>
                                        {
                                            latestAnalysis
                                                .weaknesses
                                                ?.length || 0
                                        }
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        Critical Gaps
                                    </strong>

                                    <span>
                                        {
                                            latestAnalysis
                                                .critical_skill_gaps
                                                ?.length || 0
                                        }
                                    </span>
                                </div>


                                <div>
                                    <strong>
                                        Recommendations
                                    </strong>

                                    <span>
                                        {
                                            latestAnalysis
                                                .recommendations
                                                ?.length || 0
                                        }
                                    </span>
                                </div>

                            </div>

                        </div>

                    ) : (

                        <div className="empty-state">

                            <h3>
                                No AI analysis yet
                            </h3>

                            <p>
                                Generate an AI career analysis
                                after matching your resume
                                with a job.
                            </p>

                            <Link
                                to="/jobs"
                                className="primary-action"
                            >
                                Find a Job Match
                            </Link>

                        </div>

                    )}

                </div>


                {/* QUICK ACTIONS */}

                <div className="dashboard-card">

                    <p className="eyebrow">
                        GET STARTED
                    </p>

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="quick-actions">

                        <Link to="/resumes" className="quick-action-resume">
                            <span aria-hidden="true">CV</span>
                            <span>Upload Resume</span>
                            <span className="quick-action-arrow" aria-hidden="true">↗</span>
                        </Link>

                        <Link to="/jobs" className="quick-action-jobs">
                            <span aria-hidden="true">JOB</span>
                            <span>Find Job Matches</span>
                            <span className="quick-action-arrow" aria-hidden="true">↗</span>
                        </Link>

                        <Link to="/interview" className="quick-action-interview">
                            <span aria-hidden="true">PRE</span>
                            <span>Prepare Interview</span>
                            <span className="quick-action-arrow" aria-hidden="true">↗</span>
                        </Link>

                        <Link to="/profile" className="quick-action-profile">
                            <span aria-hidden="true">ME</span>
                            <span>Update Profile</span>
                            <span className="quick-action-arrow" aria-hidden="true">↗</span>
                        </Link>

                    </div>

                </div>

            </div>

        </Layout>
    );
}


export default Dashboard;