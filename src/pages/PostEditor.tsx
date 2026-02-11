import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send } from "lucide-react";
import { apiGet, apiPost, apiPut, apiUpload } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Category } from "../types";
import { T } from "../components/NewLayout/GlobalStyles";

export function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    type: "research" as "research" | "field_study" | "opinion",
    category_id: "",
    author_name: "",
    featured_image_url: "",        // manual URL
    document_url: "",              // manual single PDF URL
    document_urls: [] as string[], // uploaded PDFs
  });

  /* ===============================
     LOAD
  ================================ */

  useEffect(() => {
    loadCategories();
    if (id) loadPost();
  }, [id]);

  const loadCategories = async () => {
    const data = await apiGet("/categories");
    setCategories(data || []);
  };

  const loadPost = async () => {
    const data = await apiGet(`/posts/${id}`);
    setFormData({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || "",
      type: data.type,
      category_id: data.category_id || "",
      author_name: data.author_name || "",
      featured_image_url: data.featured_image_url || "",
      document_url: data.document_url || "",
      document_urls: data.document_urls || [],
    });
  };

  /* ===============================
     CLOUDINARY UPLOADS
  ================================ */

  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    setUploadingImage(true);

    const res = await apiUpload<{ url: string }>("/media/upload", form);

    setFormData(prev => ({
      ...prev,
      featured_image_url: res.url,
    }));

    setUploadingImage(false);
  };


  /* ===============================
     SAVE
  ================================ */

  const handleSave = async (status: "draft" | "submitted") => {
    if (!profile) return navigate("/login");

    setLoading(true);

    try {
      // 1️⃣ CREATE POST FIRST
      const postRes = id
        ? await apiPut(`/posts/${id}`, { ...formData, status })
        : await apiPost("/posts", { ...formData, status });

      const postId = postRes.post.id;

      // 2️⃣ UPLOAD PDFs WITH post_id
      for (const file of pdfFiles) {
        const form = new FormData();
        form.append("file", file);
        form.append("post_id", postId);

        await apiUpload("/media/upload", form);
      }

      // 3️⃣ CLEAR PDFs
      setPdfFiles([]);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to save post");
    } finally {
      setLoading(false);
    }
  };



  /* ===============================
     UI
  ================================ */

  return (
    <div style={{ background: T.paper, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "var(--section-pad) var(--side-pad)" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="serif" style={{ fontSize: "var(--fluid-h1)", marginBottom: "0.5rem", color: T.ink }}>
            {id ? "Edit Publication" : "New Publication"}
          </h1>
          <p className="body-serif" style={{ color: T.mid }}>
            {id ? "Update your research content and settings" : "Share your latest research with the community"}
          </p>
        </div>

        <div style={{ background: T.paper, borderRadius: 24, padding: "clamp(1.5rem, 5vw, 4rem)", border: `1px solid ${T.stone}40`, boxShadow: "0 20px 50px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* General Info Section */}
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>Publication Info</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(250px, 45%, 1fr), 1fr))", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input
                    style={{ padding: "0.9rem", borderRadius: 8, border: `1px solid ${T.stone}60`, width: "100%", fontSize: "0.95rem", outline: "none" }}
                    placeholder="Title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <input
                    style={{ padding: "0.9rem", borderRadius: 8, border: `1px solid ${T.stone}60`, width: "100%", fontSize: "0.95rem", outline: "none" }}
                    placeholder="Author name (optional override)"
                    value={formData.author_name}
                    onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(250px, 45%, 1fr), 1fr))", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <label style={{ fontSize: "0.65rem", fontWeight: 800, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Type</label>
                <select
                  style={{ padding: "0.9rem", borderRadius: 8, border: `1px solid ${T.stone}60`, background: T.paper, width: "100%", fontSize: "0.95rem" }}
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="research">Research</option>
                  <option value="field_study">Field Study</option>
                  <option value="opinion">Opinion</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <label style={{ fontSize: "0.65rem", fontWeight: 800, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Category</label>
                <select
                  style={{ padding: "0.9rem", borderRadius: 8, border: `1px solid ${T.stone}60`, background: T.paper, width: "100%", fontSize: "0.95rem" }}
                  value={formData.category_id}
                  onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>Excerpt</label>
              <textarea
                style={{ padding: "1rem", borderRadius: 8, border: `1px solid ${T.stone}60`, width: "100%", minHeight: "80px", fontSize: "0.95rem", resize: "vertical", outline: "none" }}
                placeholder="Brief summary used in cards/lists"
                value={formData.excerpt}
                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 800, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>Full Content</label>
              <textarea
                style={{ padding: "1rem", borderRadius: 8, border: `1px solid ${T.stone}60`, width: "100%", minHeight: "400px", fontSize: "1rem", lineHeight: 1.6, resize: "vertical", outline: "none" }}
                placeholder="Write your research content here..."
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            {/* Media Section */}
            <div style={{ paddingTop: "2rem", borderTop: `1px solid ${T.stone}30` }}>
              <h3 className="serif" style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>Media & Attachments</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "0.65rem", fontWeight: 800, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Featured Image</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                    <input
                      style={{ flex: "1 1 300px", padding: "0.9rem", borderRadius: 8, border: `1px solid ${T.stone}60`, fontSize: "0.85rem" }}
                      placeholder="Image URL"
                      value={formData.featured_image_url}
                      onChange={e => setFormData({ ...formData, featured_image_url: e.target.value })}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", background: T.offWhite, padding: "0.9rem 1.5rem", borderRadius: 8, border: `1px solid ${T.stone}60`, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                      Upload
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files && uploadImage(e.target.files[0])} />
                      {uploadingImage && <div className="spinner-small" />}
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <label style={{ fontSize: "0.65rem", fontWeight: 800, color: T.light, textTransform: "uppercase", letterSpacing: "0.1em" }}>Documents (PDF)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                    <input
                      style={{ flex: "1 1 300px", padding: "0.9rem", borderRadius: 8, border: `1px solid ${T.stone}60`, fontSize: "0.85rem" }}
                      placeholder="Primary PDF URL (Optional)"
                      value={formData.document_url}
                      onChange={e => setFormData({ ...formData, document_url: e.target.value })}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", background: T.offWhite, padding: "0.9rem 1.5rem", borderRadius: 8, border: `1px solid ${T.stone}60`, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                      Attach Files
                      <input type="file" accept=".pdf" multiple style={{ display: "none" }} onChange={e => e.target.files && setPdfFiles(Array.from(e.target.files))} />
                    </label>
                  </div>

                  {pdfFiles.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1rem" }}>
                      {pdfFiles.map((file, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: T.offWhite, borderRadius: 12, border: `1px solid ${T.stone}20` }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 500, color: T.ink }}>📄 {file.name}</span>
                          <button onClick={() => setPdfFiles(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#ef4444", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", cursor: "pointer" }}>Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{ paddingTop: "3rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                disabled={loading}
                onClick={() => handleSave("draft")}
                style={{ background: "none", border: `2px solid ${T.ink}`, color: T.ink, padding: "1rem 2rem", borderRadius: 12, fontSize: "0.85rem", fontWeight: 700, cursor: loading ? "wait" : "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Save size={18} />
                Save Draft
              </button>
              <button
                disabled={loading}
                onClick={() => handleSave("submitted")}
                style={{ background: T.ink, border: "none", color: T.paper, padding: "1rem 3rem", borderRadius: 12, fontSize: "0.85rem", fontWeight: 700, cursor: loading ? "wait" : "pointer", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Send size={18} />
                {loading ? "Processing..." : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .spinner-small { width: 1rem; height: 1rem; border: 2px solid rgba(0,0,0,0.1); border-top-color: currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
