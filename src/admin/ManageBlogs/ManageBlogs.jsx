import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { blogService } from "../../services/blogService";
import { useToast } from "../../context/ToastContext";
import { formatDateShort, formatNumber } from "../../utils/helpers";
import Modal from "../../components/Modal/Modal";
import "./ManageBlogs.css";

const ITEMS_PER_PAGE = 10;

const ManageBlogs = () => {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState([]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        showAll: true,
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const data = await blogService.getAll(params);
      setBlogs(data?.blogs || []);
      setTotal(data?.total || 0);
    } catch (err) {
      toast.error("Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await blogService.delete(deleteTarget._id);
      setBlogs((p) => p.filter((b) => b._id !== deleteTarget._id));
      setTotal((p) => p - 1);
      toast.success("Article deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      await blogService.update(blog._id, { status: newStatus });
      setBlogs((p) =>
        p.map((b) => (b._id === blog._id ? { ...b, status: newStatus } : b)),
      );
      toast.success(
        `Article ${newStatus === "published" ? "published" : "moved to drafts"}`,
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  const toggleSelect = (id) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const toggleAll = () =>
    setSelected((p) =>
      p.length === blogs.length ? [] : blogs.map((b) => b._id),
    );

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="manage-blogs">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Articles</h1>
          <p className="admin-page-subtitle">{total} total articles</p>
        </div>
        <Link to="/admin/blogs/new" className="btn btn-primary">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="manage-blogs-toolbar">
        <div className="manage-search-wrap">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="manage-search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="input manage-search-input"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="manage-filters">
          {["", "published", "draft", "scheduled"].map((s) => (
            <button
              key={s}
              className={`manage-filter-btn ${statusFilter === s ? "is-active" : ""}`}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
            >
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchBlogs}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="manage-table-card">
        {selected.length > 0 && (
          <div className="manage-bulk-bar">
            <span>{selected.length} selected</span>
            <button
              className="btn btn-sm"
              style={{ color: "var(--color-error)" }}
              onClick={() => setSelected([])}
            >
              Deselect All
            </button>
          </div>
        )}

        <div className="manage-table-wrap">
          <table className="dash-table manage-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selected.length === blogs.length && blogs.length > 0
                    }
                    onChange={toggleAll}
                    className="manage-checkbox"
                  />
                </th>
                <th>Article</th>
                <th>Author</th>
                <th>Category</th>
                <th>Views</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j}>
                        <div
                          className="skeleton"
                          style={{ height: 16, borderRadius: 4 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="manage-empty-cell">
                    <div className="manage-empty-state">
                      <span>📝</span>
                      <p>No articles found</p>
                      <Link
                        to="/admin/blogs/new"
                        className="btn btn-primary btn-sm"
                      >
                        Create First Article
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(blog._id)}
                        onChange={() => toggleSelect(blog._id)}
                        className="manage-checkbox"
                      />
                    </td>
                    <td>
                      <div className="manage-blog-info">
                        {blog.thumbnail && (
                          <img
                            src={blog.thumbnail}
                            alt=""
                            className="manage-blog-thumb"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        )}
                        <span className="manage-blog-title">{blog.title}</span>
                      </div>
                    </td>
                    <td>{blog.author?.name || "—"}</td>
                    <td>
                      {blog.category?.name ? (
                        <span
                          className="manage-cat-badge"
                          style={{
                            "--cat":
                              blog.category?.color || "var(--color-primary)",
                          }}
                        >
                          {blog.category.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{formatNumber(blog.views || 0)}</td>
                    <td>
                      <button
                        className={`badge manage-status-badge ${
                          blog.status === "published"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                        onClick={() => handleToggleStatus(blog)}
                        title="Click to toggle status"
                      >
                        {blog.status || "draft"}
                      </button>
                    </td>
                    <td className="dash-table-date">
                      {formatDateShort(blog.createdAt)}
                    </td>
                    <td>
                      <div className="dash-table-actions">
                        <Link
                          to={`/admin/blogs/edit/${blog._id}`}
                          className="dash-action-btn"
                          aria-label="Edit"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        {blog.slug && (
                          <Link
                            to={`/blogs/${blog.slug}`}
                            className="dash-action-btn"
                            target="_blank"
                            aria-label="View"
                          >
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
                          </Link>
                        )}
                        <button
                          className="dash-action-btn dash-action-delete"
                          onClick={() => setDeleteTarget(blog)}
                          aria-label="Delete"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="manage-pagination">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Previous
            </button>
            <div className="manage-page-numbers">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    className={`manage-page-num ${page === pg ? "is-active" : ""}`}
                    onClick={() => setPage(pg)}
                  >
                    {pg}
                  </button>
                );
              })}
            </div>
            <span className="manage-page-info">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Delete modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Article"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>
            <button
              className="btn"
              style={{ background: "var(--color-error)", color: "#fff" }}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete Article"}
            </button>
          </>
        }
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Are you sure you want to delete{" "}
          <strong>"{deleteTarget?.title}"</strong>? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default ManageBlogs;
