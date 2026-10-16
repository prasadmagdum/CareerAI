import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    BrainCircuit,
    BriefcaseBusiness,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Target,
    UserRound,
    X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Resumes", path: "/resumes", icon: FileText },
    { label: "Jobs", path: "/jobs", icon: BriefcaseBusiness },
    { label: "AI Analysis", path: "/analysis", icon: BrainCircuit },
    { label: "Interview Prep", path: "/interview", icon: Target },
    { label: "Profile", path: "/profile", icon: UserRound },
];

function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    function closeMenu() {
        setMenuOpen(false);
    }

    function handleLogout() {
        closeMenu();
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <header className="app-navbar">
            <div className="navbar-inner">
                <NavLink
                    to="/dashboard"
                    className="navbar-brand"
                    aria-label="CareerAI dashboard"
                    onClick={closeMenu}
                >
                    <span className="navbar-brand-icon">
                        <BrainCircuit size={20} />
                    </span>
                    <span className="navbar-brand-name">CareerAI</span>
                </NavLink>

                <button
                    type="button"
                    className="navbar-toggle"
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={menuOpen}
                    aria-controls="primary-navigation"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X size={21} /> : <Menu size={21} />}
                </button>

                <nav
                    id="primary-navigation"
                    className={`navbar-navigation ${menuOpen ? "is-open" : ""}`}
                    aria-label="Main navigation"
                >
                    {navigation.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end
                            className={({ isActive }) => [
                                "navbar-link",
                                path === "/profile" && "navbar-profile-link",
                                isActive && "active",
                            ].filter(Boolean).join(" ")}
                            onClick={closeMenu}
                        >
                            <Icon
                                className={path === "/profile" ? "navbar-profile-icon" : undefined}
                                size={16}
                                strokeWidth={1.9}
                            />
                            <span>{label}</span>
                        </NavLink>
                    ))}

                    <button
                        type="button"
                        className="navbar-logout navbar-mobile-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <span>Log out</span>
                    </button>
                </nav>

                <button
                    type="button"
                    className="navbar-logout navbar-desktop-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span>Log out</span>
                </button>
            </div>
        </header>
    );
}

export default Navbar;
