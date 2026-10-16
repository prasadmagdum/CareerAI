
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Resumes from "./pages/Resumes";
import Jobs from "./pages/Jobs";
import Interview from "./pages/Interview";
import AIAnalysis from "./pages/AIAnalysis";

import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/dashboard" replace />
                        : <Login />
                }
            />

            <Route
                path="/register"
                element={
                    isAuthenticated
                        ? <Navigate to="/dashboard" replace />
                        : <Register />
                }
            />

            <Route
                path="/"
                element={
                    isAuthenticated
                        ? <Navigate to="/dashboard" replace />
                        : <Landing />
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/resumes"
                element={
                    <ProtectedRoute>
                        <Resumes />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/jobs"
                element={
                    <ProtectedRoute>
                        <Jobs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/interview"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Interview />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/analysis"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AIAnalysis />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
}

export default App;
