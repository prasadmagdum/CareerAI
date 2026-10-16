import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Auth.css";
import "./Login.css";


function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(
                username,
                password
            );

            navigate("/dashboard");

        } catch (loginError) {
            console.error("Login error:", loginError);

            setError(
                loginError.response?.data?.detail ||
                "Invalid username or password."
            );

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="auth-page login-page">

            <div className="auth-card">

                <h1>CareerAI</h1>

                <p>
                    Sign in to your account
                </p>

                {location.state?.message && (
                    <div className="auth-success" role="status">
                        {location.state.message}
                    </div>
                )}

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                >

                    <label>
                        Username
                    </label>

                    <input
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(event) =>
                            setUsername(
                                event.target.value
                            )
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"
                        }
                    </button>

                </form>

                <p className="auth-switch">
                    New to CareerAI? <Link to="/register">Create an account</Link>
                </p>

            </div>

        </div>
    );
}


export default Login;