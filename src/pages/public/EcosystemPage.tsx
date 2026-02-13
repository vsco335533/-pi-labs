import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { PageHero } from '../../components/NewLayout/PageComponents';

export function Ecosystem() {
    const ref = useReveal();
    return (
        <div ref={ref}>
            <PageHero tag="Ecosystem" title={<>Independence<br />by design.</>} subtitle="To maintain true intellectual and political independence, we do not rely on grants that come with ideological strings. We build self-sustaining enterprises." />

            <section style={{ padding: "5rem 2.5rem" }}>
                <div className="rv" style={{ marginBottom: "4rem" }}>
                    <p className="body-serif" style={{ fontSize: "1.1rem", lineHeight: 1.8, color: T.light, maxWidth: 800 }}>
                        Our ecosystem consists of mission-aligned companies that operate on cooperative principles. They provide services to the market while generating surplus that funds the foundation's research and community work.
                    </p>
                </div>

                <div style={{ display: "grid", gap: "3rem" }}>
                    {[
                        {
                            name: "Radius EduTech",
                            type: "Education Technology",
                            desc: "Building sovereign educational infrastructure for schools in the Global South. Open source, offline-first, and privacy-respecting learning management systems.",
                            status: "Active"
                        },
                        {
                            name: "Octacomm",
                            type: "Digital Services Cooperative",
                            desc: "A worker-owned cooperative providing high-end software development, design, and digital strategy services to ethical organizations and progressive movements.",
                            status: "Active"
                        },
                        // {
                        //     name: "Vanguard Journal",
                        //     type: "Publishing House",
                        //     desc: "An independent publishing house for radical social theory and commons-based research. Producing books, journals, and digital media.",
                        //     status: "Active"
                        // }
                    ].map((org) => (
                        <div key={org.name} className="rv" style={{ padding: "2.5rem", background: T.offWhite, borderRadius: 4, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                            <div>
                                <span className="mono" style={{ fontSize: "0.65rem", color: T.accent, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>{org.type}</span>
                                <h3 className="serif" style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{org.name}</h3>
                                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: T.mid, background: T.paper, padding: "0.2rem 0.6rem", borderRadius: 4 }}>{org.status}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <p className="body-serif" style={{ fontSize: "1rem", color: T.light, lineHeight: 1.6 }}>{org.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}