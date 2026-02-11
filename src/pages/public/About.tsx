import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { PageHero, SectionTag } from '../../components/NewLayout/PageComponents';

export function About() {
  const ref = useReveal();
  return (
    <div ref={ref}>
      <PageHero tag="About" title={<>An institution built over<br />a decade of practice.</>} subtitle="Pi Labs Commons Research Foundation is an independent research and practice-oriented institution working at the intersection of social theory, technology, and the commons." />

      <section style={{ padding: "5rem 2.5rem", maxWidth: 760 }}>
        <div className="rv">
          <p className="body-serif" style={{ fontSize: "1.1rem", lineHeight: 1.8, color: T.light, marginBottom: "1.5rem" }}>
            We exist to ask — and practically respond to — a central question of our time: <strong style={{ color: T.ink }}>how can knowledge, technology, and collective life be reorganized beyond extractive, monopolistic, and exclusionary systems?</strong>
          </p>
          <p className="body-serif" style={{ fontSize: "1.05rem", lineHeight: 1.8, color: T.light, marginBottom: "1.5rem" }}>
            The foundation was formally established in 2024, but its intellectual and practical roots stretch back over a decade — through years of grassroots organizing, critical research, technology experimentation, and institution-building in working-class communities.
          </p>
          <p className="body-serif" style={{ fontSize: "1.05rem", lineHeight: 1.8, color: T.light, marginBottom: "1.5rem" }}>
            We are not an NGO, not a consultancy, and not a think-tank detached from society. Pi Labs Commons is a <strong style={{ color: T.ink }}>research and praxis institution</strong> — committed to building knowledge, systems, and institutions by the people, for the people.
          </p>
        </div>
      </section>

      {/* Orientation */}
      <section style={{ padding: "4rem 2.5rem 5rem", background: T.offWhite }}>
        <SectionTag>Our Orientation</SectionTag>
        <h2 className="serif rv" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", lineHeight: 1.12, marginBottom: "2.5rem" }}>
          Commitments, not slogans.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {[
            { title: "Against Extraction", desc: "We reject extractive models of knowledge and technology that concentrate wealth while dispossessing communities." },
            { title: "Against Monopoly", desc: "We oppose monopolization of data, platforms, and infrastructure that forecloses alternatives and democratic control." },
            { title: "Collective Intelligence", desc: "We prioritize collective intelligence over individual heroism — knowledge is social, not proprietary." },
            { title: "Sustained Practice", desc: "Real change emerges from organized, shared, and sustained practice — not from manifestos alone." },
          ].map((item) => (
            <div key={item.title} className="rv" style={{ padding: "2rem 1.75rem", background: T.paper, border: `1px solid rgba(24,24,22,0.05)`, borderBottom: `2px solid transparent`, transition: "all 0.35s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = T.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <h4 className="serif" style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.title}</h4>
              <p style={{ fontSize: "0.88rem", color: T.mid, lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section >

      {/* Timeline */}
      < section style={{
        padding: "5rem 2.5rem", borderTop: `1px solid rgba(24,24,22,0.06)`
      }}>
        <SectionTag>Journey</SectionTag>
        <h2 className="serif rv" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.15, marginBottom: "3rem" }}>
          A decade of building.
        </h2>
        <div style={{ maxWidth: 650 }}>
          {[
            { year: "2015–2018", text: "Early years of grassroots organizing, critical study circles, and engagement with working-class communities and cooperative movements." },
            { year: "2018–2021", text: "Deepening theoretical work in political economy. Experiments with community-based technology and educational models. Early formulations of commons-based institutional design." },
            { year: "2021–2023", text: "Technology experiments in AI and digital systems. Development of offline-first and community-embedded tools. Expanding research into post-capitalist praxis and Indian social formations." },
            { year: "2024", text: "Formal establishment of Pi Labs Commons Research Foundation. Launch of community centers, incubation of mission-aligned enterprises Radius EduTech and Octacomm." },
            { year: "2025–Present", text: "Active publishing through Vanguard journal. Expanding community center network. Continued research, technology experiments, and ecosystem growth." },
          ].map((item) => (
            <div key={item.year} className="rv" style={{ display: "flex", gap: "2rem", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: `1px solid rgba(24,24,22,0.06)` }}>
              <span className="mono" style={{ fontSize: "0.75rem", color: T.accent, letterSpacing: "0.05em", minWidth: 100, flexShrink: 0, paddingTop: 3 }}>{item.year}</span>
              <p className="body-serif" style={{ fontSize: "0.95rem", color: T.light, lineHeight: 1.7 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
