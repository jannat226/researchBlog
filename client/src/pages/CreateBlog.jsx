// client/src/pages/CreateBlog.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";
import {
  PenTool,
  Image as ImageIcon,
  Save,
  Eye,
  ArrowLeft,
} from "lucide-react";

const CreateBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/blogs", formData);
      navigate(`/blogs/${response.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create blog. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/blogs");
  };

  if (!user) {
    return (
      <div className="create-blog-container">
        <div className="card text-center">
          <h1>Please log in to create a blog post</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="create-blog-container fade-in">
      <div className="create-blog-header">
        <button onClick={handleBack} className="btn btn-ghost">
          <ArrowLeft size={20} />
          Back to Blogs
        </button>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="btn btn-secondary"
          >
            <Eye size={18} />
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      <div className="create-blog-content">
        {!preview ? (
          // Edit Mode
          <div className="card">
            <div className="card-header">
              <div className="create-blog-icon">
                <PenTool size={32} />
              </div>
              <h1 className="card-title">Create New Blog Post</h1>
              <p className="card-subtitle">
                Share your thoughts with the world
              </p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter an engaging title for your blog..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  <ImageIcon size={16} />
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="image-preview">
                    <img
                      src={formData.image}
                      alt="Cover preview"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  Blog Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Write your blog content here... Share your insights, experiences, or stories!"
                  required
                  rows="12"
                />
                <div className="character-count">
                  {formData.content.length} characters
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !formData.title.trim() ||
                    !formData.content.trim()
                  }
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner-sm"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Publish Blog
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Preview Mode
          <div className="card">
            <div className="preview-header">
              <h2>Preview</h2>
              <p>This is how your blog will appear to readers</p>
            </div>

            <article className="blog-preview">
              {formData.image && (
                <div className="preview-image-container">
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="preview-image"
                  />
                </div>
              )}

              <div className="preview-content">
                <h1 className="preview-title">
                  {formData.title || "Your Blog Title"}
                </h1>

                <div className="preview-meta">
                  <div className="preview-author">By {user.username}</div>
                  <div className="preview-date">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>

                <div className="preview-text">
                  {formData.content ? (
                    formData.content
                      .split("\n")
                      .map((paragraph, index) => <p key={index}>{paragraph}</p>)
                  ) : (
                    <p className="placeholder-text">
                      Your blog content will appear here...
                    </p>
                  )}
                </div>
              </div>
            </article>
          </div>
        )}
      </div>

      <style jsx>{`
        .create-blog-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .create-blog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .create-blog-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .image-preview {
          margin-top: 1rem;
          border-radius: 12px;
          overflow: hidden;
          max-height: 200px;
        }

        .image-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .character-count {
          font-size: 0.8rem;
          color: #718096;
          text-align: right;
          margin-top: 0.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .loading-spinner-sm {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        /* Preview Styles */
        .preview-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .preview-header h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .preview-header p {
          color: #718096;
          margin: 0;
        }

        .blog-preview {
          max-width: none;
        }

        .preview-image-container {
          margin-bottom: 2rem;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .preview-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }

        .preview-content {
          padding: 0;
        }

        .preview-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .preview-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.9rem;
          color: #718096;
        }

        .preview-author {
          font-weight: 600;
          color: #667eea;
        }

        .preview-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #2d3748;
        }

        .preview-text p {
          margin-bottom: 1.5rem;
        }

        .placeholder-text {
          color: #a0aec0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .create-blog-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            justify-content: center;
          }

          .form-actions {
            justify-content: center;
          }

          .preview-title {
            font-size: 2rem;
          }

          .preview-meta {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateBlog;
