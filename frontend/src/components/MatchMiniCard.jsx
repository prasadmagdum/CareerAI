import { Link } from "react-router-dom";
import "./MatchMiniCard.css";

function MatchMiniCard({ match }) {
    const score = Number(match.overall_score || 0);

    const jobTitle =
        match.job?.title ||
        match.job_title ||
        "Job Opportunity";

    const company =
        match.job?.company ||
        match.company ||
        "Company";

    return (
        <div className="match-mini-card">
            <div className="match-mini-info">
                <h3>{jobTitle}</h3>
                <p>{company}</p>
            </div>

            <div className="match-mini-score">
                <strong>{score.toFixed(1)}%</strong>
                <span>Match</span>
            </div>

            <Link to="/jobs" className="match-view-btn">
                View
            </Link>
        </div>
    );
}

export default MatchMiniCard;