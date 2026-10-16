import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BrainCircuit,
    BriefcaseBusiness,
    Check,
    FileSearch,
    Menu,
    Mic2,
    Pause,
    Play,
    Sparkles,
    Target,
    X,
} from "lucide-react";
import "./Landing.css";

const slides = [
    {
        eyebrow: "YOUR CAREER, IN FOCUS",
        title: "Find work that",
        accent: "feels like you.",
        description:
            "Turn your experience into a clear next step with thoughtful AI guidance, tailored job matches, and a little more confidence.",
        tag: "Career clarity",
        insight: "Career fit",
        chips: ["Product thinking", "Communication", "Leadership"],
        stat: "A better-fit role is closer than you think.",
    },
    {
        eyebrow: "A RESUME THAT OPENS DOORS",
        title: "Make your experience",
        accent: "stand out.",
        description:
            "Get a clearer picture of your strengths, sharpen your resume, and see what hiring teams are looking for.",
        tag: "Resume insights",
        insight: "Resume review",
        chips: ["Clearer summary", "Skills aligned", "Stronger story"],
        stat: "Small refinements. A stronger first impression.",
    },
    {
        eyebrow: "SHOW UP READY",
        title: "Walk into interviews",
        accent: "ready for anything.",
        description:
            "Practice the questions that matter and turn your best examples into answers you can deliver with confidence.",
        tag: "Interview coach",
        insight: "Interview prep",
        chips: ["Practice answers", "Build confidence", "Know your story"],
        stat: "Your next great answer starts with practice.",
    },
];

function CareerArtwork({ slideIndex }) {
    return (
        <svg
            className={`career-artwork career-artwork-${slideIndex}`}
            viewBox="0 0 620 500"
            role="img"
            aria-label={[
                "Abstract AI career compass with a glowing violet neural network",
                "Illustration of an AI resume analysis dashboard",
                "Illustration of an AI-powered interview practice session",
            ][slideIndex]}
        >
            <defs>
                <linearGradient id="art-backdrop" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#211a56" />
                    <stop offset="100%" stopColor="#5543c9" />
                </linearGradient>
                <linearGradient id="art-core" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a99aff" />
                    <stop offset="100%" stopColor="#6b54ed" />
                </linearGradient>
                <linearGradient id="art-accent" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6ee7d5" />
                    <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <radialGradient id="art-glow">
                    <stop offset="0%" stopColor="#a99aff" stopOpacity=".62" />
                    <stop offset="100%" stopColor="#a99aff" stopOpacity="0" />
                </radialGradient>
                <filter id="art-shadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#120d3e" floodOpacity=".3" />
                </filter>
            </defs>

            <rect width="620" height="500" rx="30" fill="url(#art-backdrop)" />
            <circle cx="385" cy="218" r="200" fill="url(#art-glow)" />
            <path
                d="M0 385C111 339 158 427 262 384s153-72 226-37 94 21 132 3v150H0Z"
                fill="#17143f"
                opacity=".38"
            />
            <g fill="none" stroke="#fff" strokeOpacity=".1">
                <path d="M0 90h620M0 170h620M0 250h620M0 330h620M0 410h620" />
                <path d="M90 0v500M190 0v500M290 0v500M390 0v500M490 0v500" />
            </g>

            {slideIndex === 0 && (
                <g filter="url(#art-shadow)">
                    <circle cx="340" cy="240" r="138" fill="none" stroke="#fff" strokeOpacity=".15" />
                    <circle cx="340" cy="240" r="108" fill="none" stroke="#b8aaff" strokeOpacity=".32" strokeDasharray="4 9" />
                    <path d="M250 266 308 205l42 35 68-78M260 173l44 32M350 240l62 52M307 205l-8 82 51-47" stroke="url(#art-accent)" strokeWidth="2" strokeOpacity=".75" />
                    <circle cx="340" cy="240" r="65" fill="#7964ee" fillOpacity=".2" stroke="#b8aaff" strokeOpacity=".5" />
                    <circle cx="340" cy="240" r="46" fill="url(#art-core)" />
                    <path d="M340 210v60m-30-30h60m-51-21 42 42m0-42-42 42" stroke="#fff" strokeOpacity=".78" strokeWidth="2" />
                    <g fill="#fff">
                        <circle cx="250" cy="266" r="7" /><circle cx="308" cy="205" r="6" />
                        <circle cx="418" cy="162" r="8" /><circle cx="412" cy="292" r="6" />
                        <circle cx="260" cy="173" r="5" /><circle cx="299" cy="287" r="5" />
                    </g>
                    <g fill="#6ee7d5">
                        <circle cx="250" cy="266" r="3" /><circle cx="418" cy="162" r="3" />
                        <circle cx="412" cy="292" r="3" /><circle cx="260" cy="173" r="2.5" />
                    </g>
                </g>
            )}

            {slideIndex === 1 && (
                <g filter="url(#art-shadow)">
                    <rect x="185" y="92" width="270" height="325" rx="22" fill="#fff" />
                    <rect x="207" y="116" width="226" height="105" rx="15" fill="#f2efff" />
                    <circle cx="257" cy="159" r="27" fill="url(#art-core)" />
                    <path d="m246 159 8 8 16-18" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="298" y="145" width="106" height="9" rx="4.5" fill="#39345f" />
                    <rect x="298" y="165" width="78" height="7" rx="3.5" fill="#b9b5ca" />
                    <rect x="207" y="241" width="226" height="76" rx="13" fill="#faf9ff" stroke="#eceaf5" />
                    <rect x="224" y="258" width="88" height="7" rx="3.5" fill="#8d89a2" />
                    <rect x="224" y="278" width="163" height="6" rx="3" fill="#dedce9" />
                    <rect x="224" y="294" width="132" height="6" rx="3" fill="#dedce9" />
                    <rect x="207" y="333" width="105" height="53" rx="12" fill="#e8fbf6" />
                    <rect x="326" y="333" width="107" height="53" rx="12" fill="#efedff" />
                    <path d="M224 367l11-10 9 5 15-17" fill="none" stroke="#31b79e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="354" cy="359" r="12" fill="none" stroke="#7462e8" strokeWidth="5" strokeDasharray="58 18" transform="rotate(-90 354 359)" />
                    <circle cx="398" cy="359" r="12" fill="none" stroke="#b8afff" strokeWidth="5" strokeDasharray="43 33" transform="rotate(-90 398 359)" />
                    <circle cx="224" cy="259" r="4" fill="#6e5be8" />
                </g>
            )}

            {slideIndex === 2 && (
                <g filter="url(#art-shadow)">
                    <rect x="155" y="102" width="310" height="270" rx="23" fill="#fff" />
                    <rect x="178" y="126" width="264" height="161" rx="15" fill="#211c4c" />
                    <circle cx="310" cy="194" r="49" fill="#4d4388" />
                    <circle cx="310" cy="181" r="19" fill="#d9c5b5" />
                    <path d="M274 235c4-26 18-38 36-38s32 12 36 38" fill="#8577dc" />
                    <path d="M282 174c3-19 15-30 30-30 18 0 28 13 29 31-11-5-19-13-23-23-8 11-21 18-36 22Z" fill="#292345" />
                    <circle cx="390" cy="151" r="5" fill="#6ee7d5" />
                    <rect x="178" y="305" width="264" height="42" rx="12" fill="#f5f3ff" />
                    <circle cx="201" cy="326" r="10" fill="#e5e1ff" />
                    <path d="M198 326h6m-3-3v6" stroke="#715ce5" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="220" y="321" width="114" height="8" rx="4" fill="#b4b0c7" />
                    <rect x="352" y="315" width="72" height="21" rx="10.5" fill="#e8fbf6" />
                    <circle cx="365" cy="325.5" r="3" fill="#38b99e" />
                    <rect x="373" y="322" width="40" height="7" rx="3.5" fill="#48a996" />
                    <circle cx="198" cy="380" r="4" fill="#6ee7d5" />
                    <path d="M211 380h78" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
                    <path d="M410 380h28" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />
                </g>
            )}

            <g fill="#fff" opacity=".8">
                <circle cx="104" cy="111" r="2" /><circle cx="514" cy="133" r="2.5" />
                <circle cx="123" cy="302" r="2" /><circle cx="520" cy="335" r="2" />
                <circle cx="156" cy="439" r="1.8" /><circle cx="474" cy="74" r="1.8" />
            </g>
        </svg>
    );
}

function Landing() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(
        () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    const slide = slides[activeSlide];

    useEffect(() => {
        if (!isPlaying) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 6000);

        return () => window.clearInterval(timer);
    }, [isPlaying]);

    function changeSlide(direction) {
        setActiveSlide((current) => (current + direction + slides.length) % slides.length);
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <main className="landing-page">
            <header className="landing-header">
                <Link to="/" className="landing-brand" aria-label="CareerAI home">
                    <span className="landing-brand-mark"><BrainCircuit size={21} /></span>
                    <span>Career<span>AI</span></span>
                </Link>
                <button
                    type="button"
                    className="landing-menu-toggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X size={21} /> : <Menu size={21} />}
                </button>
                <nav className={`landing-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
                    <Link to="/login" className="landing-signin" onClick={closeMenu}>
                        Sign in
                    </Link>
                    <Link to="/register" className="landing-nav-cta" onClick={closeMenu}>
                        Get started <ArrowUpRight size={15} />
                    </Link>
                </nav>
            </header>

            <section className="landing-hero" aria-label="CareerAI introduction">
                <div className="landing-hero-copy" key={`copy-${activeSlide}`}>
                    <span className="landing-kicker">
                        <Sparkles size={14} /> YOUR PERSONAL AI CAREER GUIDE
                    </span>
                    <h1>
                        {slide.title}
                        <span className="landing-title-accent">{slide.accent}</span>
                    </h1>
                    <p className="landing-description">{slide.description}</p>
                    <div className="landing-skill-chips" aria-label="Career guidance topics">
                        {slide.chips.map((chip) => (
                            <span key={chip}><Check size={12} /> {chip}</span>
                        ))}
                    </div>
                    <div className="landing-actions">
                        <Link to="/register" className="landing-primary-cta">
                            Create your free account <ArrowRight size={17} />
                        </Link>
                        <a href="#how-it-works" className="landing-secondary-cta">
                            See how it works <ArrowDown size={15} />
                        </a>
                    </div>
                    <div className="landing-social-proof">
                        <div className="landing-proof-icon" aria-hidden="true">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <strong>Built around your next step</strong>
                            <span>One personal career toolkit. Your pace.</span>
                        </div>
                    </div>
                </div>

                <div className="landing-showcase" aria-roledescription="carousel" aria-label="CareerAI feature slideshow">
                    <div className="showcase-topline">
                        <span><span className="showcase-live-dot" /> YOUR AI CAREER STUDIO</span>
                        <span>{String(activeSlide + 1).padStart(2, "0")} <i>/</i> {String(slides.length).padStart(2, "0")}</span>
                    </div>
                    <div className="showcase-art-wrap" key={`art-${activeSlide}`}>
                        <CareerArtwork slideIndex={activeSlide} />
                        <div className="showcase-float-card showcase-score-card">
                            <span className="showcase-card-icon"><Target size={15} /></span>
                            <span className="showcase-card-label">AI career guide</span>
                            <strong>{slide.insight}</strong>
                        </div>
                        <div className="showcase-float-card showcase-insight-card">
                            <span className="showcase-check"><Check size={13} /></span>
                            <span>{slide.stat}</span>
                        </div>
                    </div>
                    <div className="showcase-caption">
                        <div>
                            <span className="showcase-caption-eyebrow">{slide.eyebrow}</span>
                            <strong>{slide.tag}</strong>
                        </div>
                        <div className="showcase-controls">
                            <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous slide">
                                <ArrowLeft size={16} />
                            </button>
                            {slides.map((item, index) => (
                                <button
                                    key={item.tag}
                                    type="button"
                                    className={`showcase-dot${index === activeSlide ? " active" : ""}`}
                                    aria-label={`Show slide ${index + 1}: ${item.tag}`}
                                    aria-current={index === activeSlide ? "true" : undefined}
                                    onClick={() => setActiveSlide(index)}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => setIsPlaying((playing) => !playing)}
                                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                            >
                                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                            </button>
                            <button type="button" onClick={() => changeSlide(1)} aria-label="Next slide">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="landing-hero-orb landing-hero-orb-one" aria-hidden="true" />
                <div className="landing-hero-orb landing-hero-orb-two" aria-hidden="true" />
            </section>

            <section className="landing-trust-row" aria-label="Career tools">
                <span>Your career toolkit</span>
                <div><FileSearch size={16} /> Resume intelligence</div>
                <div><BriefcaseBusiness size={16} /> Better job matches</div>
                <div><Mic2 size={16} /> Interview practice</div>
            </section>

            <section className="landing-ai-lab" aria-labelledby="landing-ai-title">
                <div className="landing-ai-visual" aria-hidden="true">
                    <div className="landing-ai-grid" />
                    <div className="landing-ai-orbit landing-ai-orbit-outer">
                        <span className="landing-ai-orbit-node landing-ai-orbit-node-one" />
                        <span className="landing-ai-orbit-node landing-ai-orbit-node-three" />
                    </div>
                    <div className="landing-ai-orbit landing-ai-orbit-inner">
                        <span className="landing-ai-orbit-node landing-ai-orbit-node-two" />
                    </div>
                    <div className="landing-ai-core">
                        <span className="landing-ai-core-glow" />
                        <span className="landing-ai-core-icon"><BrainCircuit size={41} strokeWidth={1.5} /></span>
                        <strong>CareerAI</strong>
                        <span>Your AI career guide</span>
                    </div>
                    <div className="landing-ai-float-card landing-ai-float-top">
                        <span className="landing-ai-float-icon"><Sparkles size={14} /></span>
                        <span><strong>Career insights</strong><small>Made personal to you</small></span>
                    </div>
                    <div className="landing-ai-float-card landing-ai-float-bottom">
                        <span className="landing-ai-pulse-dot" />
                        <span>Skills meet opportunity</span>
                    </div>
                    <div className="landing-ai-scanline" />
                </div>

                <div className="landing-ai-content">
                    <span className="landing-section-kicker">
                        <Sparkles size={13} /> A LITTLE MORE CLARITY AT EVERY STEP
                    </span>
                    <h2 id="landing-ai-title">
                        Your career deserves more than <span>guesswork.</span>
                    </h2>
                    <p className="landing-ai-intro">
                        Bring your goals and experience together with practical AI tools
                        that help you decide what to do next.
                    </p>
                    <div className="landing-ai-features">
                        <article className="landing-ai-feature">
                            <span className="landing-ai-feature-icon"><FileSearch size={18} /></span>
                            <div>
                                <h3>Understand your strengths</h3>
                                <p>Get useful resume insights and see the skills you bring to the table.</p>
                            </div>
                            <ArrowUpRight size={16} className="landing-ai-feature-arrow" />
                        </article>
                        <article className="landing-ai-feature">
                            <span className="landing-ai-feature-icon landing-ai-feature-icon-teal"><BriefcaseBusiness size={18} /></span>
                            <div>
                                <h3>Explore better-fit roles</h3>
                                <p>Compare your experience with opportunities that catch your interest.</p>
                            </div>
                            <ArrowUpRight size={16} className="landing-ai-feature-arrow" />
                        </article>
                        <article className="landing-ai-feature">
                            <span className="landing-ai-feature-icon landing-ai-feature-icon-gold"><Mic2 size={18} /></span>
                            <div>
                                <h3>Practice with purpose</h3>
                                <p>Prepare for interviews by shaping clear, confident answers.</p>
                            </div>
                            <ArrowUpRight size={16} className="landing-ai-feature-arrow" />
                        </article>
                    </div>
                    <Link to="/register" className="landing-ai-link">
                        Explore your career toolkit <ArrowRight size={15} />
                    </Link>
                </div>
            </section>

            <section className="landing-how" id="how-it-works">
                <div className="landing-section-heading">
                    <span className="landing-section-kicker">A SMARTER WAY FORWARD</span>
                    <h2>Your next chapter, made clearer.</h2>
                    <p>Practical tools and thoughtful AI support, all working together for you.</p>
                </div>
                <div className="landing-steps">
                    <article className="landing-step-card">
                        <span className="landing-step-number">01</span>
                        <span className="landing-step-icon"><FileSearch size={20} /></span>
                        <h3>Know your strengths</h3>
                        <p>Bring your resume and experience into focus with clear, useful insights.</p>
                    </article>
                    <article className="landing-step-card">
                        <span className="landing-step-number">02</span>
                        <span className="landing-step-icon"><Target size={20} /></span>
                        <h3>Find your fit</h3>
                        <p>Explore opportunities that align with your skills and what matters to you.</p>
                    </article>
                    <article className="landing-step-card">
                        <span className="landing-step-number">03</span>
                        <span className="landing-step-icon"><Mic2 size={20} /></span>
                        <h3>Make your move</h3>
                        <p>Prepare for interviews and take your next step with more confidence.</p>
                    </article>
                </div>
            </section>

            <section className="landing-bottom-cta" id="features">
                <div className="landing-cta-sparkle"><Sparkles size={20} /></div>
                <div>
                    <span>YOUR NEXT CHAPTER STARTS HERE</span>
                    <h2>Ready to see what you're capable of?</h2>
                    <p>Build a career path that feels like your own.</p>
                </div>
                <Link to="/register" className="landing-primary-cta">
                    Get started for free <ArrowRight size={17} />
                </Link>
            </section>

            <footer className="landing-footer">
                <Link to="/" className="landing-brand">
                    <span className="landing-brand-mark"><BrainCircuit size={18} /></span>
                    <span>Career<span>AI</span></span>
                </Link>
                <span>Thoughtful AI for your next career move.</span>
                <div><Link to="/login">Sign in</Link><Link to="/register">Create account</Link></div>
            </footer>
        </main>
    );
}

export default Landing;
