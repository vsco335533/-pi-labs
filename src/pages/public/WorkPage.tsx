import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { PageHero } from '../../components/NewLayout/PageComponents';

export function Work() {
    const ref = useReveal();
    return (
        <div ref={ref}>
            <PageHero tag="Our Work" title={<>Theory in<br />motion.</>} subtitle="Our work spans four interconnected areas, each informing the others to build a cohesive praxis for the commons." />

            <section style={{ padding: "5rem 2.5rem" }}>
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
                        title: "Centers & Field Work",
                        desc: "Our physical community centers in Hyderabad and rural Telangana serve as hubs for education, organizing, and direct democratic practice.",
                        link: "/centers", linkText: "View Community Centers"
                    },
                    {
                        tag: "04 / Ecosystem",
                        title: "Sustainable Enterprise",
                        desc: "We incubate and support mission-aligned enterprises that generate value for the commons while sustaining our research independence.",
                        link: "/ecosystem", linkText: "View Ecosystem"
                    }
                ].map((area) => (
                    <div key={area.tag} className="rv" style={{ marginBottom: "5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "start", borderTop: "1px solid rgba(24,24,22,0.06)", paddingTop: "3rem" }}>
                        <div>
                            <span className="mono" style={{ fontSize: "0.7rem", color: T.accent, letterSpacing: "0.1em", display: "block", marginBottom: "1rem" }}>{area.tag}</span>
                            <h2 className="serif" style={{ fontSize: "2.2rem", lineHeight: 1.1 }}>{area.title}</h2>
                        </div>
                        <div>
                            <p className="body-serif" style={{ fontSize: "1.05rem", color: T.light, lineHeight: 1.7, marginBottom: "2rem" }}>
                                {area.desc}
                            </p>
                            <Link to={area.link} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: T.ink, textDecoration: "none", borderBottom: `1px solid ${T.ink}`, paddingBottom: 2 }}>
                                {area.linkText} &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
