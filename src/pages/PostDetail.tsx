import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, User, Eye, FileText, ExternalLink } from "lucide-react";
import { apiGet } from "../lib/api";

export function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    apiGet(`/posts/${slug}`).then(setPost);
  }, [slug]);

  if (!post) return null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
      {post.featured_image_url && (
        <div className="mb-8 md:mb-12">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full rounded-2xl shadow-xl object-cover aspect-[21/9]"
          />
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-y-4 gap-6 text-sm font-medium text-gray-500 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <span>{post.author_name || post.profiles?.full_name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(post.published_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <span>{post.view_count || 0} views</span>
          </div>
        </div>
      </div>

      {post.excerpt && (
        <div className="mb-10 p-6 bg-gray-50 rounded-2xl border-l-4 border-gray-900 italic text-lg md:text-xl text-gray-700 leading-relaxed">
          {post.excerpt}
        </div>
      )}

      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-12 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 📄 Documents Section */}
      {post.media && post.media.filter((m: any) => m.type === "pdf" || m.type === "document").length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mt-12 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-6">Attachments & Resources</h3>
          <div className="space-y-3">
            {post.media
              .filter((m: any) => m.type === "pdf" || m.type === "document")
              .map((pdf: any) => {
                const fallbackName = (pdf.url || "").split("/").pop() || "resource.pdf";
                const displayName = pdf.title || fallbackName;
                const API_BASE = import.meta.env.VITE_API_URL || "http://192.168.0.8:5000/api";
                const downloadHref = `${API_BASE.replace(/\/$/, '')}/media/${pdf.id}/download`;
                return (
                  <a
                    key={pdf.id}
                    href={downloadHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all group border border-transparent hover:border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold flex-1 truncate">{displayName}</span>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </article>
  );
}
