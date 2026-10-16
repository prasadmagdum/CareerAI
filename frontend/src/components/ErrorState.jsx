import "./ErrorState.css";

function ErrorState({
    message = "Something went wrong."
}) {
    return (
        <div className="error-state">

            <div className="error-icon">
                ⚠️
            </div>

            <h3>
                Something went wrong
            </h3>

            <p>
                {message}
            </p>

        </div>
    );
}

export default ErrorState;