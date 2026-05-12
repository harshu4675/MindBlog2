import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "../../context/ToastContext";
import { userService } from "../../services/userService";
import { generateAvatarUrl, formatDateShort } from "../../utils/helpers";
import Modal from "../../components/Modal/Modal";
import "./ManageUsers.css";

const ROLE_COLORS = {
  admin: "#6c63ff",
  author: "#06b6d4",
  user: "#10b981",
};

const ManageUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const ITEMS = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: ITEMS };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const data = await userService.getAll(params);
      setUsers(data?.users || []);
      setTotal(data?.total || 0);
    } catch {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateRole(userId, newRole);
      setUsers((p) =>
        p.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userService.delete(deleteTarget._id);
      setUsers((p) => p.filter((u) => u._id !== deleteTarget._id));
      setTotal((p) => p - 1);
      toast.success("User removed");
      setDeleteTarget(null);
      setSelectedUser(null);
    } catch {
      toast.error("Failed to remove user");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / ITEMS);

  return (
    <div className="manage-users">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Users</h1>
          <p className="admin-page-subtitle">{total} registered users</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchUsers}>
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
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="manage-filters">
          {["", "admin", "author", "user"].map((r) => (
            <button
              key={r}
              className={`manage-filter-btn ${roleFilter === r ? "is-active" : ""}`}
              onClick={() => {
                setRoleFilter(r);
                setPage(1);
              }}
            >
              {r === "" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="manage-table-card">
        <div className="manage-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Articles</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}>
                        <div
                          className="skeleton"
                          style={{ height: 16, borderRadius: 4 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="manage-empty-cell">
                    <div className="manage-empty-state">
                      <span>👥</span>
                      <p>No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="users-user-cell">
                        <img
                          src={user.avatar || generateAvatarUrl(user.name, 40)}
                          alt={user.name}
                          className="users-avatar"
                        />
                        <span className="users-name">{user.name}</span>
                      </div>
                    </td>
                    <td className="users-email">{user.email}</td>
                    <td>
                      <select
                        className="users-role-select"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        style={{
                          color:
                            ROLE_COLORS[user.role] || "var(--text-primary)",
                        }}
                      >
                        <option value="admin">Admin</option>
                        <option value="author">Author</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td>{user.articlesCount || 0}</td>
                    <td className="dash-table-date">
                      {formatDateShort(user.createdAt)}
                    </td>
                    <td>
                      <div className="dash-table-actions">
                        <button
                          className="dash-action-btn"
                          onClick={() => setSelectedUser(user)}
                          aria-label="View user"
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
                        </button>
                        <button
                          className="dash-action-btn dash-action-delete"
                          onClick={() => setDeleteTarget(user)}
                          aria-label="Remove user"
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
            <span className="manage-page-info">
              Page {page} of {totalPages} · {total} users
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

      {/* View user modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="User Details"
        size="sm"
        footer={
          <>
            <button
              className="btn btn-secondary btn-sm"
              style={{
                color: "var(--color-error)",
                borderColor: "var(--color-error)",
              }}
              onClick={() => {
                setDeleteTarget(selectedUser);
                setSelectedUser(null);
              }}
            >
              Remove User
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </>
        }
      >
        {selectedUser && (
          <div className="user-detail-modal">
            <img
              src={
                selectedUser.avatar || generateAvatarUrl(selectedUser.name, 80)
              }
              alt={selectedUser.name}
              className="user-detail-avatar"
            />
            <h3 className="user-detail-name">{selectedUser.name}</h3>
            <p className="user-detail-email">{selectedUser.email}</p>
            {selectedUser.bio && (
              <p className="user-detail-bio">{selectedUser.bio}</p>
            )}
            <div className="user-detail-stats">
              <div className="user-detail-stat">
                <span style={{ color: ROLE_COLORS[selectedUser.role] }}>
                  {selectedUser.role}
                </span>
                <span>Role</span>
              </div>
              <div className="user-detail-stat">
                <span>{selectedUser.articlesCount || 0}</span>
                <span>Articles</span>
              </div>
              <div className="user-detail-stat">
                <span>{formatDateShort(selectedUser.createdAt)}</span>
                <span>Joined</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove User"
        size="sm"
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
              {deleting ? "Removing…" : "Remove User"}
            </button>
          </>
        }
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Remove <strong>{deleteTarget?.name}</strong> from MindBlog? Their
          content will remain but they won't be able to log in.
        </p>
      </Modal>
    </div>
  );
};

export default ManageUsers;
