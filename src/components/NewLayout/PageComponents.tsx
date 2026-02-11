import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { T } from '../NewLayout/GlobalStyles';

interface Props {
    tag: string;
    title: React.ReactNode;
    subtitle?: string;
    dark?: boolean;
    showBack?: boolean;
}

export function BackButton() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem 0",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: T.mid,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "color 0.2s",
                marginBottom: "1rem"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.mid)}
        >
            <ArrowLeft size={16} />
            Back
        </button>
    );
}

export function PageHero({ tag, title, subtitle, dark, showBack = true }: Props) {
    const bg = dark ? T.deepBlack : T.paper;
    const fg = dark ? T.paper : T.ink;
    const sub = dark ? T.stone : T.light;
    return (
        <div style={{ background: bg, padding: "clamp(6rem, 15vw, 10rem) var(--side-pad) clamp(3rem, 8vw, 5rem)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", opacity: 0.02, backgroundImage: `radial-gradient(circle, ${fg} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
            <div style={{ maxWidth: 800, position: "relative", zIndex: 2 }}>
                {showBack && <BackButton />}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.accent, marginBottom: "1.5rem" }}>
                    <span style={{ width: 22, height: 1.5, background: T.accent, display: "inline-block" }} />
                    {tag}
                </div>
                <h1 className="serif" style={{ fontSize: "var(--fluid-h1)", lineHeight: 1.05, letterSpacing: "-0.03em", color: fg, marginBottom: subtitle ? "1.5rem" : 0 }}>
                    {title}
                </h1>
                {subtitle && (
                    <p className="body-serif" style={{ fontSize: "clamp(1rem, 1.4vw, 1.1rem)", color: sub, maxWidth: 600, lineHeight: 1.7, marginTop: "1.5rem" }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

export function SectionTag({ children }: { children: React.ReactNode }) {
    return (
        <div className="rv" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.accent, marginBottom: "1.2rem" }}>
            <span style={{ width: 18, height: 1.5, background: T.accent, display: "inline-block" }} />
            {children}
        </div>
    );
}
