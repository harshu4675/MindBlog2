import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import { useToast } from "../../context/ToastContext";
import { generateAvatarUrl, formatDate } from "../../utils/helpers";
import {
  validateForm,
  isRequired,
  isEmail,
  isMinLength,
} from "../../utils/validators";
import "./Profile.css";

const TABS = ["Overview", "Bookmarks", "Reading History", "Settings"];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { bookmarks, readingHistory } = useBlog();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("Overview");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateForm(form, {
      name: [isRequired, isMinLength(2)],
      email: [isRequired, isEmail],
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      updateUser(form);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Cover */}
      <div className="profile-cover">
        <div className="profile-cover-gradient" aria-hidden="true" />
      </div>

      <div className="container profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <img
              src={user?.avatar || generateAvatarUrl(user?.name || "U", 128)}
              alt={user?.name}
              className="profile-avatar"
            />
            <button className="profile-avatar-edit" aria-label="Change avatar">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            {user?.bio && <p className="profile-bio">{user.bio}</p>}
            <span className="profile-role-badge">
              {user?.role === "admin"
                ? "👑 Admin"
                : user?.role === "author"
                  ? "✍️ Author"
                  : "👤 Reader"}
            </span>
          </div>

          <div className="profile-stats">
            {[
              { label: "Bookmarks", value: bookmarks.length },
              { label: "Read", value: readingHistory.length },
              {
                label: "Member since",
                value: user?.createdAt
                  ? formatDate(user.createdAt, {
                      month: "short",
                      year: "numeric",
                    })
                  : "2024",
              },
            ].map((s) => (
              <div key={s.label} className="profile-stat">
                <span className="profile-stat-value">{s.value}</span>
                <span className="profile-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <button
            className="btn btn-secondary profile-edit-btn"
            onClick={() => {
              setActiveTab("Settings");
              setEditMode(true);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Profile
          </button>
        </aside>

        {/* Main */}
        <main className="profile-main">
          {/* Tabs */}
          <div className="profile-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`profile-tab ${activeTab === tab ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab}
                {tab === "Bookmarks" && bookmarks.length > 0 && (
                  <span className="profile-tab-count">{bookmarks.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="profile-tab-content" role="tabpanel">
            {/* Overview */}
            {activeTab === "Overview" && (
              <div className="profile-overview">
                <div className="profile-welcome-card">
                  <h2 className="profile-welcome-title">
                    Welcome back, {user?.name?.split(" ")[0]}! 👋
                  </h2>
                  <p>
                    Here's a summary of your reading activity and saved content.
                  </p>
                </div>
                <div className="profile-overview-grid">
                  {[
                    {
                      icon: "🔖",
                      title: "Saved Articles",
                      value: bookmarks.length,
                      desc: "Articles bookmarked for later",
                    },
                    {
                      icon: "📖",
                      title: "Articles Read",
                      value: readingHistory.length,
                      desc: "From your reading history",
                    },
                    {
                      icon: "💬",
                      title: "Comments",
                      value: 0,
                      desc: "Comments posted",
                    },
                    {
                      icon: "❤️",
                      title: "Liked Articles",
                      value: 0,
                      desc: "Articles you've liked",
                    },
                  ].map((card) => (
                    <div key={card.title} className="profile-overview-card">
                      <span className="profile-overview-icon">{card.icon}</span>
                      <div>
                        <span className="profile-overview-value">
                          {card.value}
                        </span>
                        <span className="profile-overview-label">
                          {card.title}
                        </span>
                        <span className="profile-overview-desc">
                          {card.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookmarks */}
            {activeTab === "Bookmarks" && (
              <div className="profile-bookmarks">
                {bookmarks.length === 0 ? (
                  <div className="profile-empty">
                    <span className="profile-empty-icon">🔖</span>
                    <h3>No bookmarks yet</h3>
                    <p>
                      Start saving articles you love by clicking the bookmark
                      icon on any post.
                    </p>
                  </div>
                ) : (
                  <div className="profile-id-list">
                    {bookmarks.map((id) => (
                      <div key={id} className="profile-id-item">
                        <div
                          className="skeleton"
                          style={{
                            width: 64,
                            height: 52,
                            borderRadius: "var(--border-radius-md)",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            className="skeleton"
                            style={{
                              height: 16,
                              borderRadius: 4,
                              marginBottom: 8,
                            }}
                          />
                          <div
                            className="skeleton"
                            style={{
                              height: 12,
                              width: "60%",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <p
                      style={{
                        color: "var(--text-tertiary)",
                        fontSize: "var(--text-sm)",
                        textAlign: "center",
                        marginTop: "var(--space-4)",
                      }}
                    >
                      Connect to backend to load full bookmark data
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reading History */}
            {activeTab === "Reading History" && (
              <div className="profile-history">
                {readingHistory.length === 0 ? (
                  <div className="profile-empty">
                    <span className="profile-empty-icon">📚</span>
                    <h3>No reading history</h3>
                    <p>
                      Articles you read will appear here so you can find them
                      again easily.
                    </p>
                  </div>
                ) : (
                  <div className="profile-id-list">
                    {readingHistory.map((id) => (
                      <div key={id} className="profile-id-item">
                        <div
                          className="skeleton"
                          style={{
                            width: 64,
                            height: 52,
                            borderRadius: "var(--border-radius-md)",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            className="skeleton"
                            style={{
                              height: 16,
                              borderRadius: 4,
                              marginBottom: 8,
                            }}
                          />
                          <div
                            className="skeleton"
                            style={{
                              height: 12,
                              width: "50%",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <p
                      style={{
                        color: "var(--text-tertiary)",
                        fontSize: "var(--text-sm)",
                        textAlign: "center",
                        marginTop: "var(--space-4)",
                      }}
                    >
                      Connect to backend to load full history
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {activeTab === "Settings" && (
              <div className="profile-settings">
                <div className="profile-settings-card">
                  <div className="profile-settings-header">
                    <h2 className="profile-settings-title">
                      Personal Information
                    </h2>
                    {!editMode && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <form
                    onSubmit={handleSave}
                    className="profile-settings-form"
                    noValidate
                  >
                    <div className="profile-settings-row">
                      <div className="auth-form-group">
                        <label className="auth-form-label">Full Name</label>
                        <input
                          name="name"
                          type="text"
                          className={`input ${errors.name ? "auth-input-error" : ""}`}
                          value={form.name}
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                        {errors.name && (
                          <span className="auth-form-error">{errors.name}</span>
                        )}
                      </div>
                      <div className="auth-form-group">
                        <label className="auth-form-label">Email Address</label>
                        <input
                          name="email"
                          type="email"
                          className={`input ${errors.email ? "auth-input-error" : ""}`}
                          value={form.email}
                          onChange={handleChange}
                          disabled={!editMode}
                        />
                        {errors.email && (
                          <span className="auth-form-error">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="auth-form-group">
                      <label className="auth-form-label">Bio</label>
                      <textarea
                        name="bio"
                        className="input"
                        value={form.bio}
                        onChange={handleChange}
                        disabled={!editMode}
                        rows={3}
                        placeholder="Tell the community about yourself…"
                        style={{ resize: "vertical" }}
                      />
                    </div>
                    {editMode && (
                      <div className="profile-settings-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditMode(false);
                            setErrors({});
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? "Saving…" : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                <div className="profile-settings-card profile-danger-zone">
                  <h2
                    className="profile-settings-title"
                    style={{ color: "var(--color-error)" }}
                  >
                    Danger Zone
                  </h2>
                  <p>
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <button
                    className="btn"
                    style={{
                      background: "var(--color-error-light)",
                      color: "var(--color-error)",
                      border: "1px solid var(--color-error)",
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
