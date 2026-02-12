import { useState, useEffect } from "react";
import { Trash2, Check, Upload, X, Edit, LayoutGrid, Film } from "lucide-react";
import { apiGet, apiPost, apiDelete, apiPut } from "../../lib/api";
import { Media } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { PageHero } from "../../components/NewLayout/PageComponents";
import { T } from "../../components/NewLayout/GlobalStyles";
import { useReveal } from "../../hooks/useReveal";

export function Videos() {
    const ref = useReveal();
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState<'videos' | 'photos'>('videos');

    // Video State
    const [videos, setVideos] = useState<Media[]>([]);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [videoSubmitting, setVideoSubmitting] = useState(false);

    // Photo State
    const [images, setImages] = useState<Media[]>([]);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<Media | null>(null);
    const [showPhotoForm, setShowPhotoForm] = useState(false);
    const [imageName, setImageName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [descriptionText, setDescriptionText] = useState("");
    const [photoUploading, setPhotoUploading] = useState(false);

    // Common Loading
    const [loading, setLoading] = useState(true);

    // Photo Editing
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [editPhotoTitle, setEditPhotoTitle] = useState("");
    const [editPhotoCategory, setEditPhotoCategory] = useState("");
    const [editPhotoDescription, setEditPhotoDescription] = useState("");
    const [savingPhoto, setSavingPhoto] = useState(false);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'videos') {
                const data = await apiGet("/media?type=video");
                setVideos(Array.isArray(data) ? data : []);
            } else {
                const data = await apiGet("/media?type=image&unattached=1&admin_uploads=1");
                setImages(Array.isArray(data) ? data : []);
                const cats = await apiGet('/image-categories');
                setCategoriesList(Array.isArray(cats) ? cats : []);
            }
        } catch (error) {
            console.error("Error loading multimedia data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Video Actions
    const submitVideo = async () => {
        if (!youtubeUrl) return alert("Paste YouTube URL");
        setVideoSubmitting(true);
        try {
            await apiPost("/media/upload", { type: "video", youtube_url: youtubeUrl, title: "YouTube Video" });
            setYoutubeUrl("");
            loadData();
        } catch { alert("Invalid YouTube URL"); }
        finally { setVideoSubmitting(false); }
    };

    const deleteMedia = async (id: string, type: 'video' | 'image') => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await apiDelete(`/media/${id}${type === 'image' ? '?type=image' : ''}`);
            loadData();
            if (type === 'image') setSelectedImage(null);
        } catch (error) { console.error("Error deleting media:", error); }
    };

    const approveMedia = async (id: string) => {
        try {
            await apiPost(`/media/${id}/approve`, {});
            loadData();
        } catch (error) { console.error("Error approving media:", error); }
    };

    // Photo Actions
    const handlePhotoUpload = async () => {
        if (!fileToUpload) return alert('Please choose an image file');
        setPhotoUploading(true);
        try {
            let categoryId = selectedCategory;
            if (newCategory && newCategory.trim()) {
                const res = await apiPost('/image-categories', { name: newCategory.trim(), description: '' });
                categoryId = res?.category?.id;
            }
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', fileToUpload);
            formData.append('title', imageName.trim() || fileToUpload.name);
            formData.append('description', descriptionText || '');
            formData.append('type', 'image');
            if (categoryId) formData.append('image_category_id', categoryId);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/media/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            resetPhotoForm();
            loadData();
        } catch (err) { alert('Failed to upload image'); }
        finally { setPhotoUploading(false); }
    };

    const resetPhotoForm = () => {
        setImageName(''); setNewCategory(''); setSelectedCategory(null);
        setFileToUpload(null); setDescriptionText(''); setShowPhotoForm(false);
    };

    const handleSavePhotoEdit = async () => {
        if (!selectedImage) return;
        setSavingPhoto(true);
        try {
            const res = await apiPut(`/media/${selectedImage.id}`, {
                title: editPhotoTitle,
                description: editPhotoDescription,
                image_category_id: editPhotoCategory || null
            });
            setSelectedImage({ ...selectedImage, ...res });
            setIsEditingPhoto(false);
            loadData();
        } catch (error) { alert("Failed to update image"); }
        finally { setSavingPhoto(false); }
    };

    return (
        <div ref={ref}>
            <PageHero
                tag="Library"
                title={<>Multimedia &<br />Presentations.</>}
                subtitle="Explore our visual archive, from field documentaries to community gatherings."
            />

            <div style={{ padding: "0 var(--side-pad) var(--section-pad)", maxWidth: 1400, margin: "0 auto" }}>
                {/* TAB SWITCHER */}
                <div style={{ display: "flex", gap: "2rem", marginBottom: "4rem", borderBottom: `1px solid ${T.stone}30`, paddingBottom: "1rem" }}>
                    <button
                        onClick={() => setActiveTab('videos')}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", cursor: "pointer",
                            fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                            color: activeTab === 'videos' ? T.ink : T.mid,
                            transition: "all 0.3s",
                            borderBottom: activeTab === 'videos' ? `2px solid ${T.accent}` : "2px solid transparent",
                            paddingBottom: "1rem", marginBottom: "-1.1rem"
                        }}
                    >
                        <Film size={18} /> Videos
                    </button>
                    <button
                        onClick={() => setActiveTab('photos')}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", cursor: "pointer",
                            fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                            color: activeTab === 'photos' ? T.ink : T.mid,
                            transition: "all 0.3s",
                            borderBottom: activeTab === 'photos' ? `2px solid ${T.accent}` : "2px solid transparent",
                            paddingBottom: "1rem", marginBottom: "-1.1rem"
                        }}
                    >
                        <LayoutGrid size={18} /> Photos
                    </button>
                </div>

                {/* ADMIN TOOLS */}
                {isAdmin && (
                    <div style={{ marginBottom: "4rem" }}>
                        {activeTab === 'videos' ? (
                            <div style={{ padding: "2.5rem", background: T.offWhite, borderRadius: 16, border: `1px solid rgba(24,24,22,0.05)` }}>
                                <h3 className="serif" style={{ fontSize: "1.25rem", marginBottom: "1.2rem" }}>Add YouTube Video</h3>
                                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                    <input style={{ flex: 1, minWidth: 280, padding: "0.9rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} placeholder="YouTube URL..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
                                    <button onClick={submitVideo} disabled={videoSubmitting} style={{ padding: "0.9rem 2.22rem", background: T.ink, color: T.paper, border: "none", cursor: "pointer", fontWeight: 700, textTransform: "uppercase", borderRadius: 4 }}>
                                        {videoSubmitting ? "Adding..." : "Add Video"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            !showPhotoForm ? (
                                <button onClick={() => setShowPhotoForm(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.5rem", background: T.ink, color: T.paper, border: "none", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", borderRadius: 4 }}>
                                    <Upload size={16} /> Upload Photo
                                </button>
                            ) : (
                                <div style={{ background: T.offWhite, padding: "2.5rem", borderRadius: 16, maxWidth: 800, border: `1px solid rgba(24,24,22,0.05)` }}>
                                    <h3 className="serif" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Upload New Photo</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <input placeholder="Title (optional)" value={imageName} onChange={e => setImageName(e.target.value)} style={{ padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} />
                                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                            <select value={selectedCategory || ""} onChange={e => setSelectedCategory(e.target.value || null)} style={{ flex: 1, padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }}>
                                                <option value="">Select Category...</option>
                                                {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            <input placeholder="Or New Category..." value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ flex: 1, padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} />
                                        </div>
                                        <input type="file" accept="image/*" onChange={e => setFileToUpload(e.target.files?.[0] || null)} />
                                        <textarea placeholder="Description..." value={descriptionText} onChange={e => setDescriptionText(e.target.value)} rows={3} style={{ padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} />
                                        <div style={{ display: "flex", gap: "1rem" }}>
                                            <button onClick={handlePhotoUpload} disabled={photoUploading} style={{ padding: "0.8rem 2rem", background: T.ink, color: T.paper, border: "none", fontWeight: 700, textTransform: "uppercase", borderRadius: 4 }}>{photoUploading ? "Uploading..." : "Upload"}</button>
                                            <button onClick={() => setShowPhotoForm(false)} style={{ padding: "0.8rem 2rem", background: "none", border: `1px solid ${T.stone}`, borderRadius: 4 }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* CONTENT GRID */}
                {loading ? (
                    <div style={{ padding: "4rem", textAlign: "center", color: T.mid }}>Loading {activeTab}...</div>
                ) : activeTab === 'videos' ? (
                    videos.length === 0 ? <p style={{ textAlign: "center", color: T.mid }}>No videos found.</p> : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: "4rem" }}>
                            {videos.map(video => (
                                <div key={video.id} className="rv">
                                    <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000", marginBottom: "1.5rem", borderRadius: 12, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
                                        <iframe src={video.url} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} allowFullScreen />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <h3 className="serif" style={{ fontSize: "1.35rem", lineHeight: 1.2 }}>{video.title}</h3>
                                        {isAdmin && (
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                {video.status === "pending" && <button onClick={() => approveMedia(video.id)} style={{ color: "green", background: "none", border: "none", cursor: "pointer" }}><Check size={18} /></button>}
                                                <button onClick={() => deleteMedia(video.id, 'video')} style={{ color: T.accent, background: "none", border: "none", cursor: "pointer" }}><Trash2 size={18} /></button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ marginTop: "1rem", color: T.mid, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {new Date(video.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    images.length === 0 ? <p style={{ textAlign: "center", color: T.mid }}>No photos found.</p> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
                            {categoriesList.map(cat => {
                                const items = images.filter(img => img.image_category_id === cat.id);
                                if (items.length === 0 && !isAdmin) return null;
                                return (
                                    <div key={cat.id}>
                                        <h2 className="serif" style={{ fontSize: "1.8rem", marginBottom: "2rem", borderBottom: `1px solid ${T.stone}30`, paddingBottom: "0.5rem" }}>{cat.name}</h2>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "2rem" }}>
                                            {items.map(img => (
                                                <div key={img.id} className="rv" onClick={() => { setSelectedImage(img); setEditPhotoTitle(img.title); setEditPhotoDescription(img.description || ""); setEditPhotoCategory(img.image_category_id || ""); }} style={{ cursor: "pointer" }}>
                                                    <div style={{ aspectRatio: "16/10", background: T.stone, borderRadius: 8, overflow: "hidden", marginBottom: "1rem" }}>
                                                        <img src={img.url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                                                    </div>
                                                    <h4 className="serif" style={{ fontSize: "1.1rem" }}>{img.title}</h4>
                                                    {isAdmin && (
                                                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.8rem" }}>
                                                            {img.status === "pending" && <button onClick={(e) => { e.stopPropagation(); approveMedia(img.id) }} style={{ color: "green", background: "none", border: "none", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700 }}>APPROVE</button>}
                                                            <button onClick={(e) => { e.stopPropagation(); deleteMedia(img.id, 'image') }} style={{ color: T.accent, background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}
            </div>

            {/* LIGHTBOX FOR PHOTOS */}
            {selectedImage && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: "rgba(18,18,16,0.98)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }} onClick={() => setSelectedImage(null)}>
                    <div style={{ position: "relative", width: "100%", maxWidth: 1100, maxHeight: "95vh", background: T.paper, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
                        <div style={{ flex: 1, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src={selectedImage.url} alt={selectedImage.title} style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain" }} />
                        </div>
                        <div style={{ padding: "2.5rem", background: T.paper }}>
                            {isEditingPhoto ? (
                                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                                    <div style={{ flex: 1, minWidth: 250 }}>
                                        <label style={{ fontSize: "0.65rem", fontWeight: 700, color: T.mid, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>Title</label>
                                        <input value={editPhotoTitle} onChange={e => setEditPhotoTitle(e.target.value)} style={{ width: "100%", padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} />
                                    </div>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <button onClick={handleSavePhotoEdit} disabled={savingPhoto} style={{ padding: "0.8rem 2rem", background: T.ink, color: T.paper, borderRadius: 4, border: "none", fontWeight: 700 }}>SAVE</button>
                                        <button onClick={() => setIsEditingPhoto(false)} style={{ padding: "0.8rem 2rem", background: "none", border: `1px solid ${T.stone}`, borderRadius: 4, fontWeight: 700 }}>CANCEL</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h2 className="serif" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{selectedImage.title}</h2>
                                        <p className="body-serif" style={{ fontSize: "1.1rem", color: T.light, lineHeight: 1.6 }}>{selectedImage.description}</p>
                                    </div>
                                    {isAdmin && <button onClick={() => setIsEditingPhoto(true)} style={{ background: "none", border: "none", cursor: "pointer" }}><Edit size={20} color={T.mid} /></button>}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setSelectedImage(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={24} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
