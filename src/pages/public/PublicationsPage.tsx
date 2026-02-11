import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiGet } from '../../lib/api';
import { useReveal } from '../../hooks/useReveal';
import { T } from '../../components/NewLayout/GlobalStyles';
import { PageHero } from '../../components/NewLayout/PageComponents';

export function Publications() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    const ref = useReveal();

    useEffect(() => {
        Promise.all([
            apiGet("/posts?status=published"),
            apiGet("/categories")
        ]).then(([postsData, catsData]) => {
            setPosts(postsData || []);
            setCategories(catsData || []);
            setLoading(false);
        });
    }, []);

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || post.category_id === selectedCategory;
        const matchesType = !selectedType || post.type === selectedType;
        return matchesSearch && matchesCategory && matchesType;
    });

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    return (
        <div ref={ref}>
            <PageHero tag="Library" title={<>Analysis &<br />interventions.</>} subtitle="Our repository of research articles, field reports, and theoretical papers. Open access and built for the commons." />

            <section style={{ padding: "5rem 2.5rem" }}>
                {/* FILTERS */}
                <div className="rv" style={{ marginBottom: "4rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", background: T.offWhite, padding: "1.5rem", borderRadius: 4 }}>
                    <div style={{ position: "relative", flex: "1 1 240px" }}>
                        <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.mid, width: 16, height: 16 }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "0.75rem 0.75rem 0.75rem 2.4rem", border: "1px solid rgba(24,24,22,0.1)", background: T.paper, fontSize: "0.85rem", outline: "none", color: T.ink }}
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ padding: "0.75rem", border: "1px solid rgba(24,24,22,0.1)", background: T.paper, color: T.ink, fontSize: "0.85rem", outline: "none", flex: "1 1 180px" }}
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        style={{ padding: "0.75rem", border: "1px solid rgba(24,24,22,0.1)", background: T.paper, color: T.ink, fontSize: "0.85rem", outline: "none", flex: "1 1 180px" }}
                    >
                        <option value="">All Types</option>
                        <option value="research">Research Article</option>
                        <option value="field_study">Field Study</option>
                        <option value="opinion">Expert Opinion</option>
                    </select>
                </div>

                {/* GRID */}
                {loading ? (
                    <div style={{ padding: "4rem", textAlign: "center", color: T.mid }}>Loading Library...</div>
                ) : filteredPosts.length === 0 ? (
                    <div style={{ padding: "4rem", textAlign: "center", color: T.mid }}>No publications found.</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2.5rem" }}>
                        {filteredPosts.map((post) => (
                            <Link to={`/posts/${post.slug}`} key={post.id} className="rv" style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
                                <div style={{ aspectRatio: "16/9", background: T.stone, marginBottom: "1.2rem", overflow: "hidden", borderRadius: 4 }}>
                                    {post.featured_image_url ? (
                                        <img src={post.featured_image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", background: `linear-gradient(45deg, ${T.stone}, ${T.paper})`, display: "flex", alignItems: "center", justifyContent: "center", color: T.paper, fontSize: "2rem", fontFamily: "serif" }}>π</div>
                                    )}
                                </div>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                                        <span className="mono" style={{ fontSize: "0.65rem", color: T.accent, letterSpacing: "0.05em", textTransform: "uppercase" }}>{post.type.replace('_', ' ')}</span>
                                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                            <span className="mono" style={{ fontSize: "0.65rem", color: T.mid }}>{formatDate(post.published_at)}</span>
                                            {post.view_count !== undefined && (
                                                <span className="mono" style={{ fontSize: "0.65rem", color: T.mid, opacity: 0.7 }}>
                                                    {post.view_count} views
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <h3 className="serif" style={{ fontSize: "1.35rem", lineHeight: 1.25, marginBottom: "0.6rem", color: T.ink }}>{post.title}</h3>
                                    {post.excerpt && (
                                        <p className="body-serif" style={{ fontSize: "0.9rem", lineHeight: 1.6, color: T.mid, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
