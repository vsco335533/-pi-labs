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
  const { user, signOut, isAdmin, isResearcher, profile } = useAuth();
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
    { to: "/ecosystem", label: "Ecosystem" },
    { to: "/publications", label: "Publications" },
    { to: "/videos", label: "Multimedia" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (to: string) => path === to;

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "0.6rem var(--side-pad)" : "1rem var(--side-pad)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        backdropFilter: open ? "none" : "blur(24px)",
        WebkitBackdropFilter: open ? "none" : "blur(24px)",
        background: open ? "#f2f1ed" : (scrolled ? "rgba(242,241,237,0.95)" : "rgba(242,241,237,0.8)"),
        borderBottom: `1px solid rgba(24, 24, 22, ${scrolled ? 0.06 : 0.03})`,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: scrolled ? "0 1px 30px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <Link to="/" style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: 'none',
        color: 'inherit',
        flexShrink: 0,
        zIndex: 1100,
        marginRight: "0.5rem"
      }}>
        <img src={LOGO_SRC} alt="π" style={{ height: scrolled ? 34 : 40, width: scrolled ? 34 : 40, objectFit: "contain", transition: "all 0.3s", flexShrink: 0 }} />
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          alignItems: "flex-start",
          minWidth: 0
        }}>
          <span className="serif" style={{
            fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
            fontWeight: 800,
            color: T.ink,
            lineHeight: 1,
            letterSpacing: "-0.01em"
          }}>
            Pi Labs
          </span>
          <span style={{
            background: T.ink,
            color: T.paper,
            padding: "2px 5px",
            fontSize: "clamp(0.55rem, 0.65vw, 0.7rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            borderRadius: "2px",
            lineHeight: 1.1
          }}>
            Commons Research Foundation
          </span>
        </div>
      </Link>

      <div className="hidden-desktop-small" style={{
        display: "flex",
        gap: "clamp(1.2rem, 1.8vw, 2.5rem)",
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end",
        padding: "0 2.5rem"
      }}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link ${isActive(l.to) ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="hidden-desktop-small" style={{
        display: "flex",
        alignItems: "center",
        gap: "1.2rem",
        marginLeft: "auto",
        flexShrink: 0
      }}>
        {user ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: isResearcher ? "1rem" : "1.5rem",
            borderLeft: `1px solid ${T.stone}30`,
            paddingLeft: isResearcher ? "1.2rem" : "1.8rem",
            flexShrink: 0
          }}>
            {isResearcher ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="nav-link"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="nav-link active"
                  style={{ color: T.accent }}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                style={{
                  fontSize: "1rem", // "Somewhat big"
                  fontWeight: 700,
                  color: T.ink,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
                onMouseLeave={(e) => e.currentTarget.style.color = T.ink}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: T.accent, color: T.paper,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800
                }}>
                  {profile?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="serif" style={{ fontSize: "1.05rem" }}>
                  {profile?.full_name?.split(' ')[0] || "User"}'s Space
                </span>
              </Link>
            )}

            <button
              onClick={handleSignOut}
              className="nav-link"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: 0,
                marginLeft: isResearcher ? "0.5rem" : "1rem",
                opacity: 0.8
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{
              fontSize: "0.82rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: T.paper,
              background: T.ink,
              textDecoration: "none",
              whiteSpace: "nowrap",
              padding: "0.5rem 1.4rem",
              borderRadius: "4px",
              transition: "all 0.3s"
            }}
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          flexDirection: "column", gap: 6, background: open ? "rgba(24,24,22,0.05)" : "none",
          border: "none", cursor: "pointer",
          padding: "12px",
          borderRadius: "12px",
          zIndex: 1100,
          position: "relative",
          transition: "all 0.3s",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          flexShrink: 0
        }}
        className="hidden-desktop"
        aria-label="Menu"
      >
        <span style={{ width: 22, height: 2, background: T.ink, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", transform: open ? "translateY(8px) rotate(45deg)" : "none" }} />
        <span style={{ width: open ? 22 : 14, height: 2, background: T.ink, transition: "all 0.3s ease", opacity: open ? 0 : 1, alignSelf: "flex-end" }} />
        <span style={{ width: 22, height: 2, background: T.ink, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", transform: open ? "translateY(-8px) rotate(-45deg)" : "none" }} />
      </button>

      {/* Mobile Menu Drawer */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, left: 0,
          background: "rgba(24,24,22,0.4)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.5s ease",
          zIndex: 1050
        }}
        onClick={() => setOpen(false)}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%", // Full width for mobile to ensure no bleed on sides
          maxWidth: "450px",
          height: "100dvh", // Use dynamic viewport height
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${open ? '0' : '100%'})`,
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 10000,
          visibility: open ? "visible" : "hidden",
          backgroundColor: "#f2f1ed", // Solid background on the container itself
          boxShadow: "-10px 0 50px rgba(0,0,0,0.2)",
          overflowY: "auto",
          overscrollBehavior: "contain"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: "1.2rem 1.5rem 1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(24,24,22,0.05)",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <img src={LOGO_SRC} alt="π" style={{ height: 32, width: 32, objectFit: "contain" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <span className="serif" style={{ fontSize: "0.95rem", fontWeight: 800, color: T.ink, lineHeight: 1 }}>
                Pi Labs
              </span>
              <span style={{
                background: T.ink,
                color: T.paper,
                padding: "1px 4px",
                fontSize: "0.55rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                borderRadius: "2px"
              }}>
                Commons Research Foundation
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(24,24,22,0.04)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              outline: "none",
              WebkitTapHighlightColor: "transparent"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(24,24,22,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(24,24,22,0.04)"}
            aria-label="Close menu"
          >
            <div style={{ position: "relative", width: 14, height: 14 }}>
              <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 1.5, background: "#181816", transform: "rotate(45deg)", borderRadius: 1 }} />
              <span style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 1.5, background: "#181816", transform: "rotate(-45deg)", borderRadius: 1 }} />
            </div>
          </button>
        </div>

        <div style={{ padding: "1rem 2.5rem 2.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  fontWeight: 700,
                  color: isActive(l.to) ? "#b33d26" : "#181816",
                  textDecoration: "none",
                  transform: `translateX(${open ? '0' : '40px'})`,
                  opacity: open ? 1 : 0,
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.05}s`,
                  letterSpacing: "-0.03em",
                  display: "block",
                  padding: "0.2rem 0"
                }}
                className="serif"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: `1px solid ${T.stone}30` }}>
            {user ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {!isResearcher && (
                  <div style={{ paddingBottom: "0.5rem", borderBottom: `1px solid ${T.stone}20`, marginBottom: "0.5rem" }}>
                    <div className="serif" style={{ fontSize: "1.2rem", fontWeight: 700, color: T.ink }}>
                      {profile?.full_name || "Welcome Back"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: T.mid, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
                      Regular User Account
                    </div>
                  </div>
                )}

                {isResearcher ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: T.ink,
                          textDecoration: "none",
                          opacity: open ? 1 : 0,
                          transition: "all 0.5s ease 0.55s"
                        }}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: T.accent,
                        textDecoration: "none",
                        opacity: open ? 1 : 0,
                        transition: "all 0.5s ease 0.6s"
                      }}
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: T.accent,
                      textDecoration: "none",
                      opacity: open ? 1 : 0,
                      transition: "all 0.5s ease 0.6s"
                    }}
                    className="serif"
                  >
                    My Dashboard
                  </Link>
                )}

                <button
                  onClick={(e) => { handleSignOut(e); setOpen(false); }}
                  style={{
                    textAlign: "left",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: T.mid,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    opacity: open ? 1 : 0,
                    transition: "all 0.5s ease 0.65s",
                    marginTop: isResearcher ? 0 : "0.5rem"
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "1.2rem",
                  background: T.ink,
                  color: T.paper,
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  opacity: open ? 1 : 0,
                  transition: "all 0.5s ease 0.6s"
                }}
              >
                Sign In
              </Link>
            )}

            <div style={{
              marginTop: "2.5rem",
              fontSize: "0.6rem",
              color: T.stone,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 600
            }}>
              © 2024 Pi Labs Commons Foundation
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
