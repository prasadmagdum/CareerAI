import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import "./Footer.css";

function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-inner">
                <Link to="/dashboard" className="footer-brand">
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
