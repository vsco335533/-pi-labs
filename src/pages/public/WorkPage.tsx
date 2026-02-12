import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { PageHero } from '../../components/NewLayout/PageComponents';
import { MapPin } from 'lucide-react';

export function Work() {
    const ref = useReveal();
    const centers = [
        { location: "Siddipet District", type: "Rural Research Station", focus: "Agrarian commons, rural technology, and cooperative farming models." },
        { location: "Hyderabad (Old City)", type: "Urban Praxis Lab", focus: "Urban commons, gig economy worker organizing, and digital literacy." },
        { location: "North Telangana", type: "Field Office", focus: "Adivasi rights, environmental commons, and indigenous knowledge systems." },
    ];

    return (
        <div ref={ref}>
            <PageHero tag="Our Work" title={<>Theory in<br />motion closures.</>} subtitle="Our work spans four interconnected areas, each informing the others to build a cohesive praxis for the commons." />

            <section style={{ padding: "var(--section-pad) var(--side-pad)" }}>
                {[
                    {
                        tag: "01 / Research",
                        title: "Critical Analysis & Theory",
                        desc: "We produce rigorous theoretical work on the political economy of technology, the history of the commons, and the social implications of AI. Our research is published in open-access journals and our own publications.",
                        link: "/publications", linkText: "View Publications"
                    },
                    {
                        tag: "02 / Technology",
                        title: "Sovereign Infrastructure",
                        desc: "We build and maintain digital infrastructure that is enhancing community autonomy. From offline-first educational tools to community-owned mesh networks and data commons.",
                        link: "/github", linkText: "View Code Repositories" // Placeholder link
                    },
                    {
                        tag: "03 / Community",
                        title: "Our Centers",
                        desc: "Our physical community centers in Hyderabad and rural Telangana serve as hubs for education, organizing, and direct democratic practice.",
                        link: "#centers", linkText: "Jump to Centers"
                    },
                    {
                        tag: "04 / Ecosystem",
                        title: "Sustainable Enterprise",
                        desc: "We incubate and support mission-aligned enterprises that generate value for the commons while sustaining our research independence.",
                        link: "/ecosystem", linkText: "View Ecosystem"
                    }
                ].map((area) => (
                    <div key={area.tag} className="rv" style={{ marginBottom: "var(--section-pad)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "2rem", alignItems: "start", borderTop: "1px solid rgba(24,24,22,0.06)", paddingTop: "3rem" }}>
                        <div>
                            <span className="mono" style={{ fontSize: "0.7rem", color: T.accent, letterSpacing: "0.1em", display: "block", marginBottom: "1rem" }}>{area.tag}</span>
                            <h2 className="serif" style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.1 }}>{area.title}</h2>
                        </div>
                        <div>
                            <p className="body-serif" style={{ fontSize: "1.05rem", color: T.light, lineHeight: 1.7, marginBottom: "2rem" }}>
                                {area.desc}
                            </p>
                            {area.link.startsWith('#') ? (
                                <a href={area.link} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: T.ink, textDecoration: "none", borderBottom: `1px solid ${T.ink}`, paddingBottom: 2 }}>
                                    {area.linkText} &darr;
                                </a>
                            ) : (
                                <Link to={area.link} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: T.ink, textDecoration: "none", borderBottom: `1px solid ${T.ink}`, paddingBottom: 2 }}>
                                    {area.linkText} &rarr;
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* Consolidated Centers Section */}
            <section id="centers" style={{ padding: "var(--section-pad) var(--side-pad)", background: T.offWhite, borderTop: `1px solid rgba(24,24,22,0.05)` }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div className="rv" style={{ marginBottom: "clamp(2rem, 5vw, 4rem)" }}>
                        <span className="mono" style={{ fontSize: "0.7rem", color: T.accent, letterSpacing: "0.1em", display: "block", marginBottom: "1rem" }}>Community Infrastructure</span>
                        <h2 className="serif" style={{ fontSize: "var(--fluid-h1)", marginBottom: "1.5rem", lineHeight: 1.1 }}>Grounded in lived reality.</h2>
                        <p className="body-serif" style={{ fontSize: "1.1rem", lineHeight: 1.8, color: T.light, maxWidth: 800 }}>
                            Our work is anchored in specific geographies and communities. We operate a network of community centers that serve as living laboratories for our research and practice. These physical spaces are where theory meets practice, serving as libraries, digital access points, and meeting grounds for organizing.
                        </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "1.5rem" }}>
                        {centers.map((c) => (
                            <div key={c.location} className="rv" style={{ padding: "min(2.5rem, 8vw)", border: `1px solid rgba(24,24,22,0.1)`, borderRadius: 12, background: T.paper, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: T.accent }}>
                                    <MapPin size={18} />
                                    <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{c.type}</span>
                                </div>
                                <h3 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.8rem" }}>{c.location}</h3>
                                <p className="body-serif" style={{ fontSize: "0.95rem", color: T.mid, lineHeight: 1.6 }}>{c.focus}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
