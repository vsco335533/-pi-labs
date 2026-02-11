import { Link } from 'react-router-dom';
import { LOGO_SRC } from './Logo';
import { T } from './GlobalStyles';

export function Footer() {
    return (
        <footer style={{ background: T.deepBlack, color: T.stone, padding: "3.5rem 2.5rem 2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2.5rem", maxWidth: 1100, margin: "0 auto" }}>
                <div style={{ maxWidth: 340 }}>
                    <img src={LOGO_SRC} alt="π" style={{ height: 38, width: 38, marginBottom: "0.8rem", filter: "invert(1) brightness(0.9)" }} />
                    <p className="body-serif" style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#777" }}>
                        Pi Labs Commons Research Foundation. Independent research and praxis at the intersection of social theory, technology, <br/>and the commons.
                    </p>
                </div>
                {[
                    { title: "Foundation", links: [["About", "/about"], ["Our Work", "/work"], ["Centers", "/centers"], ["Publications", "/publications"]] },
                    { title: "Ecosystem", links: [["Radius EduTech", "/ecosystem"], ["Octacomm", "/ecosystem"], ["Vanguard Journal", "/publications"]] },
                    { title: "Connect", links: [["Contact", "/contact"], ["Email", "/contact"], ["GitHub", "/contact"]] },
                ].map((col) => (
                    <div key={col.title}>
                        <h5 className="serif" style={{ fontSize: "0.95rem", color: T.paper, marginBottom: "0.8rem" }}>{col.title}</h5>
                        {col.links.map(([label, to]) => (
                            <Link key={label} to={to} style={{ display: "block", fontSize: "0.82rem", color: "#777", marginBottom: "0.45rem", transition: "color 0.3s", textDecoration: "none" }}>
                                {label}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
            <div style={{ maxWidth: 1100, margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#555", flexWrap: "wrap", gap: "0.5rem" }}>
                <span>&copy; 2026 Pi Labs Commons Research Foundation</span>
                <span style={{ fontStyle: "italic" }}>Built on the commons.</span>
            </div>
        </footer>
    );
}
