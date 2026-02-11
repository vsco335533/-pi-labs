export const T = {
  ink: "#181816",
  paper: "#f2f1ed",
  warm: "#eae8e1",
  stone: "#b8b5ab",
  mid: "#7a776d",
  light: "#3d3b35",
  accent: "#b33d26",
  accentDark: "#8c2f1d",
  offWhite: "#fafaf8",
  deepBlack: "#0e0e0d",
};

export const GlobalStyles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&family=Libre+Franklin:wght@300;400;500;600&display=swap');

/* Fluid Typography & Spacing */
:root {
  --fluid-h1: clamp(2.4rem, 8vw, 5rem);
  --fluid-h2: clamp(1.8rem, 5vw, 2.8rem);
  --fluid-h3: clamp(1.4rem, 3.5vw, 1.8rem);
  --fluid-body: clamp(0.95rem, 1.2vw, 1.15rem);
  --section-pad: clamp(3rem, 10vw, 8rem);
  --side-pad: clamp(1.5rem, 5vw, 4rem);
}

*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
}

/* Hide scrollbar UI but allow scrolling */
*::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

body {
  font-family: 'Libre Franklin', sans-serif;
  background: ${T.paper};
  color: ${T.ink};
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  font-size: var(--fluid-body);
}
::selection { background: ${T.accent}; color: white; }

.serif { font-family: 'Playfair Display', serif; }
.body-serif { font-family: 'Source Serif 4', serif; }
.mono { font-family: 'JetBrains Mono', monospace; }

/* Responsive Utilities */
.hidden-mobile {
  @media (max-width: 768px) { display: none !important; }
}
.hidden-desktop {
  @media (min-width: 1025px) { display: none !important; }
}
.hidden-tablet {
  @media (max-width: 1024px) { display: none !important; }
}
.hidden-desktop-small {
  @media (max-width: 1200px) { display: none !important; }
}

/* Reveal animation */
.rv { opacity: 0; transform: translateY(16px); transition: all 0.65s cubic-bezier(0.22, 1, 0.36, 1); }
.rv.vis { opacity: 1; transform: translateY(0); }

/* Grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
  `}</style>
);
