import Footer from "./Footer";
import "./PublicLayout.css";
import "./AppExperience.css";

function PublicLayout({ children }) {
    return (
        <div className="app-layout public-layout">
            {children}
            <Footer />
        </div>
    );
}

export default PublicLayout;
