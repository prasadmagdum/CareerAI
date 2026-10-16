import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";
import "./Auth.css";
import "./Register.css";

function getRegistrationError(error) {
    const errors = error.response?.data?.errors;

    if (errors && typeof errors === "object") {
        return Object.entries(errors)
            .map(([field, messages]) => {
                const message = Array.isArray(messages)
                    ? messages.join(" ")
                    : String(messages);

                return `${field}: ${message}`;
            })
            .join(" ");
    }

    return error.response?.data?.message ||
        error.response?.data?.detail ||
        "Unable to create your account. Please try again.";
}

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (password !== password2) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            await registerUser({
                username: username.trim(),
                email: email.trim(),
                password,
                password2,
            });

            navigate("/login", {
                replace: true,
                state: {
                    message: "Account created. Sign in to get started.",
                },
            });
        } catch (registrationError) {
            console.error("Registration error:", registrationError);
            setError(getRegistrationError(registrationError));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page register-page">
            <div className="auth-card">
                <h1>CareerAI</h1>
                <p>Create your account to start building your career.</p>

                {error && (
                    <div className="error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="register-username">Username</label>
                    <input
                        id="register-username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="username"
                        maxLength={150}
                        required
                    />

                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="register-password">Password</label>
                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <label htmlFor="register-password-confirm">
                        Confirm password
                    </label>
                    <input
                        id="register-password-confirm"
                        type="password"
                        value={password2}
                        onChange={(event) => setPassword2(event.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
