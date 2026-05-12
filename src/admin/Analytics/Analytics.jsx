import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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
import { blogService } from "../../services/blogService";
import { formatNumber } from "../../utils/helpers";
import "./Analytics.css";

const RANGES = ["7 days", "30 days", "3 months"];

const SOURCE_MAP = {
  direct: "Direct",
  "": "Direct",
  google: "Google",
  twitter: "Twitter",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

const Analytics = () => {
  const {
    liveVisitors,
    todayStats,
    trafficHistory,
    deviceBreakdown,
    updateStats,
  } = useAnalytics();

  const [range, setRange] = useState("30 days");
  const [topBlogs, setTopBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [tick, setTick] = useState(0);

  /* ── Refresh live data every 15s ── */
  useEffect(() => {
    const interval = setInterval(() => {
      updateStats();
      setTick((t) => t + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, [updateStats]);

  /* ── Load top blogs ── */
  useEffect(() => {
    blogService
      .getAll({ sort: "views", limit: 10, page: 1 })
      .then((data) => setTopBlogs(data?.blogs || []))
      .catch(() => setTopBlogs([]))
      .finally(() => setLoadingBlogs(false));
  }, []);

  /* ── Slice traffic history by range ── */
  const getFilteredHistory = useCallback(() => {
    const days = range === "7 days" ? 7 : range === "30 days" ? 30 : 90;
    return trafficHistory.slice(-days);
  }, [trafficHistory, range]);

  /* ── Device data for pie ── */
  const deviceData = [
    { name: "Mobile", value: deviceBreakdown.mobile || 0, color: "#6c63ff" },
    { name: "Desktop", value: deviceBreakdown.desktop || 0, color: "#06b6d4" },
    { name: "Tablet", value: deviceBreakdown.tablet || 0, color: "#a78bfa" },
  ].filter((d) => d.value > 0);

  /* ── Totals ── */
  const history = getFilteredHistory();
  const totalViews = history.reduce((s, d) => s + d.views, 0);
  const totalUsers = history.reduce((s, d) => s + d.users, 0);
  const totalSessions = history.reduce((s, d) => s + d.sessions, 0);
  const avgBounce = 38.2; /* Would come from real analytics */

  return (
    <div className="analytics-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Analytics</h1>
          <p className="admin-page-subtitle">
            Real-time insights · Auto-refreshes every 15s
          </p>
        </div>
        <div className="analytics-range-tabs">
          {RANGES.map((r) => (
            <button
              key={r}
              className={`analytics-range-btn ${range === r ? "is-active" : ""}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Live visitors bar */}
      <div className="analytics-live-bar">
        <span className="analytics-live-dot" />
        <strong>
          {liveVisitors} {liveVisitors === 1 ? "person" : "people"}
        </strong>{" "}
        on MindBlog right now
        <span className="analytics-live-sep">·</span>
        <span className="analytics-live-detail">
          {todayStats.views} views today
        </span>
        <span className="analytics-live-sep">·</span>
        <span className="analytics-live-detail">
          {todayStats.uniqueUsers} unique visitors
        </span>
        <span className="analytics-live-updated">· refreshes every 15s</span>
      </div>

      {/* Stat cards */}
      <div className="analytics-stats-grid">
        {[
          {
            label: "Total Page Views",
            value: formatNumber(totalViews || todayStats.views),
            change: 14.2,
            color: "#6c63ff",
            sub: `${todayStats.views} today`,
          },
          {
            label: "Unique Visitors",
            value: formatNumber(totalUsers || todayStats.uniqueUsers),
            change: 8.7,
            color: "#06b6d4",
            sub: `${todayStats.uniqueUsers} today`,
          },
          {
            label: "Total Sessions",
            value: formatNumber(totalSessions || todayStats.sessions),
            change: 5.1,
            color: "#10b981",
            sub: `${todayStats.sessions} today`,
          },
          {
            label: "Live Visitors",
            value: liveVisitors,
            change: null,
            color: "#f59e0b",
            sub: "right now",
            isLive: true,
          },
          {
            label: "Published Articles",
            value: topBlogs.length,
            change: null,
            color: "#a78bfa",
            sub: "total published",
          },
          {
            label: "Bounce Rate",
            value: `${avgBounce}%`,
            change: -3.4,
            color: "#ef4444",
            sub: "lower is better",
          },
        ].map((stat) => (
          <div key={stat.label} className="analytics-stat-card">
            <div className="analytics-stat-top">
              <span className="analytics-stat-label">{stat.label}</span>
              {stat.isLive && (
                <span className="analytics-live-badge">LIVE</span>
              )}
              {stat.change !== null && stat.change !== undefined && (
                <span
                  className={`analytics-stat-change ${stat.change >= 0 ? "pos" : "neg"}`}
                >
                  {stat.change >= 0 ? "+" : ""}
                  {stat.change}%
                </span>
              )}
            </div>
            <div className="analytics-stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="analytics-stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Traffic chart */}
      <div className="analytics-chart-card analytics-chart-full">
        <div className="analytics-chart-header">
          <div>
            <h3 className="analytics-chart-title">Traffic Overview</h3>
            <p className="analytics-chart-sub">
              Real visitor data tracked from your site · {range}
            </p>
          </div>
          <div className="analytics-legend">
            {[
              { color: "#6c63ff", label: "Views" },
              { color: "#06b6d4", label: "Users" },
            ].map((l) => (
              <span key={l.label} className="analytics-legend-item">
                <span
                  className="analytics-legend-dot"
                  style={{ background: l.color }}
                />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={getFilteredHistory()}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {[
                ["vG", "#6c63ff"],
                ["uG", "#06b6d4"],
              ].map(([id, color]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
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
              interval="preserveStartEnd"
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
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#6c63ff"
              strokeWidth={2.5}
              fill="url(#vG)"
              name="Views"
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#uG)"
              name="Visitors"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Second row */}
      <div className="analytics-charts-row">
        {/* Device breakdown */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Device Breakdown</h3>
          </div>
          {deviceData.length === 0 ? (
            <div className="analytics-no-data">
              <p>Tracking devices as visitors arrive…</p>
            </div>
          ) : (
            <div className="analytics-device-wrap">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {deviceData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                    formatter={(v, name, props) => {
                      const total = deviceData.reduce((s, d) => s + d.value, 0);
                      return [`${v} (${Math.round((v / total) * 100)}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="analytics-device-legend">
                {deviceData.map((d) => {
                  const total = deviceData.reduce((s, x) => s + x.value, 0);
                  const pct =
                    total > 0 ? Math.round((d.value / total) * 100) : 0;
                  return (
                    <div key={d.name} className="analytics-device-item">
                      <span
                        className="analytics-device-dot"
                        style={{ background: d.color }}
                      />
                      <span className="analytics-device-name">{d.name}</span>
                      <span className="analytics-device-val">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bar chart - daily views */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-header">
            <h3 className="analytics-chart-title">Daily Views</h3>
            <p className="analytics-chart-sub">Last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={trafficHistory.slice(-7)}
              margin={{ left: -20, right: 10, top: 5, bottom: 5 }}
            >
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
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="views"
                fill="#6c63ff"
                radius={[6, 6, 0, 0]}
                name="Views"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top performing articles */}
      <div className="analytics-chart-card analytics-chart-full">
        <div className="analytics-chart-header">
          <div>
            <h3 className="analytics-chart-title">Top Performing Articles</h3>
            <p className="analytics-chart-sub">Ranked by total views</p>
          </div>
        </div>
        <div className="analytics-top-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Article</th>
                <th>Category</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {loadingBlogs ? (
                Array.from({ length: 5 }).map((_, i) => (
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
              ) : topBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: "var(--space-8)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    No data yet. Publish articles to see analytics.
                  </td>
                </tr>
              ) : (
                topBlogs.map((blog, i) => {
                  const engagement =
                    blog.views > 0
                      ? Math.round(
                          ((blog.likes || 0) / blog.views) * 100 * 10,
                        ) / 10
                      : 0;
                  return (
                    <tr key={blog._id}>
                      <td>
                        <span className="analytics-rank">{i + 1}</span>
                      </td>
                      <td className="analytics-blog-title">{blog.title}</td>
                      <td>
                        <span
                          className="manage-cat-badge"
                          style={{
                            "--cat":
                              blog.category?.color || "var(--color-primary)",
                          }}
                        >
                          {blog.category?.name || "—"}
                        </span>
                      </td>
                      <td>
                        <strong>{formatNumber(blog.views || 0)}</strong>
                      </td>
                      <td>{formatNumber(blog.likes || 0)}</td>
                      <td>
                        <div className="analytics-engagement-wrap">
                          <div className="analytics-engagement-bar">
                            <div
                              className="analytics-engagement-fill"
                              style={{
                                width: `${Math.min(engagement * 10, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="analytics-engagement-val">
                            {engagement}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
