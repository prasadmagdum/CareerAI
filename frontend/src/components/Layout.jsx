
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Layout.css";
import "./AppExperience.css";

function Layout({ children }) {
    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="main-content-inner">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Layout;
