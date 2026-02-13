import { Link } from 'react-router-dom';
import { LOGO_SRC } from './Logo';
import { T } from './GlobalStyles';

export function Footer() {
    return (
        <footer style={{ background: T.deepBlack, color: T.stone, padding: "clamp(3rem, 8vw, 6rem) var(--side-pad) 3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "clamp(2.5rem, 5vw, 5rem)", width: "100%", margin: "0 auto" }}>
                <div style={{ maxWidth: 500, flex: "1 1 350px" }}>
                    <img src={LOGO_SRC} alt="π" style={{ height: "clamp(34px, 1.5vw, 42px)", width: "auto", marginBottom: "1.2rem", filter: "invert(1) brightness(0.9)" }} />
                    <p className="body-serif" style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)", lineHeight: 1.7, color: "#888", maxWidth: 450 }}>
                        Pi Labs Commons Research Foundation. Independent research and praxis at the intersection of social theory, technology, and the commons.
                    </p>
                </div>
                {[
                    { title: "Foundation", links: [["About", "/about"], ["Our Work", "/work"], ["Our Centers", "/work#centers"], ["Publications", "/publications"]] },
                    { title: "Ecosystem", links: [["Radius EduTech", "/ecosystem"], ["Octacomm", "/ecosystem"]] },
                    { title: "Connect", links: [["Contact", "/contact"], ["Email", "/contact"], ["GitHub", "/contact"]] },
                ].map((col) => (
                    <div key={col.title} style={{ flex: "1 1 180px", minWidth: "150px" }}>
                        <h5 className="serif" style={{ fontSize: "clamp(1rem, 1.2vw, 1.15rem)", color: T.paper, marginBottom: "1.5rem", letterSpacing: "0.02em" }}>{col.title}</h5>
                        {col.links.map(([label, to]) => (
                            <Link key={label} to={to} style={{ display: "block", fontSize: "clamp(0.8rem, 1vw, 0.95rem)", color: "#888", marginBottom: "0.8rem", transition: "color 0.3s", textDecoration: "none" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = T.paper}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#888"}>
                                {label}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            <div style={{ width: "100%", margin: "4rem auto 0", paddingTop: "1.8rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", fontSize: "clamp(0.7rem, 0.8vw, 0.8rem)", color: "#666", flexWrap: "wrap", gap: "1.5rem" }}>
                <span>&copy; 2026 Pi Labs Commons Research Foundation</span>
                <span style={{ fontStyle: "italic", letterSpacing: "0.02em" }}>Built on the commons.</span>
            </div>
        </footer>
    );
}