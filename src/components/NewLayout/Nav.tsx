import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LOGO_SRC } from './Logo';
import { T } from './GlobalStyles';
import { useAuth } from '../../contexts/AuthContext';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const path = location.pathname;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    navigate('/');
  };

  const links = [
    { to: "/about", label: "About" },
    { to: "/work", label: "Work" },
    { to: "/centers", label: "Centers" },
    { to: "/ecosystem", label: "Ecosystem" },
    { to: "/publications", label: "Publications" },
    { to: "/videos", label: "Multimedia" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (to: string) => path === to;

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "0.55rem 2.5rem" : "0.85rem 2.5rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        background: scrolled ? "rgba(242,241,237,0.95)" : "rgba(242,241,237,0.8)",
        borderBottom: `1px solid rgba(24,24,22,${scrolled ? 0.06 : 0.03})`,
        transition: "all 0.4s ease",
        boxShadow: scrolled ? "0 1px 30px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.7rem", textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
        <img src={LOGO_SRC} alt="π" style={{ height: scrolled ? 34 : 40, width: scrolled ? 34 : 40, objectFit: "contain", transition: "all 0.3s" }} />
        <span className="serif" style={{
          fontSize: "clamp(0.85rem, 1.2vw + 0.5rem, 1.1rem)",
          letterSpacing: "-0.01em",
          fontWeight: 600,
          whiteSpace: "nowrap"
        }}>
          Pi Labs Commons Research Foundation
        </span>
      </Link>

      {/* Desktop links */}
      <div style={{
        display: "flex",
        gap: "clamp(0.4rem, 0.9vw, 1.5rem)",
        alignItems: "center"
      }} className="nav-desktop hidden lg:flex">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              fontSize: "clamp(0.65rem, 0.75vw, 0.77rem)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: isActive(l.to) ? T.ink : T.mid,
              borderBottom: isActive(l.to) ? `1.5px solid ${T.accent}` : "1.5px solid transparent",
              paddingBottom: "2px",
              transition: "all 0.3s",
              textDecoration: "none",
              whiteSpace: "nowrap"
            }}
          >
            {l.label}
          </Link>
        ))}

        {/* Auth Link */}
        {user ? (
          <div style={{
            display: "flex",
            gap: "clamp(0.4rem, 0.8vw, 1rem)",
            alignItems: "center",
            borderLeft: `1px solid ${T.stone}`,
            paddingLeft: "clamp(0.4rem, 0.8vw, 1rem)",
            flexShrink: 0
          }}>
            <Link
              to="/dashboard"
              style={{
                fontSize: "clamp(0.65rem, 0.75vw, 0.77rem)",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase", color: T.accent, textDecoration: "none",
                whiteSpace: "nowrap"
              }}
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                fontSize: "clamp(0.65rem, 0.75vw, 0.77rem)",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase", color: T.mid, background: "none", border: "none", cursor: "pointer",
                padding: 0,
                whiteSpace: "nowrap"
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              fontSize: "clamp(0.65rem, 0.75vw, 0.77rem)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: isActive("/login") ? T.ink : T.mid,
              textDecoration: "none",
              whiteSpace: "nowrap",
              padding: "0.35rem 0.75rem",
              border: `1px solid ${isActive("/login") ? T.ink : T.stone}`,
              borderRadius: "4px"
            }}
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Hamburger */}
      <button
        className="nav-hamburger lg:hidden flex"
        onClick={() => setOpen(!open)}
        style={{
          flexDirection: "column", gap: 5, background: "none",
          border: "none", cursor: "pointer", padding: 4,
          flexShrink: 0
        }}
        aria-label="Menu"
      >
        <span style={{ width: 22, height: 1.5, background: T.ink, transition: "all 0.3s", transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
        <span style={{ width: 22, height: 1.5, background: T.ink, transition: "all 0.3s", opacity: open ? 0 : 1 }} />
        <span style={{ width: 22, height: 1.5, background: T.ink, transition: "all 0.3s", transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "rgba(242,241,237,0.98)", backdropFilter: "blur(20px)",
            padding: "1.5rem 2.5rem", display: "flex", flexDirection: "column", gap: "1rem",
            borderBottom: `1px solid rgba(24,24,22,0.06)`,
          }}
        >
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              style={{ fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: isActive(l.to) ? T.ink : T.mid, textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ width: "100%", height: 1, background: T.stone, margin: "0.5rem 0" }} />
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: T.accent, textDecoration: "none" }}>
                Dashboard
              </Link>
              <button onClick={(e) => { handleSignOut(e); setOpen(false); }} style={{ textAlign: "left", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: T.mid, background: "none", border: "none" }}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} style={{ fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: T.ink, textDecoration: "none" }}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
