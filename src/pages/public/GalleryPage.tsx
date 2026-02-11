import { useEffect, useState } from "react";
import { Upload, Trash2, X, Edit, Check } from "lucide-react";
import { apiGet, apiPost, apiDelete, apiPut } from "../../lib/api";
import { Media } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { PageHero } from "../../components/NewLayout/PageComponents";
import { T } from "../../components/NewLayout/GlobalStyles";
import { useReveal } from "../../hooks/useReveal";

export function Gallery() {
    const ref = useReveal();
    const [images, setImages] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Media | null>(null);
    const { isAdmin } = useAuth();

    // New Image Form State
    const [showForm, setShowForm] = useState(false);
    const [imageName, setImageName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [descriptionText, setDescriptionText] = useState("");

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [saving, setSaving] = useState(false);

    // Category Edit State
    const [editingCategory, setEditingCategory] = useState<{ id: string, name: string } | null>(null);

    useEffect(() => {
        loadImages();
        // Load categories
        (async () => {
            try {
                const cats = await apiGet('/image-categories');
                setCategoriesList(cats || []);
            } catch (e) {
                console.error('Failed to load image categories:', e);
            }
        })();
    }, []);

    useEffect(() => {
        if (selectedImage) {
            setEditTitle(selectedImage.title);
            setEditCategory(selectedImage.image_category_id || "");
            setEditDescription(selectedImage.description || "");
            setIsEditing(false);
        }
    }, [selectedImage]);


    const loadImages = async () => {
        try {
            // Load unattached admin uploads mostly
            const data = await apiGet("/media?type=image&unattached=1&admin_uploads=1");
            setImages(data || []);
        } catch (error) {
            console.error("Error loading images:", error);
        } finally {
            setLoading(false);
        }
    };

    const approveImage = async (id: string): Promise<void> => {
        try {
            await apiPost(`/media/${id}/approve`, {});
            loadImages();
        } catch {
            alert("Failed to approve image");
        }
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory) return;
        if (!editingCategory.name.trim()) return alert("Category name cannot be empty");

        try {
            await apiPut(`/image-categories/${editingCategory.id}`, { name: editingCategory.name });
            setCategoriesList(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: editingCategory.name } : c));
            setEditingCategory(null);
        } catch (error) {
            console.error("Update category failed:", error);
            alert("Failed to update category");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Delete this category? Images will become uncategorized.")) return;
        try {
            await apiDelete(`/image-categories/${id}`);
            setCategoriesList(prev => prev.filter(c => c.id !== id));
            setImages(prev => prev.map(img => img.image_category_id === id ? { ...img, image_category_id: null } : img));
        } catch (error) {
            console.error("Delete category failed:", error);
            alert("Failed to delete category");
        }
    };

    const deleteImage = async (id: string) => {
        if (!confirm("Delete this image?")) return;
        try {
            await apiDelete(`/media/${id}?type=image`);
            loadImages();
        } catch (error) {
            alert("Failed to delete image");
        }
    };

    const handleSave = async () => {
        if (!selectedImage) return;

        try {
            setSaving(true);
            const res = await apiPut(`/media/${selectedImage.id}`, {
                title: editTitle,
                description: editDescription,
                image_category_id: editCategory || null
            });

            // Update local state
            const updated = { ...selectedImage, ...res };
            setSelectedImage(updated);
            setImages(prev => prev.map(img => img.id === updated.id ? updated : img));
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update image details");
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = async () => {
        if (!fileToUpload) return alert('Please choose an image file');

        try {
            setUploading(true);

            let categoryId = selectedCategory;
            if (newCategory && newCategory.trim()) {
                try {
                    const res = await apiPost('/image-categories', { name: newCategory.trim(), description: '' });
                    categoryId = res?.category?.id;
                    if (res?.category) setCategoriesList((s) => [res.category, ...s]);
                } catch (err: any) {
                    // Basic error handling for duplicates if API returns error
                    const existingCategory = categoriesList.find(
                        (cat) => cat.name.toLowerCase() === newCategory.trim().toLowerCase()
                    );
                    if (existingCategory) categoryId = existingCategory.id;
                    else throw err;
                }
            }

            const token = localStorage.getItem('token');
            if (!token) return alert('Not authenticated');

            const formData = new FormData();
            formData.append('file', fileToUpload as File);
            formData.append('title', (imageName && imageName.trim()) ? imageName.trim() : (fileToUpload as File).name);
            formData.append('description', descriptionText || '');
            formData.append('type', 'image');
            if (categoryId) formData.append('image_category_id', categoryId);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/media/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            setImageName('');
            setNewCategory('');
            setSelectedCategory(null);
            setFileToUpload(null);
            setDescriptionText('');
            setShowForm(false);
            await loadImages();
        } catch (err: any) {
            console.error('Upload failed:', err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div ref={ref}>
            <PageHero
                tag="Archive"
                title="Visualizing the Commons."
                subtitle="A collection of images from our field work, community gatherings, and research trips."
            />

            <div style={{ padding: "5rem 2.5rem", maxWidth: 1400, margin: "0 auto" }}>

                {/* ACTIONS */}
                {isAdmin && (
                    <div style={{ marginBottom: "3rem" }}>
                        {!showForm ? (
                            <button onClick={() => setShowForm(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.5rem", background: T.ink, color: T.paper, border: "none", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer" }}>
                                <Upload size={16} /> Upload Image
                            </button>
                        ) : (
                            <div style={{ background: T.offWhite, padding: "2rem", borderRadius: 8, maxWidth: 600 }}>
                                <h3 className="serif" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Upload New Image</h3>

                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <input placeholder="Image Name (opt)" value={imageName} onChange={e => setImageName(e.target.value)} style={{ padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} />

                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <select value={selectedCategory || ""} onChange={e => setSelectedCategory(e.target.value || null)} style={{ flex: 1, padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }}>
                                            <option value="">Select Category...</option>
                                            {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <input placeholder="Or Create New Category..." value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ flex: 1, padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} />
                                    </div>

                                    <input type="file" accept="image/*" onChange={e => setFileToUpload(e.target.files?.[0] || null)} />
                                    <textarea placeholder="Description..." value={descriptionText} onChange={e => setDescriptionText(e.target.value)} rows={3} style={{ padding: "0.8rem", border: `1px solid ${T.stone}`, borderRadius: 4 }} />

                                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                        <button onClick={handleUpload} disabled={uploading} style={{ padding: "0.8rem 2rem", background: T.ink, color: T.paper, border: "none", fontWeight: 600, textTransform: "uppercase" }}>{uploading ? "Uploading..." : "Upload"}</button>
                                        <button onClick={() => setShowForm(false)} style={{ padding: "0.8rem 2rem", background: "transparent", border: `1px solid ${T.stone}`, color: T.ink, fontWeight: 600, textTransform: "uppercase" }}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* GALLERY */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "4rem", color: T.mid }}>Loading Archive...</div>
                ) : images.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem", border: `1px dashed ${T.stone}` }}>No images found.</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
                        {/* Categories */}
                        {categoriesList.map(cat => {
                            const items = images.filter(img => (img.image_category_id || null) === cat.id);
                            if (items.length === 0 && !isAdmin) return null; // Skip empty cats for users

                            return (
                                <div key={cat.id}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: `1px solid ${T.stone}40`, paddingBottom: "0.5rem" }}>
                                        {editingCategory?.id === cat.id ? (
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <input value={editingCategory.name} onChange={e => setEditingCategory({ id: editingCategory!.id, name: e.target.value })} style={{ padding: "0.4rem" }} />
                                                <button onClick={handleUpdateCategory}><Check size={16} color="green" /></button>
                                                <button onClick={() => setEditingCategory(null)}><X size={16} color="gray" /></button>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                <h2 className="serif" style={{ fontSize: "1.5rem" }}>{cat.name}</h2>
                                                {isAdmin && (
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <button onClick={() => setEditingCategory({ id: cat.id, name: cat.name })}><Edit size={14} color="gray" /></button>
                                                        <button onClick={() => handleDeleteCategory(cat.id)}><Trash2 size={14} color="gray" /></button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                                        {items.map(img => (
                                            <div key={img.id} className="rv" onClick={() => setSelectedImage(img)} style={{ cursor: "pointer" }}>
                                                <div style={{ aspectRatio: "4/3", background: T.stone, marginBottom: "0.8rem", overflow: "hidden" }}>
                                                    <img src={img.url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                                                </div>
                                                <h4 className="serif" style={{ fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{img.title}</h4>
                                                <p className="mono" style={{ fontSize: "0.65rem", color: T.mid, textTransform: "uppercase" }}>{new Date(img.created_at).toLocaleDateString()}</p>

                                                {isAdmin && (
                                                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                                        {img.status === "pending" && <button onClick={(e) => { e.stopPropagation(); approveImage(img.id) }} style={{ color: "green", border: "none", background: "none", cursor: "pointer" }}>Approve</button>}
                                                        <button onClick={(e) => { e.stopPropagation(); deleteImage(img.id) }} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Uncategorized */}
                        {images.filter(img => !img.image_category_id).length > 0 && (
                            <div>
                                <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: `1px solid ${T.stone}40`, paddingBottom: "0.5rem" }}>Uncategorized</h2>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
                                    {images.filter(img => !img.image_category_id).map(img => (
                                        <div key={img.id} className="rv" onClick={() => setSelectedImage(img)} style={{ cursor: "pointer" }}>
                                            <div style={{ aspectRatio: "4/3", background: T.stone, marginBottom: "0.8rem", overflow: "hidden" }}>
                                                <img src={img.url} alt={img.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                                            </div>
                                            <h4 className="serif" style={{ fontSize: "1rem" }}>{img.title}</h4>

                                            {isAdmin && (
                                                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                                    <button onClick={(e) => { e.stopPropagation(); deleteImage(img.id) }} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* LIGHTBOX */}
            {selectedImage && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }} onClick={() => setSelectedImage(null)}>
                    <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%", background: T.paper, borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
                        <div style={{ flex: 1, overflow: "hidden", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, minWidth: 600 }}>
                            <img src={selectedImage.url} alt={selectedImage.title} style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }} />
                        </div>
                        <div style={{ padding: "1.5rem", background: T.paper }}>
                            {isEditing ? (
                                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: "block", fontSize: "0.7rem", color: T.mid }}>Title</label>
                                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc" }} />
                                    </div>
                                    <button onClick={handleSave} disabled={saving} style={{ padding: "0.6rem 1.2rem", background: T.ink, color: T.paper, border: "none" }}>SAVE</button>
                                    <button onClick={() => setIsEditing(false)} style={{ padding: "0.6rem 1.2rem", border: "1px solid #ccc", background: "none" }}>CANCEL</button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h2 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{selectedImage.title}</h2>
                                        <p className="body-serif" style={{ fontSize: "1rem", color: T.light }}>{selectedImage.description}</p>
                                    </div>
                                    {isAdmin && <button onClick={() => setIsEditing(true)}><Edit size={18} color="gray" /></button>}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setSelectedImage(null)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={20} /></button>
                    </div>
                </div>
            )}
        </div>
    );
}
