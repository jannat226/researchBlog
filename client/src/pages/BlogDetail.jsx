// client/src/pages/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  User,
  Edit3,
  Trash2,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/blogs/${id}`);
      setBlog(response.data);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Blog post not found.");
      } else {
        setError("Failed to load blog post. Please try again.");
      }
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      await axios.delete(`/api/blogs/${id}`);
      navigate("/blogs");
    } catch (err) {
      alert("Failed to delete blog post. Please try again.");
      console.error("Error deleting blog:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.content.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share or error occurred
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(() => {
        alert("Unable to copy link. Please copy the URL manually.");
      });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-container">
        <div className="error-state">
          <h1>Oops!</h1>
          <p>{error}</p>
          <Link to="/blogs" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const isAuthor = user && user.id === blog.author._id;

  return (
    <div className="blog-detail-container fade-in">
      {/* Header */}
      <div className="blog-header">
        <button onClick={() => navigate("/blogs")} className="btn btn-ghost">
          <ArrowLeft size={20} />
          Back to Blogs
        </button>

        <div className="blog-actions">
          <button onClick={handleShare} className="btn btn-secondary">
            <Share2 size={18} />
            Share
          </button>

          {isAuthor && (
            <>
              <button className="btn btn-secondary">
                <Edit3 size={18} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="loading-spinner-sm"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Blog Content */}
      <article className="blog-article">
        {blog.image && (
          <div className="blog-image-container">
            <img src={blog.image} alt={blog.title} className="blog-image" />
          </div>
        )}

        <div className="blog-content">
          <header className="article-header">
            <h1 className="article-title">{blog.title}</h1>

            <div className="article-meta">
              <div className="author-info">
                <div className="author-avatar">
                  <User size={20} />
                </div>
                <div className="author-details">
                  <div className="author-name">{blog.author.username}</div>
                  <div className="publish-date">
                    <Calendar size={16} />
                    Published {formatDate(blog.createdAt)}
                  </div>
                </div>
              </div>

              <div className="engagement-stats">
                <button className="stat-button">
                  <Heart size={18} />
                  <span>24</span>
                </button>
                <button className="stat-button">
                  <MessageCircle size={18} />
                  <span>8</span>
                </button>
              </div>
            </div>
          </header>

          <div className="article-body">
            {blog.content.split("\n").map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="article-footer">
            <div className="author-card">
              <div className="author-card-avatar">
                <User size={24} />
              </div>
              <div className="author-card-info">
                <h3>About {blog.author.username}</h3>
                <p>
                  {blog.author.bio ||
                    `${blog.author.username} is a researcher and writer sharing insights on various topics. Follow their work to stay updated on their latest posts.`}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </article>

      <style jsx>{`
        .blog-detail-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .blog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .blog-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .loading-state,
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          text-align: center;
          color: #718096;
        }

        .error-state h1 {
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .error-state p {
          margin-bottom: 2rem;
        }

        .blog-article {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          margin-bottom: 3rem;
        }

        .blog-image-container {
          width: 100%;
          height: 400px;
          overflow: hidden;
        }

        .blog-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .blog-content {
          padding: 3rem;
        }

        .article-header {
          margin-bottom: 3rem;
        }

        .article-title {
          font-size: 3rem;
          font-weight: 800;
          color: #2d3748;
          line-height: 1.2;
          margin-bottom: 2rem;
        }

        .article-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .author-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .author-name {
          font-weight: 700;
          color: #2d3748;
          font-size: 1.1rem;
        }

        .publish-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .engagement-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .stat-button:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .article-body {
          margin: 3rem 0;
          line-height: 1.8;
        }

        .article-paragraph {
          font-size: 1.1rem;
          color: #2d3748;
          margin-bottom: 1.5rem;
          text-align: justify;
        }

        .article-paragraph:empty {
          margin-bottom: 0.75rem;
        }

        .article-footer {
          border-top: 1px solid #e5e7eb;
          margin-top: 3rem;
          padding-top: 2rem;
        }

        .author-card {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: #f7fafc;
          border-radius: 16px;
        }

        .author-card-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .author-card-info h3 {
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .author-card-info p {
          color: #718096;
          line-height: 1.6;
          margin: 0;
        }

        .loading-spinner-sm {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .blog-header {
            flex-direction: column;
            align-items: stretch;
          }

          .blog-actions {
            justify-content: center;
          }

          .blog-content {
            padding: 2rem 1.5rem;
          }

          .article-title {
            font-size: 2.25rem;
          }

          .article-meta {
            flex-direction: column;
            align-items: flex-start;
          }

          .engagement-stats {
            align-self: flex-end;
          }

          .author-card {
            flex-direction: column;
            text-align: center;
          }

          .author-card-avatar {
            align-self: center;
          }
        }

        @media (max-width: 480px) {
          .blog-actions {
            flex-direction: column;
          }

          .article-title {
            font-size: 1.875rem;
          }

          .blog-content {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
