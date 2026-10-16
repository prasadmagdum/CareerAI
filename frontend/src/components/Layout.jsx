
import Navbar from "./Navbar";
import Footer from "./Footer";
import CareerChatbot from "./CareerChatbot";
import "./Layout.css";
import "./AppExperience.css";

function Layout({ children, footer = <Footer /> }) {
    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="main-content-inner">
                    {children}
                </div>
            </main>

            {footer}
            <CareerChatbot />
        </div>
    );
}

export default Layout;
