import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

function Footer() {
    const { isAuthenticated } = useAuth();

    return (
        <footer className="app-footer">
            <div className="footer-inner">
                <Link
                    to={isAuthenticated ? "/dashboard" : "/"}
                    className="footer-brand"
                    aria-label={isAuthenticated ? "CareerAI dashboard" : "CareerAI home"}
                >
                    <Sparkles size={15} />
                    <span>CareerAI</span>
                </Link>
                <p>Make your next career move with confidence.</p>
                <span className="footer-copyright">
                    © {new Date().getFullYear()} CareerAI
                </span>
            </div>
        </footer>
    );
}

export default Footer;
