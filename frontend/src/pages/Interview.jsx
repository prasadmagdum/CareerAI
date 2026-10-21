import { useEffect, useState } from "react";

import {
    getMyMatches,
} from "../services/jobService";

import {
    generateInterviewQuestions,
    getMyInterviewPreparations,
} from "../services/aiService";

import QuestionCard from "../components/QuestionCard";
import LoadingState from "../components/LoadingState";
import "./Interview.css";
function Interview() {

    const [matches, setMatches] = useState([]);
    const [preparations, setPreparations] = useState([]);

    const [selectedMatch, setSelectedMatch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [generating, setGenerating] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            getMyMatches(),
            getMyInterviewPreparations(),
        ])
            .then(([matchesResponse, preparationResponse]) => {
                if (!isMounted) {
                    return;
                }

                const matchesData =
                    matchesResponse.data ||
                    matchesResponse.results ||
                    matchesResponse;
                const preparationData =
                    preparationResponse.data ||
                    preparationResponse.results ||
                    preparationResponse;

                setMatches(matchesData);

                if (matchesData.length > 0) {
                    setSelectedMatch(matchesData[0].id);
                }

                setPreparations(preparationData);
            })
            .catch((err) => {
                console.error(err);

                if (isMounted) {
                    setError("Unable to load interview preparation.");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    async function generatePreparation() {

        if (!selectedMatch) {

            setError(
                "Please select a job match first."
            );

            return;
        }

        setGenerating(true);
        setError("");

        try {

            const response =
                await generateInterviewQuestions(
                    selectedMatch
                );

            const result =
                response.data || response;

            setPreparations((previous) => [
                result,
                ...previous.filter(
                    (item) =>
                        String(item.match_result?.id || item.match_result) !==
                        String(selectedMatch)
                ),
            ]);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to generate interview questions."
            );

        } finally {

            setGenerating(false);
        }
    }

    const preparation = preparations.find(
        (item) =>
            String(item.match_result?.id || item.match_result) ===
            String(selectedMatch)
    ) || null;

    if (loading) {
        return (
            <LoadingState message="Loading interview preparation..." />
        );
    }

    return (
        <div className="page interview-page">

            <div className="page-header">

                <div>

                    <p className="eyebrow">
                        CAREERAI INTERVIEW AI
                    </p>

                    <h1>
                        Interview Preparation
                    </h1>

                    <p>
                        Practice questions generated
                        specifically for your resume and
                        target job.
                    </p>

                </div>

            </div>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            {/* Match Selector */}

            <div className="interview-selector">

                <label>
                    Select Job Match
                </label>

                <select
                    value={selectedMatch}
                    onChange={(event) =>
                        setSelectedMatch(
                            event.target.value
                        )
                    }
                >

                    <option value="">
                        Select a job match
                    </option>

                    {matches.map((match) => (

                        <option
                            key={match.id}
                            value={match.id}
                        >
                            {match.job_title ||
                                match.job?.title ||
                                `Match #${match.id}`}
                            {" — "}
                            {Math.round(
                                match.overall_score || 0
                            )}%
                        </option>

                    ))}

                </select>

                <button
                    onClick={generatePreparation}
                    disabled={
                        generating ||
                        !selectedMatch
                    }
                >
                    {generating
                        ? "Generating..."
                        : "Generate Interview Questions"}
                </button>

            </div>

            {/* Empty State */}

            {matches.length === 0 && (

                <div className="empty-state">

                    <h3>
                        No job matches yet
                    </h3>

                    <p>
                        Match your resume with a job
                        before generating interview questions.
                    </p>

                </div>
            )}

            {/* Interview Results */}

            {preparation && (

                <div className="interview-results">

                    <div className="interview-intro">

                        <span className="ai-badge">
                            AI Generated
                        </span>

                        <h2>
                            Your Interview Preparation
                        </h2>

                        <p>
                            These questions are generated
                            using your resume, target job,
                            matched skills and skill gaps.
                        </p>

                    </div>

                    {/* Technical */}

                    <InterviewSection
                        title="💻 Technical Questions"
                        questions={
                            preparation.technical_questions ||
                            []
                        }
                    />

                    {/* Projects */}

                    <InterviewSection
                        title="Project Questions"
                        questions={
                            preparation.project_questions ||
                            []
                        }
                    />

                    {/* Skill Gaps */}

                    <InterviewSection
                        title="📚 Skill Gap Questions"
                        questions={
                            preparation.skill_gap_questions ||
                            []
                        }
                    />

                    {/* HR */}

                    <InterviewSection
                        title="HR Questions"
                        questions={
                            preparation.hr_questions ||
                            []
                        }
                    />

                </div>
            )}

        </div>
    );
}

function InterviewSection({
    title,
    questions,
}) {

    return (
        <div className="interview-section">

            <div className="interview-section-header">

                <h2>
                    {title}
                </h2>

                <span>
                    {questions.length} questions
                </span>

            </div>

            {questions.length === 0 ? (

                <div className="no-questions">
                    No questions generated for this category.
                </div>

            ) : (

                <div className="question-list">

                    {questions.map(
                        (question, index) => (

                            <QuestionCard
                                key={index}
                                question={question}
                                index={index}
                            />

                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default Interview;