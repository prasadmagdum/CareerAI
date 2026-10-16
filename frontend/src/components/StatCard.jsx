import "./StatCard.css";
import { Link } from "react-router-dom";

function StatCard({
    title,
    value,
    icon,
    description,
    to,
}) {
    const content = (
        <>

            <div className="stat-top">
                <span className="stat-title">
                    {title}
                </span>

                <span className="stat-icon">
                    {icon}
                </span>
            </div>

            <h2>{value}</h2>

            <p>{description}</p>

        </>
    );

    return to ? (
        <Link to={to} className="stat-card stat-card-link">
            {content}
        </Link>
    ) : (
        <div className="stat-card">
            {content}
        </div>
    );
}

export default StatCard;