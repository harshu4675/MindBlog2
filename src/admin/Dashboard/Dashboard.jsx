import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAnalytics } from "../../context/AnalyticsContext";
import { useToast } from "../../context/ToastContext";
import { blogService } from "../../services/blogService";
import { formatNumber, timeAgo } from "../../utils/helpers";
import "./Dashboard.css";

/* ═══════════════════════════════════════════════
   1. StatCard — defined first, no dependencies
═══════════════════════════════════════════════ */
const StatCard = ({ icon, label, value, change, color, isLive }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-header">
      <div
        className="dash-stat-icon-wrap"
        style={{
          background: `${color}18`,
          border: `1.5px solid ${color}30`,
        }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="dash-stat-badge-row">
        {isLive && <span className="dash-live-badge">LIVE</span>}
        {change !== undefined && change !== null && (
          <span
            className={`dash-stat-change ${
              change >= 0 ? "positive" : "negative"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
    <div className="dash-stat-value">{value}</div>
    <div className="dash-stat-label">{label}</div>
  </div>
);

/* ═══════════════════════════════════════════════
   2. HeroBlogSelector — defined second
      Depends on: useToast (hook used inside component body)
═══════════════════════════════════════════════ */
const HeroBlogSelector = ({ blogs }) => {
  const { toast } = useToast();
  const [currentHeroId, setCurrentHeroId] = useState(
    () => localStorage.getItem("mindblog-hero-blog") || "",
  );
  const [saving, setSaving] = useState(false);

  const handleSelect = (blogId) => {
    setSaving(true);
    if (blogId) {
      localStorage.setItem("mindblog-hero-blog", blogId);
    } else {
      localStorage.removeItem("mindblog-hero-blog");
    }
    setCurrentHeroId(blogId);
    setTimeout(() => {
      setSaving(false);
      toast.success(
        blogId
          ? "Hero blog updated! Visit homepage to see it."
          : "Hero blog cleared — homepage will show latest featured.",
      );
    }, 300);
  };

  return (
    <div className="dash-hero-selector">
      <div className="dash-hero-selector-header">
        <div>
          <h3 className="dash-chart-title">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ marginRight: 8, verticalAlign: "middle" }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Hero Section Blog
          </h3>
          <p className="dash-chart-subtitle">
            Select which article to showcase on the homepage hero
          </p>
        </div>
        {currentHeroId && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleSelect("")}
            disabled={saving}
          >
            Clear Selection
          </button>
        )}
      </div>

      <div className="dash-hero-grid">
        {blogs.length === 0 ? (
          <div className="dash-hero-empty">
            <span>📝</span>
            <p>No published articles yet.</p>
            <Link to="/admin/blogs/new" className="btn btn-primary btn-sm">
              Create First Article
            </Link>
          </div>
        ) : (
          blogs.map((blog) => (
            <button
              key={blog._id}
              className={`dash-hero-card ${
                currentHeroId === blog._id ? "is-selected" : ""
              }`}
              onClick={() => handleSelect(blog._id)}
              disabled={saving}
              title={`Set "${blog.title}" as hero blog`}
            >
              {blog.thumbnail && (
                <img
                  src={blog.thumbnail}
                  alt=""
                  className="dash-hero-card-img"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <div className="dash-hero-card-info">
                <span className="dash-hero-card-title">{blog.title}</span>
                <span className="dash-hero-card-meta">
                  {blog.author?.name || "Unknown"} ·{" "}
                  {blog.category?.name || "Uncategorized"}
                </span>
              </div>
              {currentHeroId === blog._id && (
                <span className="dash-hero-selected-badge">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Active
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   3. Dashboard — defined last, uses both above
═══════════════════════════════════════════════ */
const Dashboard = () => {
  /* ── All hooks at the very top ── */
  const { liveVisitors, todayStats, trafficHistory } = useAnalytics();
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  /* ── Fetch recent blogs ── */
  useEffect(() => {
    blogService
      .getAll({ page: 1, limit: 6, sort: "newest", showAll: true })
      .then((data) => setRecentBlogs(data?.blogs || []))
      .catch(() => setRecentBlogs([]))
      .finally(() => setLoadingBlogs(false));
  }, []);

  /* ── Derived values ── */
  const totalViews =
    trafficHistory.reduce((s, d) => s + (d.views || 0), 0) ||
    todayStats.views ||
    0;

  const totalUsers =
    trafficHistory.reduce((s, d) => s + (d.users || 0), 0) ||
    todayStats.uniqueUsers ||
    0;

  const chartData =
    trafficHistory.length > 0
      ? trafficHistory.slice(-7)
      : [
          { date: "Mon", views: 0, users: 0 },
          { date: "Tue", views: 0, users: 0 },
          { date: "Wed", views: 0, users: 0 },
          { date: "Thu", views: 0, users: 0 },
          { date: "Fri", views: 0, users: 0 },
          { date: "Sat", views: 0, users: 0 },
          { date: "Sun", views: 0, users: 0 },
        ];

  const CATEGORY_DATA = [
    { name: "Technology", value: 35, color: "#6c63ff" },
    { name: "Design", value: 22, color: "#06b6d4" },
    { name: "Startup", value: 18, color: "#f59e0b" },
    { name: "Science", value: 14, color: "#10b981" },
    { name: "Other", value: 11, color: "#a78bfa" },
  ];

  /* ── Render ── */
  return (
    <div className="dashboard">
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Welcome back! Here's what's happening today.
          </p>
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

      {/* ── Stat cards ── */}
      <div className="dash-stats-grid">
        <StatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          label="Total Page Views"
          value={formatNumber(totalViews)}
          change={12.5}
          color="#6c63ff"
        />
        <StatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          }
          label="Unique Visitors"
          value={formatNumber(totalUsers)}
          change={8.2}
          color="#06b6d4"
        />
        <StatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
          }
          label="Published Articles"
          value={formatNumber(recentBlogs.length || 0)}
          change={5.1}
          color="#10b981"
        />
        <StatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
          label="Live Visitors"
          value={liveVisitors}
          change={null}
          color="#f59e0b"
          isLive={true}
        />
      </div>

      {/* ── Hero Blog Selector ── */}
      <HeroBlogSelector blogs={recentBlogs} />

      {/* ── Charts row ── */}
      <div className="dash-charts-row">
        {/* Traffic chart */}
        <div className="dash-chart-card dash-chart-card-main">
          <div className="dash-chart-header">
            <div>
              <h3 className="dash-chart-title">Weekly Traffic</h3>
              <p className="dash-chart-subtitle">
                Real visitor data · {todayStats.views} views today
              </p>
            </div>
            <div className="dash-chart-legend">
              {[
                { color: "#6c63ff", label: "Views" },
                { color: "#06b6d4", label: "Users" },
              ].map((l) => (
                <span key={l.label} className="dash-chart-legend-item">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: l.color,
                      display: "inline-block",
                      marginRight: 4,
                    }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <div className="dash-chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="dashViewsGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="dashUsersGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    fontSize: "13px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#6c63ff"
                  strokeWidth={2.5}
                  fill="url(#dashViewsGrad)"
                  name="Views"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#dashUsersGrad)"
                  name="Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category pie */}
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <h3 className="dash-chart-title">By Category</h3>
          </div>
          <div className="dash-chart-wrap">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {CATEGORY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    fontSize: "13px",
                  }}
                  formatter={(v) => [`${v}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="dash-pie-legend">
              {CATEGORY_DATA.map((cat) => (
                <div key={cat.name} className="dash-pie-legend-item">
                  <span
                    className="dash-pie-legend-dot"
                    style={{ background: cat.color }}
                  />
                  <span className="dash-pie-legend-name">{cat.name}</span>
                  <span className="dash-pie-legend-val">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent articles table ── */}
      <div className="dash-recent-card">
        <div className="dash-chart-header">
          <div>
            <h3 className="dash-chart-title">Recent Articles</h3>
            <p className="dash-chart-subtitle">
              Latest published and draft content
            </p>
          </div>
          <Link to="/admin/blogs" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>

        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Views</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingBlogs ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}>
                        <div
                          className="skeleton"
                          style={{ height: 14, borderRadius: 4 }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "var(--space-10)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    No articles yet.{" "}
                    <Link
                      to="/admin/blogs/new"
                      style={{ color: "var(--color-primary)" }}
                    >
                      Create your first article →
                    </Link>
                  </td>
                </tr>
              ) : (
                recentBlogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="dash-table-title">{blog.title}</td>
                    <td className="dash-table-author">
                      {blog.author?.name || "—"}
                    </td>
                    <td>{formatNumber(blog.views || 0)}</td>
                    <td>
                      <span
                        className={`badge ${
                          blog.status === "published"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {blog.status || "draft"}
                      </span>
                    </td>
                    <td className="dash-table-date">
                      {timeAgo(blog.createdAt)}
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
                            rel="noopener noreferrer"
                            aria-label="View on site"
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
