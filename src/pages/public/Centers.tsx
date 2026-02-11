import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { PageHero } from '../../components/NewLayout/PageComponents';
import { MapPin } from 'lucide-react'; // Assuming lucide-react is available

export function Centers() {
    const ref = useReveal();
    const centers = [
        { location: "Siddipet District", type: "Rural Research Station", focus: "Agrarian commons, rural technology, and cooperative farming models." },
        { location: "Hyderabad (Old City)", type: "Urban Praxis Lab", focus: "Urban commons, gig economy worker organizing, and digital literacy." },
        { location: "North Telangana", type: "Field Office", focus: "Adivasi rights, environmental commons, and indigenous knowledge systems." },
    ];

    return (
        <div ref={ref}>
            <PageHero tag="Centers" title={<>Grounded in<br />lived reality.</>} subtitle="Our work is anchored in specific geographies and communities. We operate network of community centers that serve as living laboratories for our research and practice." />

            <section style={{ padding: "5rem 2.5rem" }}>
                <div className="rv" style={{ marginBottom: "4rem" }}>
                    <p className="body-serif" style={{ fontSize: "1.1rem", lineHeight: 1.8, color: T.light, maxWidth: 800 }}>
                        Pi Labs Commons Community Centers are physical spaces where theory meets practice. They serve as:
                        <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", marginTop: "1rem", color: T.ink }}>
                            <li style={{ marginBottom: "0.5rem" }}>Libraries and study circles for working-class youth.</li>
                            <li style={{ marginBottom: "0.5rem" }}>Access points for sovereign digital infrastructure.</li>
                            <li style={{ marginBottom: "0.5rem" }}>Meeting grounds for community organizing and cooperative planning.</li>
                        </ul>
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                    {centers.map((c) => (
                        <div key={c.location} className="rv" style={{ padding: "2rem", border: `1px solid rgba(24,24,22,0.1)`, borderRadius: 4, background: T.offWhite }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: T.accent }}>
                                <MapPin size={18} />
                                <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{c.type}</span>
                            </div>
                            <h3 className="serif" style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{c.location}</h3>
                            <p className="body-serif" style={{ fontSize: "0.95rem", color: T.mid, lineHeight: 1.6 }}>{c.focus}</p>
                        </div>
                    ))}
                </div>
            </section >
        </div >
    );
}
