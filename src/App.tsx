import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// New Layout
import { GlobalStyles } from "./components/NewLayout/GlobalStyles";
import { Nav } from "./components/NewLayout/Nav";
import { Footer } from "./components/NewLayout/Footer";

// Legacy Layout
import { LegacyLayout } from "./components/LegacyLayout";

// New Pages
import { Home } from "./pages/public/Home";
import { About } from "./pages/public/About";
import { Work } from "./pages/public/WorkPage";
import { Centers } from "./pages/public/Centers";
import { Ecosystem } from "./pages/public/EcosystemPage";
import { Publications } from "./pages/public/PublicationsPage";
import { Videos } from "./pages/public/VideosPage";
import { Gallery } from "./pages/public/GalleryPage";
import { Contact } from "./pages/public/Contact";

// Existing Pages
import { PostDetail } from "./pages/PostDetail";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ResearcherDashboard } from "./pages/ResearcherDashboard";
import { PostEditor } from "./pages/PostEditor";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <GlobalStyles />
          <ScrollToTop />
          <Routes>
            {/* Public Routes - New Design */}
            <Route path="/" element={<><Nav /><Home /><Footer /></>} />
            <Route path="/about" element={<><Nav /><About /><Footer /></>} />
            <Route path="/work" element={<><Nav /><Work /><Footer /></>} />
            <Route path="/centers" element={<><Nav /><Centers /><Footer /></>} />
            <Route path="/ecosystem" element={<><Nav /><Ecosystem /><Footer /></>} />
            <Route path="/publications" element={<><Nav /><Publications /><Footer /></>} />
            <Route path="/videos" element={<><Nav /><Videos /><Footer /></>} />
            <Route path="/gallery" element={<><Nav /><Gallery /><Footer /></>} />
            <Route path="/contact" element={<><Nav /><Contact /><Footer /></>} />

            {/* Single Post - New Design Wrapper */}
            <Route path="/posts/:slug" element={<><Nav /><div style={{ paddingTop: 80 }}><PostDetail /></div><Footer /></>} />

            {/* Auth */}
            <Route path="/login" element={<><Nav /><div style={{ paddingTop: 80 }}><Login /></div><Footer /></>} />

            {/* Dashboard / Admin - Legacy Layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <LegacyLayout>
                  <ResearcherDashboard />
                </LegacyLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/new-post" element={
              <ProtectedRoute>
                <LegacyLayout>
                  <PostEditor />
                </LegacyLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/edit/:id" element={
              <ProtectedRoute>
                <LegacyLayout>
                  <PostEditor />
                </LegacyLayout>
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <LegacyLayout>
                  <AdminDashboard />
                </LegacyLayout>
              </ProtectedRoute>
            } />

            {/* Fallback for old routes or 404 */}
            <Route path="*" element={<><Nav /><div style={{ padding: "10rem 2rem", textAlign: "center" }}>Page not found</div><Footer /></>} />

          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
