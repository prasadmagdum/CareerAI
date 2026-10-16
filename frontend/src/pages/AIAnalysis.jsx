import { useEffect, useMemo, useState } from "react";
import {
    generateAIAnalysis,
    getMyAIAnalyses,
} from "../services/aiService";
import { getMyMatches } from "../services/jobService";

import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import InsightList from "../components/InsightList";
import JobReadiness from "../components/JobReadiness";
import "./AIAnalysis.css";

function AIAnalysis() {
    const [matches, setMatches] = useState([]);
    const [analyses, setAnalyses] = useState([]);

    const [selectedMatchId, setSelectedMatchId] =
        useState("");

    const [analysis, setAnalysis] = useState(null);

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [
                matchesResponse,
                analysesResponse,
            ] = await Promise.all([
                getMyMatches(),
                getMyAIAnalyses(),
            ]);

            const matchesData =
                matchesResponse?.results ||
                matchesResponse?.data ||
                matchesResponse ||
                [];

            const analysesData =
                analysesResponse?.results ||
                analysesResponse?.data ||
                analysesResponse ||
                [];

            const safeMatches = Array.isArray(matchesData)
                ? matchesData
                : [];

            const safeAnalyses = Array.isArray(analysesData)
                ? analysesData
                : [];

            setMatches(safeMatches);
            setAnalyses(safeAnalyses);

            if (safeMatches.length > 0) {
                const latestMatch = safeMatches[0];

                const matchId =
                    latestMatch.id ||
                    latestMatch.match_result_id;

                if (matchId) {
                    setSelectedMatchId(String(matchId));
                }
            }
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load AI analysis data."
            );
        } finally {
            setLoading(false);
        }
    }

    const selectedMatch = useMemo(() => {
        return matches.find(
            (match) =>
                String(
                    match.id ||
                    match.match_result_id
                ) === String(selectedMatchId)
        );
    }, [matches, selectedMatchId]);

    const existingAnalysis = useMemo(() => {
        if (!selectedMatchId) {
            return null;
        }

        return analyses.find((item) => {
            const analysisMatchId =
                item.match_result?.id ||
                item.match_result_id ||
                item.match_result;

            return (
                String(analysisMatchId) ===
                String(selectedMatchId)
            );
        });
    }, [analyses, selectedMatchId]);

    useEffect(() => {
        setAnalysis(existingAnalysis || null);
    }, [existingAnalysis]);

    async function handleGenerateAnalysis() {
        if (!selectedMatchId) {
            setError(
                "Please select a job match first."
            );
            return;
        }

        try {
            setGenerating(true);
            setError("");
            setSuccess("");

            const response =
                await generateAIAnalysis(
                    Number(selectedMatchId)
                );

            const generatedAnalysis =
                response?.data ||
                response?.analysis ||
                response;

            setAnalysis(generatedAnalysis);

            setAnalyses((previous) => {
                const filtered = previous.filter((item) => {
                    const id =
                        item.match_result?.id ||
                        item.match_result_id ||
                        item.match_result;

                    return (
                        String(id) !==
                        String(selectedMatchId)
                    );
                });

                return [
                    generatedAnalysis,
                    ...filtered,
                ];
            });

            setSuccess(
                "AI career analysis generated successfully."
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                "Failed to generate AI analysis."
            );
        } finally {
            setGenerating(false);
        }
    }

    if (loading) {
        return (
            <LoadingState
                message="Loading AI career analysis..."
            />
        );
    }

    return (
        <div className="ai-analysis-page">

            {/* Header */}
            <header className="ai-analysis-header">
                <div>
                    <span className="ai-analysis-kicker">
                        <span className="ai-status-dot" />
                        Career intelligence
                    </span>
                    <h1 className="ai-analysis-title">
                        AI Resume Analysis
                    </h1>
                    <p className="ai-analysis-subtitle">
                        Understand your strengths and discover opportunities to improve your resume.
                    </p>
                </div>
                <div className="ai-hero-orb" aria-hidden="true">
                    <span className="ai-orb-core" />
                    <span className="ai-orb-ring ai-orb-ring-one" />
                    <span className="ai-orb-ring ai-orb-ring-two" />
                    <span className="ai-orb-spark ai-orb-spark-one" />
                    <span className="ai-orb-spark ai-orb-spark-two" />
                </div>
            </header>


            {/* Error */}
            {error && (
                <ErrorState message={error} />
            )}

            {/* Success */}
            {success && (
                <div className="success-message">
                    ✅ {success}
                </div>
            )}

            {/* No matches */}
            {matches.length === 0 ? (
                <div className="empty-state-card">
                    <div className="empty-state-icon">
                        AI
                    </div>

                    <h2>No Job Matches Yet</h2>

                    <p>
                        Match your resume with a job first
                        to generate an AI career analysis.
                    </p>
                </div>
            ) : (
                <>
                    {/* Match Selector */}
                    <div className="ai-control-card">
                        <div>
                            <span className="section-eyebrow">
                                Select Match
                            </span>

                            <h2>
                                Analyze Your Career Fit
                            </h2>

                            <p>
                                Choose a resume-job match
                                to generate personalized
                                AI insights.
                            </p>
                        </div>

                        <div className="ai-control-row">
                            <select
                                value={selectedMatchId}
                                onChange={(event) =>
                                    setSelectedMatchId(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    Select a job match
                                </option>

                                {matches.map((match) => {
                                    const id =
                                        match.id ||
                                        match.match_result_id;

                                    const jobTitle =
                                        match.job?.title ||
                                        match.job_title ||
                                        "Job Opportunity";

                                    const company =
                                        match.job?.company ||
                                        match.company ||
                                        "Company";

                                    const score =
                                        Number(
                                            match.overall_score ||
                                            0
                                        );

                                    return (
                                        <option
                                            key={id}
                                            value={id}
                                        >
                                            {jobTitle} -{" "}
                                            {company} (
                                            {score.toFixed(1)}%)
                                        </option>
                                    );
                                })}
                            </select>

                            <button
                                className={`btn btn-primary ${
                                    generating ? "ai-generating" : ""
                                }`}
                                onClick={
                                    handleGenerateAnalysis
                                }
                                disabled={
                                    generating ||
                                    !selectedMatchId
                                }
                            >
                                {generating && (
                                    <span
                                        className="ai-button-orb"
                                        aria-hidden="true"
                                    />
                                )}
                                {generating
                                    ? "Generating..."
                                    : analysis
                                    ? "Regenerate Analysis"
                                    : "Generate AI Analysis"}
                            </button>
                        </div>
                    </div>

                    {/* Selected Match Summary */}
                    {selectedMatch && (
                        <div className="selected-match-summary">
                            <div>
                                <span>
                                    Resume
                                </span>

                                <strong>
                                    {selectedMatch.resume
                                        ?.title ||
                                        selectedMatch.resume_title ||
                                        "Resume"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Job
                                </span>

                                <strong>
                                    {selectedMatch.job
                                        ?.title ||
                                        selectedMatch.job_title ||
                                        "Job"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Company
                                </span>

                                <strong>
                                    {selectedMatch.job
                                        ?.company ||
                                        selectedMatch.company ||
                                        "Company"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Match Score
                                </span>

                                <strong className="match-score-value">
                                    {Number(
                                        selectedMatch.overall_score ||
                                        0
                                    ).toFixed(1)}
                                    %
                                </strong>
                            </div>
                        </div>
                    )}

                    {/* Analysis */}
                    {analysis ? (
                        <div className="ai-analysis-content">

                            {/* Summary */}
                            <div className="ai-summary-card">
                                <div className="ai-summary-icon">
                                    AI
                                </div>

                                <div>
                                    <span className="section-eyebrow">
                                        AI Career Summary
                                    </span>

                                    <h2>
                                        Your Career Fit
                                    </h2>

                                    <p>
                                        {analysis.summary ||
                                            "No summary available."}
                                    </p>
                                </div>
                            </div>

                            {/* Readiness */}
                            <JobReadiness
                                readiness={
                                    analysis.job_readiness
                                }
                            />

                            {/* Insights */}
                            <div className="ai-insights-grid">

                                <InsightList
                                    title="Strengths"
                                    type="positive"
                                    items={
                                        analysis.strengths ||
                                        []
                                    }
                                />

                                <InsightList
                                    title="Weaknesses"
                                    type="warning"
                                    items={
                                        analysis.weaknesses ||
                                        []
                                    }
                                />

                                <InsightList
                                    title="Critical Skill Gaps"
                                    type="critical"
                                    items={
                                        analysis.critical_skill_gaps ||
                                        []
                                    }
                                />

                                <InsightList
                                    title="Preferred Skill Gaps"
                                    type="preferred"
                                    items={
                                        analysis.preferred_skill_gaps ||
                                        []
                                    }
                                />

                                <InsightList
                                    title="Recommendations"
                                    type="recommendation"
                                    items={
                                        analysis.recommendations ||
                                        []
                                    }
                                />

                                <InsightList
                                    title="Resume Improvements"
                                    type="resume"
                                    items={
                                        analysis.resume_improvements ||
                                        []
                                    }
                                />

                            </div>

                            {/* Skill Gap Explanation */}
                            <div className="skill-gap-explanation-card">
                                <div className="section-card-header">
                                    <div>
                                        <span className="section-eyebrow">
                                            Personalized Guidance
                                        </span>

                                        <h2>
                                            📚 Skill Gap Explanation
                                        </h2>
                                    </div>
                                </div>

                                {(
                                    analysis.skill_gap_explanation ||
                                    []
                                ).length === 0 ? (
                                    <p>
                                        No skill gap
                                        explanation available.
                                    </p>
                                ) : (
                                    <div className="skill-gap-list">
                                        {analysis.skill_gap_explanation.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="skill-gap-item"
                                                >
                                                    {typeof item ===
                                                    "object" ? (
                                                        <>
                                                            <h3>
                                                                {item.skill ||
                                                                    item.name ||
                                                                    "Skill Gap"}
                                                            </h3>

                                                            <p>
                                                                {item.explanation ||
                                                                    item.reason ||
                                                                    item.description ||
                                                                    JSON.stringify(
                                                                        item
                                                                    )}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p>
                                                            {item}
                                                        </p>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="empty-state-card">
                            <div className="empty-state-icon">
                                ✨
                            </div>

                            <h2>
                                Ready for AI Analysis?
                            </h2>

                            <p>
                                Select a job match and click
                                <strong>
                                    {" "}Generate AI Analysis
                                </strong>{" "}
                                to get personalized career
                                insights.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AIAnalysis;