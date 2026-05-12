import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../../components/BlogCard/BlogCard";
import { SkeletonGrid } from "../../components/SkeletonCard/SkeletonCard";
// import AdPlacement from "../../components/AdPlacement/AdPlacement";
import { blogService } from "../../services/blogService";
import { categoryService } from "../../services/categoryService";
import { useDebounce } from "../../hooks/useDebounce";
import { SORT_OPTIONS, ITEMS_PER_PAGE } from "../../utils/constants";
import "./Blogs.css";

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);
  const topRef = useRef(null);

  /* ── Load categories ── */
  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => setCategories(data?.categories || []))
      .catch(() => {});
  }, []);

  /* ── Fetch blogs ── */
  const fetchBlogs = useCallback(
    async (pg = 1, append = false) => {
      if (pg === 1) setLoading(true);
      else setLoadingMore(true);

      const params = {
        page: pg,
        limit: ITEMS_PER_PAGE,
        sort: sortBy,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (activeCategory) params.category = activeCategory;

      try {
        const data = await blogService.getAll(params);
        const fetched = data?.blogs || [];
        const total = data?.total || 0;

        setBlogs((prev) => (append ? [...prev, ...fetched] : fetched));
        setTotalCount(total);
        setHasMore(pg * ITEMS_PER_PAGE < total);
        setPage(pg);
      } catch {
        if (!append) setBlogs([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, activeCategory, sortBy],
  );

  useEffect(() => {
    fetchBlogs(1, false);
    // Sync URL params
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory) params.category = activeCategory;
    if (sortBy !== "newest") params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, activeCategory, sortBy, fetchBlogs]);

  const handleLoadMore = () => fetchBlogs(page + 1, true);

  const handleCategoryChange = (slug) => {
    setActiveCategory((prev) => (prev === slug ? "" : slug));
    setSidebarOpen(false);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("");
    setSortBy("newest");
  };

  const hasFilters = search || activeCategory || sortBy !== "newest";

  return (
    <div className="blogs-page">
      {/* Page header */}
      <div className="blogs-page-header">
        <div className="container">
          <div className="blogs-page-header-inner" ref={topRef}>
            <div>
              <h1 className="blogs-page-title">All Articles</h1>
              <p className="blogs-page-subtitle">
                {loading
                  ? "Loading…"
                  : `${totalCount.toLocaleString()} articles to explore`}
              </p>
            </div>

            {/* Search */}
            <div className="blogs-search-wrap">
              <div className="blogs-search-input-wrap">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="blogs-search-icon"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  className="blogs-search-input input"
                  placeholder="Search articles…"
                  value={search}
                  onChange={handleSearchChange}
                  aria-label="Search articles"
                />
                {search && (
                  <button
                    className="blogs-search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <svg
                      width="14"
                      height="14"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container blogs-layout">
        {/* Sidebar */}
        <aside className={`blogs-sidebar ${sidebarOpen ? "is-open" : ""}`}>
          <div className="blogs-sidebar-inner">
            {/* Sort */}
            <div className="blogs-filter-group">
              <h3 className="blogs-filter-title">Sort By</h3>
              <div className="blogs-sort-options">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`blogs-sort-btn ${sortBy === opt.value ? "is-active" : ""}`}
                    onClick={() => setSortBy(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="blogs-filter-divider" />

            {/* Categories */}
            <div className="blogs-filter-group">
              <h3 className="blogs-filter-title">Categories</h3>
              <div className="blogs-category-list">
                <button
                  className={`blogs-category-btn ${!activeCategory ? "is-active" : ""}`}
                  onClick={() => handleCategoryChange("")}
                >
                  All Articles
                  <span className="blogs-category-count">{totalCount}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.slug}
                    className={`blogs-category-btn ${activeCategory === cat.slug ? "is-active" : ""}`}
                    onClick={() => handleCategoryChange(cat.slug)}
                    style={{
                      "--cat-color": cat.color || "var(--color-primary)",
                    }}
                  >
                    <span className="blogs-category-icon">{cat.icon}</span>
                    {cat.name}
                    {cat.count > 0 && (
                      <span className="blogs-category-count">{cat.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <>
                <div className="blogs-filter-divider" />
                <button className="blogs-clear-filters" onClick={clearFilters}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Clear all filters
                </button>
              </>
            )}

            {/* Ad */}
            {/* <div className="blogs-sidebar-ad">
              <AdPlacement slot="rectangle" />
            </div> */}
          </div>
        </aside>

        {/* Main content */}
        <main className="blogs-main">
          {/* Toolbar */}
          <div className="blogs-toolbar">
            <div className="blogs-toolbar-left">
              <button
                className="blogs-filter-toggle btn btn-secondary btn-sm"
                onClick={() => setSidebarOpen((p) => !p)}
                aria-expanded={sidebarOpen}
                aria-label="Toggle filters"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                Filters
                {hasFilters && (
                  <span className="blogs-filter-badge">
                    {
                      [search, activeCategory, sortBy !== "newest"].filter(
                        Boolean,
                      ).length
                    }
                  </span>
                )}
              </button>

              {/* Active filters chips */}
              {hasFilters && (
                <div className="blogs-active-filters">
                  {activeCategory && (
                    <span className="blogs-filter-chip">
                      {categories.find((c) => c.slug === activeCategory)
                        ?.name || activeCategory}
                      <button
                        onClick={() => setActiveCategory("")}
                        aria-label="Remove category filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="blogs-filter-chip">
                      "{search}"
                      <button
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <p className="blogs-result-count">
              {loading ? "…" : `${totalCount.toLocaleString()} results`}
            </p>
          </div>

          {/* In-content ad
          {!loading && blogs.length > 5 && (
            <div className="blogs-inline-ad">
              <AdPlacement slot="in-content" />
            </div>
          )} */}

          {/* Blog grid */}
          {loading ? (
            <SkeletonGrid count={12} />
          ) : blogs.length > 0 ? (
            <>
              <div className="blog-grid">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {hasMore && (
                <div className="blogs-load-more">
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <span
                          className="animate-spin"
                          style={{
                            width: 18,
                            height: 18,
                            border: "2px solid var(--border-color)",
                            borderTopColor: "var(--color-primary)",
                            borderRadius: "50%",
                            display: "block",
                          }}
                        />
                        Loading…
                      </>
                    ) : (
                      `Load More (${totalCount - blogs.length} remaining)`
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="blogs-empty">
              <div className="blogs-empty-icon">🔍</div>
              <h3 className="blogs-empty-title">No articles found</h3>
              <p className="blogs-empty-desc">
                {hasFilters
                  ? "Try adjusting your filters or search query."
                  : "No articles have been published yet."}
              </p>
              {hasFilters && (
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="blogs-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Blogs;
