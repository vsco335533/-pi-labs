import { useState, useEffect } from "react";
import { Users, FileText, Eye, CheckCircle, Clock } from "lucide-react";
import { apiGet, apiPost } from "../lib/api";
import { Post, Profile, ContactSubmission } from "../types";

export function AdminDashboard() {
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

      setPosts(postsData || []);
      setResearchers(researchersData || []);
      setContacts(contactsData || []);
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
    publishedPosts: posts.filter((p) => p.status === "published").length,
    pendingPosts: posts.filter((p) => ["submitted", "under_review"].includes(p.status)).length,
    totalResearchers: researchers.length,
    totalViews: posts.reduce((sum, p) => sum + (p.view_count || 0), 0),
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "posts", label: "Posts" },
    { id: "researchers", label: "Researchers" },
    { id: "responses", label: "Responses" },
  ] as const;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "submitted": return "bg-yellow-100 text-yellow-800";
      case "under_review": return "bg-blue-100 text-blue-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 font-medium">
            Manage researchers, content, and platform settings
          </p>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-xl border border-gray-200 w-fit shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === tab.id
                ? "bg-red-600 text-white shadow-md shadow-red-100"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
          {[
            { label: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-gray-400" },
            { label: "Published", value: stats.publishedPosts, icon: CheckCircle, color: "text-green-500" },
            { label: "Pending", value: stats.pendingPosts, icon: Clock, color: "text-yellow-500" },
            { label: "Researchers", value: stats.totalResearchers, icon: Users, color: "text-purple-500" },
            { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-teal-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {activeTab === "overview" && (
            <div className="divide-y divide-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Pending Approval</h2>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : posts.filter(p => ["submitted", "under_review"].includes(p.status)).length === 0 ? (
                  <div className="p-20 text-center text-gray-400 font-medium">
                    No posts pending approval
                  </div>
                ) : (
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {posts.filter(p => ["submitted", "under_review"].includes(p.status)).map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-gray-900 mb-1">{post.title}</div>
                            <div className="text-xs text-gray-400">{new Date(post.created_at || '').toLocaleDateString()}</div>
                          </td>
                          <td className="px-8 py-6 capitalize text-sm text-gray-600 font-medium">{post.type.replace('_', ' ')}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(post.status)}`}>
                              {post.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleApprovePost(post.id)}
                                className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectPost(post.id)}
                                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all shadow-sm"
                              >
                                Reject
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
          )}

          {activeTab === "posts" && (
            <div className="p-12 text-center text-gray-400 font-medium italic">
              All platform posts management view coming soon...
            </div>
          )}

          {activeTab === "researchers" && (
            <div className="p-12 text-center text-gray-400 font-medium italic">
              Researcher management directory coming soon...
            </div>
          )}

          {activeTab === "responses" && (
            <div className="divide-y divide-gray-100">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Contact Responses</h2>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-20 text-center text-gray-400 font-medium">
                    No contact responses found
                  </div>
                ) : (
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest w-1/4">Sender</th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest w-1/2">Message</th>
                        <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-bold text-gray-900">{contact.name}</div>
                            <div className="text-xs text-blue-600 mt-0.5">{contact.email}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-sm text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-400 whitespace-nowrap">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
