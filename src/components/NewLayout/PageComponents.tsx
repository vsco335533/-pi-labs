import { T } from '../NewLayout/GlobalStyles';

interface Props {
    tag: string;
    title: React.ReactNode;
    subtitle?: string;
    dark?: boolean;
}

export function PageHero({ tag, title, subtitle, dark }: Props) {
    const bg = dark ? T.deepBlack : T.paper;
    const fg = dark ? T.paper : T.ink;
    const sub = dark ? T.stone : T.light;
    return (
        <div style={{ background: bg, padding: "10rem 2.5rem 5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: "40%", height: "100%", opacity: 0.02, backgroundImage: `radial-gradient(circle, ${fg} 1px, transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />
            <div style={{ maxWidth: 800, position: "relative", zIndex: 2 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.accent, marginBottom: "1.5rem" }}>
                    <span style={{ width: 22, height: 1.5, background: T.accent, display: "inline-block" }} />
                    {tag}
                </div>
                <h1 className="serif" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: fg, marginBottom: subtitle ? "1.5rem" : 0 }}>
                    {title}
                </h1>
                {subtitle && (
                    <p className="body-serif" style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", color: sub, maxWidth: 580, lineHeight: 1.75 }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

export function SectionTag({ children }: { children: React.ReactNode }) {
    return (
        <div className="rv" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: T.accent, marginBottom: "1.2rem" }}>
            <span style={{ width: 18, height: 1.5, background: T.accent, display: "inline-block" }} />
            {children}
        </div>
    );
}
