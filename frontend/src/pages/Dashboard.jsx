import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import MatchMiniCard from "../components/MatchMiniCard";
import ReadinessCard from "../components/ReadinessCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

import { getDashboardData } from "../services/dashboardService";

import "./Dashboard.css";
function Dashboard() {

    const [dashboard, setDashboard] = useState({
        profile: null,
        resumes: [],
        matches: [],
        analyses: [],
        interviews: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadDashboard();
    }, []);


    async function loadDashboard() {

        try {

            setLoading(true);
            setError("");

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


    const {
        profile,
        resumes,
        matches,
        analyses,
        interviews,
    } = dashboard;


    const username =
        profile?.username || "Candidate";


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


    const recentMatches =
        matches.slice(0, 5);


    if (loading) {

        return (
            <Layout>
                <LoadingState
                    message="Loading your CareerAI dashboard..."
                />
            </Layout>
        );
    }


    if (error) {

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

            <div className="dashboard">

                {/* HEADER */}

                <div className="dashboard-page">
                    <header className="dashboard-welcome">
                        <div>
                            <p className="dashboard-eyebrow">
                                CAREER INTELLIGENCE
                            </p>

                            <h1 className="dashboard-title">
                                Welcome back, {username}
                            </h1>

                            <p className="dashboard-subtitle">
                                Track your progress and discover your next opportunity.
                            </p>
                        </div>
                    </header>

                </div>


                {/* STATISTICS */}

                <div className="stats-grid">

                    <StatCard
                        title="My Resumes"
                        value={resumes.length}
                        icon="📄"
                        description="Uploaded resumes"
                    />

                    <StatCard
                        title="Job Matches"
                        value={matches.length}
                        icon="💼"
                        description="Matched opportunities"
                    />

                    <StatCard
                        title="Average Match"
                        value={`${averageMatch.toFixed(1)}%`}
                        icon="🎯"
                        description="Overall compatibility"
                    />

                    <StatCard
                        title="Interview Prep"
                        value={interviews.length}
                        icon="🤖"
                        description="Prepared interviews"
                    />

                </div>


                {/* READINESS */}

                <ReadinessCard
                    analysis={latestAnalysis}
                    averageScore={averageMatch}
                />


                {/* MAIN GRID */}

                <div className="dashboard-grid">

                    {/* RECENT MATCHES */}

                    <div className="dashboard-card">

                        <div className="card-header">

                            <div>
                                <p className="eyebrow">
                                    OPPORTUNITIES
                                </p>

                                <h2>
                                    Recent Job Matches
                                </h2>
                            </div>

                            <Link to="/jobs">
                                View All →
                            </Link>

                        </div>


                        {recentMatches.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    💼
                                </div>

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

                                {recentMatches.map(
                                    (match) => (
                                        <MatchMiniCard
                                            key={match.id}
                                            match={match}
                                        />
                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* RESUME */}

                    <div className="dashboard-card">

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

                                <div className="empty-icon">
                                    📄
                                </div>

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
                                        💪 Strengths
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
                                        ⚠️ Weaknesses
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
                                        🔴 Critical Gaps
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
                                        💡 Recommendations
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

                            <div className="empty-icon">
                                🤖
                            </div>

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

                        <Link to="/resumes">
                            📄 Upload Resume
                        </Link>

                        <Link to="/jobs">
                            💼 Find Job Matches
                        </Link>

                        <Link to="/interview">
                            🎯 Prepare Interview
                        </Link>

                        <Link to="/profile">
                            👤 Update Profile
                        </Link>

                    </div>

                </div>

            </div>

        </Layout>
    );
}


export default Dashboard;