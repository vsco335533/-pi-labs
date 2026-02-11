import { useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { PageHero } from '../../components/NewLayout/PageComponents';
import { apiPost } from '../../lib/api';

export function Contact() {
  const ref = useReveal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/contact", { name, email, message });
      alert("Thanks — your message was sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      alert(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "1rem",
    background: "transparent",
    border: `1px solid ${T.stone}`,
    borderRadius: 0,
    color: T.ink,
    fontFamily: "inherit",
    fontSize: "0.95rem",
    marginBottom: "1.5rem",
    transition: "border-color 0.3s ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "0.5rem",
    color: T.mid,
  };

  return (
    <div ref={ref}>
      <PageHero tag="Connect" title={<>Join the<br />collective effort.</>} subtitle="We are always looking for collaborators, researchers, technologists, and organizers who share our vision." />

      <section className="rv" style={{ padding: "0 2.5rem 6rem", maxWidth: 1200, margin: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>

          {/* Left Column: Context + Details */}
          <div>
            <p className="body-serif" style={{ fontSize: "1.25rem", lineHeight: 1.6, color: T.light, marginBottom: "3rem" }}>
              Whether you are interested in contributing to our research, volunteering at a community center, or exploring partnerships with our ecosystem enterprises, we want to hear from you.
            </p>

            <div style={{ marginBottom: "3rem" }}>
              <h4 className="serif" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Visit Us</h4>
              <p className="body-serif" style={{ fontSize: "1.1rem", color: T.light, lineHeight: 1.6 }}>
                Mithra Hills, Hyder Nagar<br />
                Hyderabad, India - 500072
              </p>
            </div>

            <div style={{ marginBottom: "3rem" }}>
              <h4 className="serif" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Email</h4>
              <a href="mailto:hello@commonscollective.cc" className="mono" style={{ fontSize: "1rem", color: T.accent, textDecoration: "none" }}>
                hello@commonscollective.cc
              </a>
            </div>

            <div>
              <h4 className="serif" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Social</h4>
              <div style={{ display: "flex", gap: "1rem" }}>
                {['LinkedIn', 'Instagram'].map(platform => (
                  <a key={platform} href="#" style={{
                    padding: "0.5rem 1.5rem",
                    border: `1px solid ${T.stone}`,
                    color: T.ink,
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    transition: "all 0.2s"
                  }}>
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div style={{ background: T.offWhite, padding: "3rem", border: `1px solid rgba(0,0,0,0.05)` }}>
            <h3 className="serif" style={{ fontSize: "2rem", marginBottom: "2rem" }}>Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  style={inputStyle}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                />
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 150, resize: "vertical" }}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: T.ink,
                  color: T.paper,
                  border: "none",
                  fontSize: "1rem",
                  cursor: loading ? "wait" : "pointer",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.2s"
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
