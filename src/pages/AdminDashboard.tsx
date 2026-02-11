import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Eye, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { apiGet, apiPost } from "../lib/api";
import { Post, Profile, ContactSubmission } from "../types";
import { T } from "../components/NewLayout/GlobalStyles";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "researchers" | "responses">("overview");
  const [posts, setPosts] = useState<Post[]>([]);
  const [researchers, setResearchers] = useState<Profile[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsData, researchersData, contactsData] = await Promise.all([
        apiGet("/posts"),
        apiGet("/users?role=researcher"),
        apiGet("/contact")
      ]);

      const posts = Array.isArray(postsData) ? postsData : [];
      const researchersList = Array.isArray(researchersData) ? researchersData : [];
      const contactsList = Array.isArray(contactsData) ? contactsData : [];

      setPosts(posts);
      setResearchers(researchersList);
      setContacts(contactsList);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      await apiPost(`/posts/${postId}/approve`, {});
      loadData();
    } catch (error) {
      console.error("Error approving post:", error);
      alert("Failed to approve post");
    }
  };

  const handleRejectPost = async (postId: string) => {
    const feedback = prompt("Provide feedback for rejection:");
    if (!feedback) return;
    try {
      await apiPost(`/posts/${postId}/reject`, { feedback });
      loadData();
    } catch (error) {
      console.error("Error rejecting post:", error);
      alert("Failed to reject post");
    }
  };

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p: Post) => p.status === "published").length,
    pendingPosts: posts.filter((p: Post) => ["submitted", "under_review"].includes(p.status)).length,
    totalResearchers: researchers.length,
    totalViews: posts.reduce((sum: number, p: Post) => sum + (p.view_count || 0), 0),
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "posts", label: "Posts" },
    { id: "researchers", label: "Researchers" },
    { id: "responses", label: "Responses" },
  ] as const;


  return (
    <div className="min-h-screen" style={{ background: T.paper }}>
      <div style={{ padding: "calc(var(--section-pad) + 60px) var(--side-pad) var(--section-pad)", maxWidth: 1400, margin: "0 auto" }}>

        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem 0",
            marginBottom: "2rem",
            color: T.mid,
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = T.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = T.mid}
        >
          <ArrowLeft size={16} />
          <span>Back to Site</span>
        </button>

        <div style={{ marginBottom: "clamp(2.5rem, 7vw, 4.5rem)" }}> {/* Improved header spacing */}
          <h1 className="serif" style={{ fontSize: "var(--fluid-h1)", marginBottom: "0.5rem", color: T.ink, fontWeight: 700 }}>
            Admin Dashboard
          </h1>
          <p className="body-serif" style={{ color: T.mid, fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)" }}>
            Manage researchers, content, and platform settings
          </p>
        </div>

        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "3rem",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "2px"
        }} className="no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: 4,
                fontSize: "0.8rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                background: activeTab === tab.id ? T.accent : T.offWhite,
                color: activeTab === tab.id ? T.paper : T.mid,
                boxShadow: activeTab === tab.id ? "0 4px 12px rgba(179,61,38,0.2)" : "none",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* STATS SECTION */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(150px, 45%, 250px), 1fr))",
          gap: "1.5rem",
          marginBottom: "clamp(2rem, 5vw, 4rem)"
        }}>
          {[
            { label: "Total Posts", value: stats.totalPosts, icon: FileText, color: T.mid },
            { label: "Published", value: stats.publishedPosts, icon: CheckCircle, color: "#10b981" },
            { label: "Pending", value: stats.pendingPosts, icon: Clock, color: "#f59e0b" },
            { label: "Researchers", value: stats.totalResearchers, icon: Users, color: "#8b5cf6" },
            { label: "Total Views", value: stats.totalViews, icon: Eye, color: "#06b6d4" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: T.paper,
              padding: "1.5rem 2rem",
              borderRadius: 8,
              border: `1px solid ${T.stone}30`,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              boxShadow: "0 2px 15px rgba(0,0,0,0.03)",
              position: "relative"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: T.light, textTransform: "none", letterSpacing: "0.02em" }}>{stat.label}</span>
                <stat.icon size={20} color={stat.color} style={{ opacity: 0.8 }} />
              </div>
              <p style={{ fontSize: "2.2rem", fontWeight: 700, color: T.ink, lineHeight: 1, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: T.paper, borderRadius: 24, border: `1px solid ${T.stone}40`, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
          {activeTab === "overview" && (
            <div>
              <div style={{ padding: "2rem", borderBottom: `1px solid ${T.stone}40` }}>
                <h2 className="serif" style={{ fontSize: "1.5rem", color: T.ink }}>Pending Approval</h2>
              </div>

              <div style={{ width: "100%" }}>
                {loading ? (
                  <div style={{ padding: "5rem", textAlign: "center" }}>
                    <div style={{ width: "2rem", height: "2rem", border: `2px solid ${T.stone}`, borderTopColor: T.ink, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                  </div>
                ) : posts.filter(p => ["submitted", "under_review"].includes(p.status)).length === 0 ? (
                  <div style={{ padding: "5rem", textAlign: "center", color: T.mid, fontWeight: 500 }}>
                    No posts pending approval
                  </div>
                ) : (
                  <div className="table-responsive">
                    <style>{`
                      @media (max-width: 640px) {
                        .hide-mobile { display: none !important; }
                        .admin-table thead { display: none; }
                        .admin-table tr { display: flex; flexDirection: column; padding: 1.5rem; borderBottom: 1px solid ${T.stone}30; }
                        .admin-table td { padding: 0.25rem 0; border: none !important; textAlign: left !important; }
                        .admin-table .actions-cell { marginTop: 1rem; display: flex; gap: 0.5rem; justify-content: flex-start !important; }
                      }
                      @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                    <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead className="hide-mobile" style={{ background: T.offWhite, borderBottom: `1px solid ${T.stone}40` }}>
                        <tr>
                          <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Title</th>
                          <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Type</th>
                          <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                          <th style={{ padding: "1.2rem 2rem", textAlign: "right", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.filter(p => ["submitted", "under_review"].includes(p.status)).map((post) => (
                          <tr key={post.id} style={{ borderBottom: `1px solid ${T.stone}20` }}>
                            <td style={{ padding: "1.5rem 2rem" }}>
                              <div style={{ fontWeight: 600, color: T.ink, marginBottom: "0.25rem" }}>{post.title}</div>
                              <div style={{ fontSize: "0.7rem", color: T.mid }}>{new Date(post.created_at || '').toLocaleDateString()}</div>
                            </td>
                            <td style={{ padding: "1.5rem 2rem", fontSize: "0.75rem", color: T.mid, textTransform: "capitalize" }}>{post.type.replace('_', ' ')}</td>
                            <td style={{ padding: "1.5rem 2rem" }}>
                              <span style={{
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                padding: "0.3rem 0.6rem",
                                borderRadius: 4,
                                background: post.status === "submitted" ? "#fffbeb" : "#eff6ff",
                                color: post.status === "submitted" ? "#92400e" : "#1e40af",
                                letterSpacing: "0.05em"
                              }}>
                                {post.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="actions-cell" style={{ padding: "1.5rem 2rem", textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                <button
                                  onClick={() => handleApprovePost(post.id)}
                                  style={{ padding: "0.5rem 1rem", background: "#059669", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectPost(post.id)}
                                  style={{ padding: "0.5rem 1rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div style={{ padding: "5rem", textAlign: "center", color: T.mid, fontStyle: "italic" }}>
              All platform posts management view coming soon...
            </div>
          )}

          {activeTab === "researchers" && (
            <div style={{ padding: "5rem", textAlign: "center", color: T.mid, fontStyle: "italic" }}>
              Researcher management directory coming soon...
            </div>
          )}

          {activeTab === "responses" && (
            <div>
              <div style={{ padding: "2rem", borderBottom: `1px solid ${T.stone}40` }}>
                <h2 className="serif" style={{ fontSize: "1.5rem", color: T.ink }}>Contact Responses</h2>
              </div>

              <div style={{ width: "100%" }}>
                {loading ? (
                  <div style={{ padding: "5rem", textAlign: "center" }}>
                    <div style={{ width: "2rem", height: "2rem", border: `2px solid ${T.stone}`, borderTopColor: T.ink, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                  </div>
                ) : contacts.length === 0 ? (
                  <div style={{ padding: "5rem", textAlign: "center", color: T.mid, fontWeight: 500 }}>
                    No contact responses found
                  </div>
                ) : (
                  <div className="table-responsive">
                    <style>{`
                      @media (max-width: 640px) {
                        .hide-mobile { display: none !important; }
                        .admin-table thead { display: none; }
                        .admin-table tr { display: flex; flex-direction: column; padding: 1.5rem; border-bottom: 1px solid ${T.stone}30; }
                        .admin-table td { padding: 0.25rem 0; border: none !important; text-align: left !important; width: 100% !important; }
                        .admin-table .actions-cell { margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: flex-start !important; }
                      }
                      @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                    <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead className="hide-mobile" style={{ background: T.offWhite, borderBottom: `1px solid ${T.stone}40` }}>
                        <tr>
                          <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Sender</th>
                          <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Message</th>
                          <th style={{ padding: "1.2rem 2rem", textAlign: "right", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact) => (
                          <tr key={contact.id} style={{ borderBottom: `1px solid ${T.stone}20` }}>
                            <td style={{ padding: "1.5rem 2rem" }}>
                              <div style={{ fontWeight: 600, color: T.ink }}>{contact.name || 'Anonymous'}</div>
                              <div style={{ fontSize: "0.75rem", color: "#2563eb", marginTop: "0.2rem" }}>{contact.email}</div>
                            </td>
                            <td style={{ padding: "1.5rem 2rem" }}>
                              <div style={{ fontSize: "0.9rem", color: T.mid, lineHeight: 1.6, maxWidth: "500px" }}>
                                {contact.message}
                              </div>
                            </td>
                            <td style={{ padding: "1.5rem 2rem", textAlign: "right", fontSize: "0.75rem", color: T.light, whiteSpace: "nowrap" }}>
                              {new Date(contact.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
