import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogService } from "../../services/blogService";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import { useToast } from "../../context/ToastContext";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import BlogCard from "../../components/BlogCard/BlogCard";
import ShareModal from "../../components/ShareModal/ShareModal";
import {
  formatDate,
  timeAgo,
  generateAvatarUrl,
  formatNumber,
} from "../../utils/helpers";
import { PLACEHOLDER_IMAGE } from "../../utils/constants";
import "./BlogDetail.css";

/* ── Comment component ── */
const Comment = ({ comment, onDelete, currentUser }) => {
  const canDelete =
    currentUser?._id === comment.author?._id || currentUser?.role === "admin";

  return (
    <div className="comment">
      <img
        src={
          comment.author?.avatar ||
          generateAvatarUrl(comment.author?.name || "U")
        }
        alt={comment.author?.name}
        className="comment-avatar"
      />
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author">
            {comment.author?.name || "Anonymous"}
          </span>
          <span className="comment-time">{timeAgo(comment.createdAt)}</span>
          {canDelete && (
            <button
              className="comment-delete"
              onClick={() => onDelete(comment._id)}
              aria-label="Delete comment"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          )}
        </div>
        <p className="comment-text">{comment.content}</p>
      </div>
    </div>
  );
};

/* ── Main Blog Detail Page ── */
const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked, addToHistory } = useBlog();
  const { toast } = useToast();
  const progress = useScrollProgress();

  /* ── ALL useState hooks together at the top ── */
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [shareOpen, setShareOpen] = useState(false); /* ← fix: added here */

  /* ── Fetch blog on slug change ── */
  useEffect(() => {
    setLoading(true);
    setError(null);
    setBlog(null);
    setRelated([]);
    setComments([]);
    setLiked(false);
    setImgError(false);

    blogService
      .getBySlug(slug)
      .then((data) => {
        const fetchedBlog = data?.blog;
        if (!fetchedBlog) throw new Error("Blog not found");

        setBlog(fetchedBlog);
        setLikeCount(fetchedBlog?.likes || 0);
        addToHistory(fetchedBlog?._id);
        blogService.incrementView(fetchedBlog?._id).catch(() => {});

        return Promise.all([
          blogService.getRelated(fetchedBlog._id).catch(() => ({ blogs: [] })),
          blogService
            .getComments(fetchedBlog._id)
            .catch(() => ({ comments: [] })),
        ]);
      })
      .then(([relData, commData]) => {
        setRelated(relData?.blogs || []);
        setComments(commData?.comments || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load article");
      })
      .finally(() => setLoading(false));
  }, [slug, addToHistory]);

  /* ── Like ── */
  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to like articles");
      return;
    }
    try {
      await blogService.toggleLike(blog._id);
      setLiked((p) => !p);
      setLikeCount((p) => (liked ? p - 1 : p + 1));
    } catch {
      toast.error("Could not update like");
    }
  }, [blog?._id, liked, isAuthenticated, toast]);

  /* ── Bookmark ── */
  const handleBookmark = useCallback(() => {
    if (!isAuthenticated) {
      toast.info("Sign in to bookmark articles");
      return;
    }
    toggleBookmark(blog._id);
    toast.success(isBookmarked(blog._id) ? "Removed from bookmarks" : "Saved!");
  }, [blog?._id, isAuthenticated, toggleBookmark, isBookmarked, toast]);

  /* ── Comment submit ── */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.info("Please sign in to comment");
      return;
    }
    setSubmittingComment(true);
    try {
      const data = await blogService.addComment(blog._id, {
        content: commentText.trim(),
      });
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  /* ── Comment delete ── */
  const handleCommentDelete = async (commentId) => {
    try {
      await blogService.deleteComment(blog._id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="blog-detail-skeleton">
          <div className="skeleton blog-detail-skeleton-banner" />
          <div className="container blog-detail-skeleton-body">
            <div className="skeleton blog-detail-skeleton-title" />
            <div
              className="skeleton blog-detail-skeleton-title"
              style={{ width: "60%" }}
            />
            <div className="skeleton blog-detail-skeleton-meta" />
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton blog-detail-skeleton-line"
                style={{ width: i % 3 === 2 ? "70%" : "100%" }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error || !blog) {
    return (
      <div className="blog-detail-error container">
        <div className="blog-detail-error-inner">
          <span className="blog-detail-error-icon">😕</span>
          <h2>Article not found</h2>
          <p>
            {error ||
              "The article you're looking for doesn't exist or was removed."}
          </p>
          <div className="blog-detail-error-actions">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <Link to="/blogs" className="btn btn-primary">
              Browse Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bookmarked = isBookmarked(blog._id);

  return (
    <article className="blog-detail-page">
      {/* ── Banner ── */}
      <div className="blog-detail-banner">
        <img
          src={
            imgError ? PLACEHOLDER_IMAGE : blog.thumbnail || PLACEHOLDER_IMAGE
          }
          alt={blog.title}
          className="blog-detail-banner-img"
          onError={() => setImgError(true)}
        />
        <div className="blog-detail-banner-overlay" aria-hidden="true" />
      </div>

      <div className="container blog-detail-container">
        <div className="two-col blog-detail-layout">
          {/* ── Main content ── */}
          <div className="blog-detail-main">
            {/* Category */}
            {blog.category && (
              <Link
                to={`/categories/${blog.category.slug}`}
                className="blog-detail-category"
              >
                {blog.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="blog-detail-title">{blog.title}</h1>

            {/* Meta row */}
            <div className="blog-detail-meta">
              <div className="blog-detail-author">
                <img
                  src={
                    blog.author?.avatar ||
                    generateAvatarUrl(blog.author?.name || "A")
                  }
                  alt={blog.author?.name}
                  className="blog-detail-author-avatar"
                />
                <div className="blog-detail-author-info">
                  <span className="blog-detail-author-name">
                    {blog.author?.name || "Anonymous"}
                  </span>
                  <span className="blog-detail-author-role">
                    {blog.author?.bio || "Author"}
                  </span>
                </div>
              </div>
              <div className="blog-detail-meta-right">
                <span className="blog-detail-meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDate(blog.createdAt)}
                </span>
                <span className="blog-detail-meta-sep" />
                <span className="blog-detail-meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {blog.readTime || "5 min read"}
                </span>
                <span className="blog-detail-meta-sep" />
                <span className="blog-detail-meta-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {formatNumber(blog.views || 0)} views
                </span>
              </div>
            </div>

            {/* Reading progress bar */}
            <div className="blog-detail-progress-wrap">
              <div
                className="blog-detail-progress-fill"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            {/* Action bar */}
            <div className="blog-detail-actions">
              {/* Like */}
              <button
                className={`blog-detail-action-btn ${liked ? "is-liked" : ""}`}
                onClick={handleLike}
                aria-label={liked ? "Unlike" : "Like"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {formatNumber(likeCount)}
              </button>

              {/* Bookmark */}
              <button
                className={`blog-detail-action-btn ${bookmarked ? "is-bookmarked" : ""}`}
                onClick={handleBookmark}
                aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={bookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                {bookmarked ? "Saved" : "Save"}
              </button>

              {/* Share — opens ShareModal */}
              <button
                className="blog-detail-action-btn"
                onClick={() => setShareOpen(true)}
                aria-label="Share this article"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>

            {/* Article content */}
            <div
              className="blog-detail-content prose"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="blog-detail-tags">
                <span className="blog-detail-tags-label">Tags:</span>
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blogs?search=${encodeURIComponent(tag)}`}
                    className="blog-detail-tag"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Author bio card */}
            {blog.author && (
              <div className="blog-detail-author-card">
                <img
                  src={
                    blog.author.avatar ||
                    generateAvatarUrl(blog.author.name || "A")
                  }
                  alt={blog.author.name}
                  className="blog-detail-author-card-avatar"
                />
                <div className="blog-detail-author-card-info">
                  <span className="blog-detail-author-card-label">
                    Written by
                  </span>
                  <h3 className="blog-detail-author-card-name">
                    {blog.author.name}
                  </h3>
                  {blog.author.bio && (
                    <p className="blog-detail-author-card-bio">
                      {blog.author.bio}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Comments section */}
            <section className="blog-detail-comments" aria-label="Comments">
              <h2 className="blog-detail-comments-title">
                Discussion
                <span className="blog-detail-comments-count">
                  {comments.length}
                </span>
              </h2>

              {/* Comment form */}
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <div className="comment-form-inner">
                    <img
                      src={user?.avatar || generateAvatarUrl(user?.name || "U")}
                      alt="You"
                      className="comment-form-avatar"
                    />
                    <div className="comment-form-field">
                      <textarea
                        className="comment-form-textarea input"
                        placeholder="Share your thoughts…"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={3}
                        maxLength={1000}
                        aria-label="Write a comment"
                      />
                      <div className="comment-form-actions">
                        <span className="comment-form-count">
                          {commentText.length}/1000
                        </span>
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                          disabled={!commentText.trim() || submittingComment}
                        >
                          {submittingComment ? "Posting…" : "Post Comment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="comment-auth-prompt">
                  <p>
                    <Link to="/login">Sign in</Link> to join the discussion.
                  </p>
                </div>
              )}

              {/* Comment list */}
              {comments.length > 0 ? (
                <div className="comment-list">
                  {comments.map((c) => (
                    <Comment
                      key={c._id}
                      comment={c}
                      onDelete={handleCommentDelete}
                      currentUser={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="comment-empty">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="blog-detail-sidebar" aria-label="Article sidebar">
            <div className="blog-detail-sidebar-sticky">
              {/* Browse topics */}
              <div className="blog-detail-sidebar-card">
                <h3 className="blog-detail-sidebar-title">Browse Topics</h3>
                <div className="blog-detail-sidebar-categories">
                  {[
                    "Technology",
                    "Design",
                    "Startup",
                    "Science",
                    "Productivity",
                    "Finance",
                  ].map((cat) => (
                    <Link
                      key={cat}
                      to={`/categories/${cat.toLowerCase()}`}
                      className="blog-detail-sidebar-cat"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="blog-detail-sidebar-card">
                  <h3 className="blog-detail-sidebar-title">
                    Related Articles
                  </h3>
                  <div className="blog-detail-related">
                    {related.slice(0, 4).map((post) => (
                      <Link
                        key={post._id}
                        to={`/blogs/${post.slug}`}
                        className="blog-detail-related-item"
                      >
                        <img
                          src={post.thumbnail || PLACEHOLDER_IMAGE}
                          alt={post.title}
                          className="blog-detail-related-img"
                          loading="lazy"
                          onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                        />
                        <div>
                          <p className="blog-detail-related-title">
                            {post.title}
                          </p>
                          <span className="blog-detail-related-time">
                            {timeAgo(post.createdAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share CTA in sidebar */}
              <div className="blog-detail-sidebar-card blog-detail-share-cta">
                <h3 className="blog-detail-sidebar-title">
                  Enjoyed this article?
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  Share it with your network and unlock exclusive resources.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setShareOpen(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  Share & Unlock Rewards
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related blogs — full width */}
        {related.length > 0 && (
          <section className="blog-detail-related-section">
            <h2
              className="section-title"
              style={{ marginBottom: "var(--space-8)" }}
            >
              More Like This
            </h2>
            <div className="blog-grid">
              {related.slice(0, 6).map((post) => (
                <BlogCard key={post._id} blog={post} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Share Modal ── */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        blog={blog}
      />
    </article>
  );
};

export default BlogDetail;
