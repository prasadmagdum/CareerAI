import "./InsightList.css";

function InsightList({
    title,
    items = [],
    type = "default",
}) {
    return (
        <div className={`insight-card ${type}`}>
            <div className="insight-card-header">
                <h3>
                    {title}
                </h3>

                <span className="insight-count">
                    {items.length}
                </span>
            </div>

            {items.length === 0 ? (
                <p className="insight-empty">
                    No information available.
                </p>
            ) : (
                <ul className="insight-list">
                    {items.map((item, index) => (
                        <li key={index}>
                            {typeof item === "object"
                                ? item.text ||
                                  item.name ||
                                  item.skill ||
                                  JSON.stringify(item)
                                : item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default InsightList;