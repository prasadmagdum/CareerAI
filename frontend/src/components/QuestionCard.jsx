import { useState } from "react";
import "./QuestionCard.css";

function QuestionCard({ question, index }) {
    const [showAnswer, setShowAnswer] = useState(false);

    const questionText =
        typeof question === "string"
            ? question
            : question.question || question.text || "Interview question";

    const answer =
        typeof question === "object"
            ? question.answer || question.sample_answer || ""
            : "";

    const difficulty =
        typeof question === "object"
            ? question.difficulty || "Practice"
            : "Practice";

    return (
        <article className="question-card">
            <div className="question-card-top">
                <span className="question-number">
                    Q{index + 1}
                </span>

                <span className="question-difficulty">
                    {difficulty}
                </span>
            </div>

            <h3>{questionText}</h3>

            {answer && (
                <>
                    <button
                        type="button"
                        className="btn btn-secondary question-answer-btn"
                        onClick={() => setShowAnswer(!showAnswer)}
                    >
                        {showAnswer ? "Hide Answer" : "View Sample Answer"}
                    </button>

                    {showAnswer && (
                        <div className="question-answer">
                            <strong>Sample Answer</strong>
                            <p>{answer}</p>
                        </div>
                    )}
                </>
            )}
        </article>
    );
}

export default QuestionCard;