import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { timeAgo, truncate, generateAvatarUrl } from "../../utils/helpers";
import { PLACEHOLDER_IMAGE } from "../../utils/constants";
import "./BlogCard.css";

const BlogCard = ({ blog, variant = "default" }) => {
  const [imgError, setImgError] = useState(false);
  const { toggleBookmark, isBookmarked } = useBlog();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const bookmarked = isBookmarked(blog?._id);

  const handleBookmark = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuthenticated) {
        toast.info("Please sign in to bookmark articles");
        return;
      }
      toggleBookmark(blog._id);
      toast.success(
        bookmarked ? "Removed from bookmarks" : "Saved to bookmarks",
      );
    },
    [isAuthenticated, toggleBookmark, blog?._id, bookmarked, toast],
  );

  if (!blog) return null;

  const {
    _id,
    title,
    slug,
    excerpt,
    thumbnail,
    category,
    author,
    createdAt,
    readTime,
    views,
  } = blog;

  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <article className={`blog-card blog-card-${variant}`}>
      <Link
        to={`/blogs/${slug}`}
        className="blog-card-link"
        aria-label={`Read: ${title}`}
      >
        {/* Thumbnail */}
        <div className="blog-card-img-wrap">
          <img
            src={imgError ? PLACEHOLDER_IMAGE : thumbnail || PLACEHOLDER_IMAGE}
            alt={title}
            className="blog-card-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          {category?.name && (
            <span className="blog-card-category-badge">{category.name}</span>
          )}
          <button
            className={`blog-card-bookmark ${bookmarked ? "is-bookmarked" : ""}`}
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            aria-pressed={bookmarked}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={bookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="blog-card-body">
          <h3 className="blog-card-title">
            {isCompact ? truncate(title, 60) : title}
          </h3>

          {!isCompact && excerpt && (
            <p className="blog-card-excerpt">{truncate(excerpt, 100)}</p>
          )}

          {/* Footer */}
          <div className="blog-card-footer">
            <div className="blog-card-author">
              <img
                src={
                  author?.avatar || generateAvatarUrl(author?.name || "Author")
                }
                alt={author?.name || "Author"}
                className="blog-card-author-avatar"
                loading="lazy"
              />
              {!isCompact && (
                <span className="blog-card-author-name">
                  {author?.name || "Anonymous"}
                </span>
              )}
            </div>

            <div className="blog-card-meta">
              {readTime && (
                <span className="blog-card-meta-item">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {readTime}
                </span>
              )}
              <span className="blog-card-meta-item">{timeAgo(createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
