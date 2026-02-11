import { useState, useEffect } from "react";
import { Clock, Trash2, Check } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../../lib/api";
import { Media } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { PageHero } from "../../components/NewLayout/PageComponents";
import { T } from "../../components/NewLayout/GlobalStyles";
import { useReveal } from "../../hooks/useReveal";

export function Videos() {
    const ref = useReveal();
    const [videos, setVideos] = useState<Media[]>([]);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { isAdmin } = useAuth();

    // Ref for scroll reveal if needed, using simple effect for now

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            setLoading(true);
            const data = await apiGet("/media?type=video");
            setVideos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const submitVideo = async () => {
        if (!youtubeUrl) return alert("Paste YouTube URL");

        setSubmitting(true);
        try {
            await apiPost("/media/upload", {
                type: "video",
                youtube_url: youtubeUrl,
                title: "YouTube Video",
            });
            setYoutubeUrl("");
            loadVideos();
        } catch {
            alert("Invalid YouTube URL");
        } finally {
            setSubmitting(false);
        }
    };

    const approveVideo = async (id: string) => {
        try {
            await apiPost(`/media/${id}/approve`, {});
            loadVideos();
        } catch (error) {
            console.error("Error approving video:", error);
        }
    };

    const deleteVideo = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;
        try {
            await apiDelete(`/media/${id}`);
            loadVideos();
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    };

    return (
        <div ref={ref}>
            <PageHero
                tag="Library"
                title={<>Multimedia &<br />Presentations.</>}
                subtitle="Watch documentaries, research briefings, and community stories from Pi Labs Commons."
            />

            <div style={{ padding: "var(--section-pad) var(--side-pad)", maxWidth: 1200, margin: "0 auto" }}>
                {/* ADMIN ADD VIDEO */}
                {isAdmin && (
                    <div style={{ marginBottom: "4rem", padding: "2.5rem", background: T.offWhite, borderRadius: 16, border: `1px solid rgba(24,24,22,0.05)` }}>
                        <h3 className="serif" style={{ fontSize: "1.25rem", marginBottom: "1.2rem" }}>Add YouTube Video</h3>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "stretch" }}>
                            <input
                                style={{ flex: "1 1 300px", padding: "0.9rem", border: `1px solid ${T.stone}`, borderRadius: 4, background: T.paper }}
                                placeholder="Paste YouTube Video URL..."
                                value={youtubeUrl}
                                onChange={e => setYoutubeUrl(e.target.value)}
                            />
                            <button
                                onClick={submitVideo}
                                disabled={submitting}
                                style={{ padding: "0.9rem 2.22rem", background: T.ink, color: T.paper, border: "none", cursor: submitting ? "wait" : "pointer", fontWeight: 700, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.06em", borderRadius: 4, transition: "opacity 0.2s" }}
                            >
                                {submitting ? "Adding..." : "Add Video"}
                            </button>
                        </div>
                    </div>
                )}

                {/* VIDEOS GRID */}
                {loading ? (
                    <div style={{ padding: "4rem", textAlign: "center", color: T.mid, fontSize: "0.9rem", fontWeight: 500 }}>Loading Library...</div>
                ) : videos.length === 0 ? (
                    <div style={{ padding: "4rem", textAlign: "center", border: `1px dashed ${T.stone}`, borderRadius: 12 }}>
                        <p style={{ color: T.mid, fontSize: "0.95rem" }}>No videos found in the library.</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "clamp(2rem, 5vw, 4rem)" }}>
                        {videos.map(video => (
                            <div key={video.id} className="rv">
                                <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000", marginBottom: "1.5rem", borderRadius: 8, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                                    <iframe
                                        src={video.url}
                                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                                        allowFullScreen
                                        title={video.title}
                                    />
                                </div>

                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem", gap: "1rem" }}>
                                        <h3 className="serif" style={{ fontSize: "1.35rem", lineHeight: 1.2, color: T.ink, letterSpacing: "-0.01em" }}>
                                            {video.title || "Untitled Video"}
                                        </h3>
                                        {isAdmin && (
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                {video.status === "pending" && (
                                                    <button onClick={() => approveVideo(video.id)} style={{ color: "green", cursor: "pointer", border: "none", background: "none", padding: 4 }} title="Approve"><Check size={18} /></button>
                                                )}
                                                <button onClick={() => deleteVideo(video.id)} style={{ color: "red", cursor: "pointer", border: "none", background: "none", padding: 4 }} title="Delete"><Trash2 size={18} /></button>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", color: T.mid, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderTop: `1px solid ${T.stone}40`, paddingTop: "0.8rem" }}>
                                        <Clock size={12} strokeWidth={2.5} />
                                        {new Date(video.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
