import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { T } from '../components/NewLayout/GlobalStyles';
import { LOGO_SRC } from '../components/NewLayout/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: T.offWhite
    }}>
      <div style={{
        maxWidth: 440,
        width: "100%",
        textAlign: "center"
      }}>
        {/* Logo Area */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{
            width: 80, height: 80, margin: "0 auto 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: T.paper, borderRadius: "50%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
          }}>
            <img
              src={LOGO_SRC}
              alt="Pi LABS"
              style={{ width: 82, height: 82, objectFit: "contain" }}
              draggable="false"
            />
          </div>
          <h1 className="serif" style={{ fontSize: "2rem", color: T.ink, marginBottom: "0.5rem" }}>
            Welcome to Pi Labs
          </h1>
          <p className="body-serif" style={{ color: T.light, fontSize: "1rem" }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: T.paper,
          padding: "2.5rem",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          border: `1px solid rgba(24,24,22,0.06)`
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FCA5A5",
                color: "#991B1B", padding: "0.75rem", borderRadius: 6, fontSize: "0.875rem"
              }}>
                {error}
              </div>
            )}

            <div style={{ textAlign: "left" }}>
              <label htmlFor="email" className="mono" style={{ display: "block", fontSize: "0.75rem", color: T.mid, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", padding: "0.85rem",
                  border: `1px solid ${T.stone}`, borderRadius: 6,
                  fontSize: "1rem", outline: "none", transition: "border 0.3s"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = T.ink}
                onBlur={(e) => e.currentTarget.style.borderColor = T.stone}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label htmlFor="password" className="mono" style={{ display: "block", fontSize: "0.75rem", color: T.mid, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%", padding: "0.85rem",
                  border: `1px solid ${T.stone}`, borderRadius: 6,
                  fontSize: "1rem", outline: "none", transition: "border 0.3s"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = T.ink}
                onBlur={(e) => e.currentTarget.style.borderColor = T.stone}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "0.9rem",
                background: T.ink, color: T.paper,
                border: "none", borderRadius: 6,
                fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em",
                textTransform: "uppercase", cursor: loading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                marginTop: "0.5rem"
              }}
            >
              {loading ? "Signing In..." : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${T.stone}40`, textAlign: "center" }}>
            <p className="mono" style={{ fontSize: "0.7rem", color: T.mid, marginBottom: "0.5rem" }}>DEMO CREDENTIALS:</p>
            <p className="mono" style={{ fontSize: "0.65rem", color: T.light }}>Admin: admin@example.com / password</p>
            <p className="mono" style={{ fontSize: "0.65rem", color: T.light }}>Researcher: researcher@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
