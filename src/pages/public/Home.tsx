import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Eye } from 'lucide-react';
import { apiGet } from '../../lib/api';
import { PostWithAuthor } from '../../types';
import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { SectionTag } from '../../components/NewLayout/PageComponents';

export function Home() {
  const ref = useReveal();
  const [latestPosts, setLatestPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestPosts();
  }, []);

  const loadLatestPosts = async () => {
    try {
      const data = await apiGet("/posts?limit=3");
      setLatestPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };
  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="hero-section" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(6rem, 20vh, 10rem) var(--side-pad) 4rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, right: "-5%", width: "50%", height: "100%", opacity: 0.02, backgroundImage: `radial-gradient(circle, ${T.ink} 1px, transparent 1px)`, backgroundSize: "52px 52px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "8%", opacity: 0.025, pointerEvents: "none" }}>
          <span className="serif" style={{ fontSize: "clamp(12rem, 40vw, 28rem)", lineHeight: 1, color: T.ink }}>π</span>
        </div>

        <div style={{ maxWidth: 1100, position: "relative", zIndex: 2 }}>
          <div className="rv hero-tag" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.accent, marginBottom: "2rem" }}>
            <span style={{ width: 24, height: 1.5, background: T.accent, display: "inline-block" }} />
            Research · Praxis · Commons
          </div>

          <h1 className="serif rv hero-heading" style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: "2rem", fontWeight: 900 }}>
            Knowledge and technology<br />
            <em style={{ color: T.accent, fontStyle: "italic", fontWeight: 900 }}>for the many,</em><br />
            <span style={{ display: "inline-block", paddingLeft: "0.15em" }}>not the few.</span>
          </h1>

          <p className="body-serif rv" style={{ fontSize: "clamp(1.02rem, 1.6vw, 1.15rem)", color: T.light, maxWidth: 600, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Pi Labs Commons Research Foundation is an independent research and praxis institution working at the intersection of social theory, technology, and the commons.
          </p>

          <div className="rv" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/work" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2.2rem", background: T.ink, color: T.paper, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", transition: "all 0.35s", textDecoration: "none" }}>
              Explore Our Work &rarr;
            </Link>
            <Link to="/about" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2.2rem", border: `1.5px solid ${T.ink}`, fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", transition: "all 0.35s", textDecoration: "none", color: "inherit" }}>
              About
            </Link>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "2rem", left: "var(--side-pad)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 1.5, height: 36, background: `linear-gradient(to bottom, ${T.accent}, transparent)` }} />
        </div>
      </section >

      {/* Question band */}
      < div style={{ background: T.ink, color: T.paper, padding: "var(--section-pad) var(--side-pad)", textAlign: "center", position: "relative", overflow: "hidden" }
      }>
        <span className="serif" style={{ position: "absolute", fontSize: "clamp(10rem, 30vw, 24rem)", opacity: 0.02, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}>π</span>
        <blockquote className="serif rv" style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)", lineHeight: 1.5, maxWidth: 800, margin: "0 auto", fontStyle: "italic", position: "relative", zIndex: 2 }}>
          "How can knowledge, technology, and collective life be reorganized beyond extractive, monopolistic, and exclusionary systems?"
        </blockquote>
      </div >

      {/* Institutional statement */}
      < div style={{
        padding: "var(--section-pad) var(--side-pad)", borderBottom: `1px solid rgba(24,24,22,0.06)`
      }}>
        <div className="rv" style={{ maxWidth: 720 }}>
          <p className="body-serif" style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", lineHeight: 1.65, color: T.light }}>
            Our research is not abstract scholarship detached from reality. It is <strong style={{ color: T.ink }}>theory grounded in lived conditions</strong>, historical material analysis, and contemporary experiments. Technology, for us, is not neutral. It reflects social relations — and can be redesigned to serve <strong style={{ color: T.ink }}>people, communities, and shared futures.</strong>
          </p>
        </div>
      </div>

      {/* Four pillars preview */}
      <section style={{ padding: "var(--section-pad) var(--side-pad)", background: T.offWhite }}>
        <SectionTag>What We Do</SectionTag>
        <h2 className="serif rv" style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)", lineHeight: 1.1, marginBottom: "1.5rem", fontWeight: 900 }}>
          Theory, experimentation,<br />and grounded practice.
        </h2>
        <p className="rv body-serif" style={{ fontSize: "1rem", color: T.light, maxWidth: 560, lineHeight: 1.7, marginBottom: "3rem" }}>
          Four interconnected areas of work — each informing the others.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(260px, 45vw, 320px), 1fr))", gap: "1.5rem" }}>
          {[
            { n: "01", title: "Research & Publications", desc: "Social theory, political economy, AI, and the commons — grounded in material conditions." },
            { n: "02", title: "Technology Experiments", desc: "AI systems for collective use. Offline-first, community-owned, institution-embedded." },
            { n: "03", title: "Commons & Institutions", desc: "Knowledge commons, digital commons, cooperatives — replicable and durable structures." },
            { n: "04", title: "Community Centers", desc: "Living laboratories in working-class and rural areas where theory meets lived reality." },
          ].map((item) => (
            <Link to="/work" key={item.n} style={{ textDecoration: "none", color: "inherit", display: "flex" }}>
              <div className="rv" style={{ flex: 1, padding: "2.5rem 2.2rem", background: T.paper, border: `1px solid rgba(24,24,22,0.05)`, transition: "all 0.4s", cursor: "pointer", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(0,0,0,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span className="mono" style={{ fontSize: "0.68rem", color: T.accent, letterSpacing: "0.1em", fontWeight: 600 }}>{item.n}</span>
                <h3 className="serif" style={{ fontSize: "1.4rem", margin: "0.75rem 0 0.6rem", lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontSize: "0.92rem", color: T.mid, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST RESEARCH SECTION */}
      <section style={{ padding: "var(--section-pad) var(--side-pad)", borderBottom: `1px solid rgba(24,24,22,0.06)` }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginBottom: "3.5rem"
        }}>
          <div>
            <SectionTag>Latest Insights</SectionTag>
            <h2 className="serif rv" style={{ fontSize: "var(--fluid-h2)", lineHeight: 1.05 }}>
              Research & Field Notes.
            </h2>
          </div>
          <Link to="/publications" className="rv" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: T.ink, textDecoration: "none", borderBottom: `2px solid ${T.accent}`, paddingBottom: "2px" }}>
            View Archive <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: T.mid, fontSize: "0.9rem", fontWeight: 500 }}>Loading updates...</div>
        ) : latestPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", border: `1px dashed ${T.stone}`, borderRadius: 12, color: T.mid }}>No recent publications.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "2.5rem" }}>
            {latestPosts.map(post => (
              <Link key={post.id} to={`/posts/${post.slug}`} className="rv group" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
                <div style={{ aspectRatio: "16/10", background: T.stone, marginBottom: "1.5rem", overflow: "hidden", borderRadius: "8px", position: "relative" }}>
                  {post.featured_image_url && (
                    <img src={post.featured_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  )}
                  <div style={{ position: "absolute", top: 12, left: 12, background: T.paper, padding: "0.35rem 0.75rem", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", borderRadius: "2px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                    {post.type.replace("_", " ")}
                  </div>
                </div>

                <h3 className="serif" style={{ fontSize: "1.5rem", lineHeight: 1.2, marginBottom: "0.8rem", color: T.ink, letterSpacing: "-0.01em" }}>{post.title}</h3>
                <p className="body-serif" style={{ fontSize: "1rem", color: T.mid, lineHeight: 1.6, marginBottom: "1.5rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {post.excerpt}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", color: T.mid, fontWeight: 500, borderTop: `1px solid ${T.stone}40`, paddingTop: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Clock size={12} strokeWidth={2.5} /> {formatDate(post.published_at)}
                  </div>
                  {post.view_count !== undefined && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Eye size={12} strokeWidth={2.5} /> {post.view_count}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Ecosystem teaser */}
      <section style={{ background: T.ink, color: T.paper, padding: "var(--section-pad) var(--side-pad)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, border: `1px solid rgba(242,241,237,0.04)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640 }}>
          <SectionTag>Ecosystem</SectionTag>
          <h2 className="serif rv" style={{ fontSize: "var(--fluid-h2)", color: T.paper, lineHeight: 1.05, marginBottom: "1.5rem" }}>
            Independence through<br />mission-aligned enterprise.
          </h2>
          <p className="body-serif rv" style={{ fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: T.stone, lineHeight: 1.7, marginBottom: "2.5rem" }}>
            Pi Labs Commons runs and incubates mission-aligned companies — generating revenue to sustain research and community work without dependency on grants or ideological compromise.
          </p>
          <Link to="/ecosystem" className="rv" style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", padding: "1rem 2.2rem", border: `1.5px solid rgba(242,241,237,0.2)`, color: T.paper, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.3s", textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(242,241,237,0.6)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(242,241,237,0.2)"}
          >
            Explore Ecosystem &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "var(--section-pad) var(--side-pad)", textAlign: "center", borderTop: `1px solid rgba(24,24,22,0.06)` }}>
        <h2 className="serif rv" style={{ fontSize: "var(--fluid-h3)", lineHeight: 1.15, maxWidth: 640, margin: "0 auto 1.5rem" }}>
          Not an NGO. Not a consultancy.<br />A research and praxis institution.
        </h2>
        <p className="body-serif rv" style={{ fontSize: "1rem", color: T.mid, maxWidth: 480, margin: "0 auto 2.5rem", lineHeight: 1.65 }}>
          Building knowledge, systems, and institutions — by the people, for the people.
        </p>
        <div className="rv" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/contact" style={{ padding: "0.9rem 2.2rem", background: T.ink, color: T.paper, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", borderRadius: "4px" }}>
            Get Involved &rarr;
          </Link>
          <Link to="/publications" style={{ padding: "0.9rem 2.2rem", border: `1.5px solid ${T.ink}`, fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", color: "inherit", borderRadius: "4px" }}>
            Read Our Work
          </Link>
        </div>
      </section>
    </div>
  );
}
