import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Edit, Trash2, Eye, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiGet, apiDelete } from "../lib/api";
import { Post } from "../types";
import { T } from "../components/NewLayout/GlobalStyles";

export function ResearcherDashboard() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    views: 0,
  });

  useEffect(() => {
    if (profile) {
      loadPosts();
    }
  }, [profile]);

  const loadPosts = async () => {
    try {
      const rawData = await apiGet(`/posts?author_id=${profile?.id}`);
      const data = Array.isArray(rawData) ? rawData : [];

      setPosts(data);

      const total = data.length;
      const published = data.filter((p: Post) => p.status === "published")
        .length;
      const draft = data.filter((p: Post) => p.status === "draft").length;
      const views = data.reduce(
        (sum: number, p: Post) => sum + (p.view_count || 0),
        0
      );

      setStats({ total, published, draft, views });
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await apiDelete(`/posts/${id}`);                                                    //
      loadPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };


  return (
    <div className="min-h-screen" style={{ background: T.paper }}>
      <div style={{ padding: "calc(var(--section-pad) + 60px) var(--side-pad) var(--section-pad)", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="serif" style={{ fontSize: "var(--fluid-h1)", marginBottom: "0.5rem", color: T.ink }}>
            My Dashboard
          </h1>
          <p className="body-serif" style={{ color: T.mid }}>
            Manage your research publications and content
          </p>
        </div>

        {/* Stats Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "4rem"
        }}>
          {[
            { label: "Total Posts", value: stats.total, icon: FileText, color: T.mid },
            { label: "Published", value: stats.published, icon: FileText, color: "#10b981" },
            { label: "Drafts", value: stats.draft, icon: Clock, color: T.light },
            { label: "Total Views", value: stats.views, icon: Eye, color: "#8b5cf6" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: T.offWhite,
              padding: "2rem",
              borderRadius: 16,
              border: `1px solid ${T.stone}40`,
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
                <stat.icon size={18} color={stat.color} />
              </div>
              <p style={{ fontSize: "2.5rem", fontWeight: 700, color: T.ink, lineHeight: 1 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Posts Section */}
        <div style={{ background: T.paper, borderRadius: 24, border: `1px solid ${T.stone}40`, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
          <div style={{ padding: "2rem", borderBottom: `1px solid ${T.stone}40`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
            <h2 className="serif" style={{ fontSize: "1.5rem", color: T.ink }}>My Publications</h2>
            <Link
              to="/dashboard/new-post"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: T.ink,
                color: T.paper,
                padding: "0.8rem 1.5rem",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={18} />
              New Publication
            </Link>
          </div>

          <div style={{ width: "100%" }}>
            {loading ? (
              <div style={{ padding: "5rem", textAlign: "center" }}>
                <div style={{ width: "2rem", height: "2rem", border: `2px solid ${T.stone}`, borderTopColor: T.ink, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : posts.length === 0 ? (
              <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
                <div style={{ background: T.offWhite, width: "4rem", height: "4rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <FileText size={24} color={T.stone} />
                </div>
                <p style={{ color: T.mid, marginBottom: "2rem", maxWidth: "300px", margin: "0 auto 2rem" }}>
                  You haven't created any research publications yet.
                </p>
                <Link
                  to="/dashboard/new-post"
                  style={{ color: T.ink, fontWeight: 700, textDecoration: "none", borderBottom: `2px solid ${T.ink}` }}
                >
                  Create your first post
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <style>{`
                  @media (max-width: 640px) {
                    .hide-mobile { display: none !important; }
                    .dashboard-table thead { display: none; }
                    .dashboard-table tr { display: flex; flexDirection: column; padding: 1.5rem; borderBottom: 1px solid ${T.stone}30; }
                    .dashboard-table td { padding: 0.25rem 0; border: none !important; }
                    .dashboard-table .actions-cell { marginTop: 1rem; display: flex; gap: 1rem; }
                  }
                `}</style>
                <table className="dashboard-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead className="hide-mobile" style={{ background: T.offWhite, borderBottom: `1px solid ${T.stone}40` }}>
                    <tr>
                      <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Title</th>
                      <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Type</th>
                      <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                      <th style={{ padding: "1.2rem 2rem", textAlign: "left", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Views</th>
                      <th style={{ padding: "1.2rem 2rem", textAlign: "right", fontSize: "0.65rem", fontWeight: 700, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} style={{ borderBottom: `1px solid ${T.stone}20` }}>
                        <td style={{ padding: "1.5rem 2rem" }}>
                          <div style={{ fontWeight: 600, color: T.ink, marginBottom: "0.25rem" }}>{post.title}</div>
                          <div style={{ fontSize: "0.7rem", color: T.mid }}>{new Date(post.created_at).toLocaleDateString()}</div>
                        </td>

                        <td style={{ padding: "1.5rem 2rem" }}>
                          <span style={{ fontSize: "0.75rem", color: T.mid, textTransform: "capitalize" }}>{post.type.replace("_", " ")}</span>
                        </td>

                        <td style={{ padding: "1.5rem 2rem" }}>
                          <span style={{
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "0.3rem 0.6rem",
                            borderRadius: 4,
                            background: post.status === "published" ? "#ecfdf5" : "#f3f4f6",
                            color: post.status === "published" ? "#065f46" : "#374151",
                            letterSpacing: "0.05em"
                          }}>
                            {post.status.replace("_", " ")}
                          </span>
                        </td>

                        <td style={{ padding: "1.5rem 2rem", fontSize: "0.85rem", color: T.mid, fontWeight: 500 }}>
                          {post.view_count || 0}
                        </td>

                        <td className="actions-cell" style={{ padding: "1.5rem 2rem", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                            <Link
                              to={`/dashboard/edit/${post.slug}`}
                              style={{ color: T.mid, padding: "0.5rem", borderRadius: 4, transition: "background 0.2s" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = T.offWhite)}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                            >
                              <Edit size={16} />
                            </Link>

                            <button
                              onClick={() => handleDelete(post.id)}
                              style={{ color: T.mid, background: "none", border: "none", cursor: "pointer", padding: "0.5rem", borderRadius: 4, transition: "color 0.2s, background 0.2s" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#ef4444";
                                e.currentTarget.style.background = "#fef2f2";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = T.mid;
                                e.currentTarget.style.background = "none";
                              }}
                            >
                              <Trash2 size={16} />
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
      </div>
    </div>
  );
}
