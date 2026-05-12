import { api } from "./api";

export const analyticsService = {
  getOverview: (range = "30d") =>
    api.get(`/analytics/overview?range=${range}`, true),

  getTraffic: (range = "30d") =>
    api.get(`/analytics/traffic?range=${range}`, true),

  getTopBlogs: (limit = 10) =>
    api.get(`/analytics/top-blogs?limit=${limit}`, true),

  getDeviceBreakdown: () => api.get("/analytics/devices", true),

  getTrafficSources: () => api.get("/analytics/sources", true),

  getLiveVisitors: () => api.get("/analytics/live", true),

  getEngagement: (range = "30d") =>
    api.get(`/analytics/engagement?range=${range}`, true),

  getUserGrowth: (range = "30d") =>
    api.get(`/analytics/user-growth?range=${range}`, true),
};
