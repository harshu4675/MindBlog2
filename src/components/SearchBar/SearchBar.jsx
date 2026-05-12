import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { blogService } from "../../services/blogService";
import { timeAgo } from "../../utils/helpers";
import "./SearchBar.css";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    blogService
      .search(debouncedQuery)
      .then((data) => setResults(data?.blogs || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleResultClick = useCallback(
    (slug) => {
      navigate(`/blogs/${slug}`);
      onClose();
    },
    [navigate, onClose],
  );

  return (
    <div
      className="search-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="search-modal animate-scale-in">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-wrap">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              className="search-input"
              placeholder="Search articles, topics, authors…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              autoComplete="off"
              aria-label="Search"
            />
            {loading && (
              <span
                className="search-spinner animate-spin"
                aria-hidden="true"
              />
            )}
          </div>
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div
            className="search-results"
            role="listbox"
            aria-label="Search results"
          >
            {results.slice(0, 6).map((blog) => (
              <button
                key={blog._id}
                className="search-result-item"
                onClick={() => handleResultClick(blog.slug)}
                role="option"
                aria-selected="false"
              >
                {blog.thumbnail && (
                  <img
                    src={blog.thumbnail}
                    alt=""
                    className="search-result-img"
                    loading="lazy"
                  />
                )}
                <div className="search-result-info">
                  <span className="search-result-category">
                    {blog.category?.name}
                  </span>
                  <p className="search-result-title">{blog.title}</p>
                  <span className="search-result-meta">
                    {timeAgo(blog.createdAt)}
                  </span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="search-result-arrow"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ))}

            {results.length > 6 && (
              <button className="search-view-all" onClick={handleSubmit}>
                View all results for "{query}"
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && query.length > 2 && results.length === 0 && (
          <div className="search-empty">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>
              No results found for <strong>"{query}"</strong>
            </p>
            <span>Try different keywords or browse categories</span>
          </div>
        )}

        {/* Shortcuts hint */}
        {!query && (
          <div className="search-hints">
            <p className="search-hints-label">Quick actions</p>
            <div className="search-hint-chips">
              {["Technology", "Design", "Startup", "Mental Health"].map(
                (tag) => (
                  <button
                    key={tag}
                    className="search-hint-chip"
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ),
              )}
            </div>
            <p className="search-shortcut">
              Press <kbd>Esc</kbd> to close
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
