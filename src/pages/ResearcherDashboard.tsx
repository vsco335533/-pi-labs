import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Edit, Trash2, Eye, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiGet, apiDelete } from "../lib/api";
import { Post } from "../types";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-gray-100 text-gray-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your research publications and content
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs font-medium uppercase">Total Posts</span>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs font-medium uppercase">Published</span>
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {stats.published}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs font-medium uppercase">Drafts</span>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.draft}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs font-medium uppercase">Total Views</span>
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.views}</p>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">My Posts</h2>
            <Link
              to="/dashboard/new-post"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              New Post
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mx-auto"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                  You haven't created any research publications yet. Start by creating a new post.
                </p>
                <Link
                  to="/dashboard/new-post"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-bold underline underline-offset-4"
                >
                  <Plus className="w-4 h-4" />
                  Create your first post
                </Link>
              </div>
            ) : (
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 max-w-md truncate">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 capitalize">
                          {post.type.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(
                            post.status
                          )}`}
                        >
                          {post.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {post.view_count || 0}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/dashboard/edit/${post.slug}`}
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                            title="Edit Post"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
