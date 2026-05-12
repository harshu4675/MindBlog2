import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

const AnalyticsContext = createContext(null);

/* ── Track real page views & sessions ── */
const SESSION_KEY = "mindblog-analytics-session";
const TRAFFIC_KEY = "mindblog-analytics-traffic";
const LIVE_KEY = "mindblog-analytics-live";

const getOrCreateSession = () => {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return JSON.parse(existing);
    const session = {
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      startTime: Date.now(),
      pages: [],
      device: getDeviceType(),
      referrer: document.referrer || "direct",
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch {
    return {
      id: "anon",
      startTime: Date.now(),
      pages: [],
      device: "desktop",
      referrer: "direct",
    };
  }
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
};

const getTrafficData = () => {
  try {
    return JSON.parse(localStorage.getItem(TRAFFIC_KEY)) || {};
  } catch {
    return {};
  }
};

const saveTrafficData = (data) => {
  localStorage.setItem(TRAFFIC_KEY, JSON.stringify(data));
};

const getLiveData = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(LIVE_KEY)) || {
        visitors: [],
        lastClean: Date.now(),
      }
    );
  } catch {
    return { visitors: [], lastClean: Date.now() };
  }
};

const saveLiveData = (data) => {
  localStorage.setItem(LIVE_KEY, JSON.stringify(data));
};

export const AnalyticsProvider = ({ children }) => {
  const [liveVisitors, setLiveVisitors] = useState(1);
  const [todayStats, setTodayStats] = useState({
    views: 0,
    sessions: 0,
    uniqueUsers: 0,
  });
  const [trafficHistory, setTrafficHistory] = useState([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState({
    mobile: 0,
    desktop: 0,
    tablet: 0,
  });
  const sessionRef = useRef(null);
  const heartbeatRef = useRef(null);

  /* ── Initialize session ── */
  useEffect(() => {
    const session = getOrCreateSession();
    sessionRef.current = session;

    const today = new Date().toISOString().split("T")[0];
    const traffic = getTrafficData();

    if (!traffic[today]) {
      traffic[today] = {
        views: 0,
        sessions: 0,
        uniqueUsers: [],
        devices: { mobile: 0, desktop: 0, tablet: 0 },
      };
    }

    /* Record this session */
    traffic[today].sessions = (traffic[today].sessions || 0) + 1;
    traffic[today].views = (traffic[today].views || 0) + 1;

    if (!traffic[today].uniqueUsers) traffic[today].uniqueUsers = [];
    if (!traffic[today].uniqueUsers.includes(session.id)) {
      traffic[today].uniqueUsers.push(session.id);
    }

    if (!traffic[today].devices) {
      traffic[today].devices = { mobile: 0, desktop: 0, tablet: 0 };
    }
    traffic[today].devices[session.device] =
      (traffic[today].devices[session.device] || 0) + 1;

    saveTrafficData(traffic);
    updateStats();

    /* Register as live visitor */
    registerLiveVisitor(session.id);

    /* Heartbeat every 15 seconds */
    heartbeatRef.current = setInterval(() => {
      registerLiveVisitor(session.id);
      setLiveVisitors(getActiveLiveCount());
    }, 15000);

    return () => {
      clearInterval(heartbeatRef.current);
      removeLiveVisitor(session.id);
    };
  }, []);

  const registerLiveVisitor = (sessionId) => {
    const live = getLiveData();
    const now = Date.now();

    /* Remove stale (older than 45 seconds) */
    live.visitors = (live.visitors || []).filter(
      (v) => now - v.timestamp < 45000,
    );

    /* Update or add this visitor */
    const idx = live.visitors.findIndex((v) => v.id === sessionId);
    if (idx >= 0) {
      live.visitors[idx].timestamp = now;
    } else {
      live.visitors.push({ id: sessionId, timestamp: now });
    }

    saveLiveData(live);
    setLiveVisitors(Math.max(1, live.visitors.length));
  };

  const removeLiveVisitor = (sessionId) => {
    const live = getLiveData();
    live.visitors = (live.visitors || []).filter((v) => v.id !== sessionId);
    saveLiveData(live);
  };

  const getActiveLiveCount = () => {
    const live = getLiveData();
    const now = Date.now();
    const active = (live.visitors || []).filter(
      (v) => now - v.timestamp < 45000,
    );
    return Math.max(1, active.length);
  };

  const updateStats = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    const traffic = getTrafficData();
    const todayData = traffic[today] || {};

    setTodayStats({
      views: todayData.views || 0,
      sessions: todayData.sessions || 0,
      uniqueUsers: (todayData.uniqueUsers || []).length,
    });

    /* Build 30-day history */
    const history = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split("T")[0];
      const d = traffic[key] || {};
      history.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        views: d.views || 0,
        users: (d.uniqueUsers || []).length,
        sessions: d.sessions || 0,
      });
    }
    setTrafficHistory(history);

    /* Device breakdown */
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    Object.values(traffic).forEach((day) => {
      if (day.devices) {
        devices.mobile += day.devices.mobile || 0;
        devices.desktop += day.devices.desktop || 0;
        devices.tablet += day.devices.tablet || 0;
      }
    });
    setDeviceBreakdown(devices);
  }, []);

  /* Track page views */
  const trackPageView = useCallback(
    (path) => {
      const today = new Date().toISOString().split("T")[0];
      const traffic = getTrafficData();
      if (!traffic[today]) {
        traffic[today] = {
          views: 0,
          sessions: 0,
          uniqueUsers: [],
          devices: {},
        };
      }
      traffic[today].views = (traffic[today].views || 0) + 1;
      saveTrafficData(traffic);
      updateStats();
    },
    [updateStats],
  );

  return (
    <AnalyticsContext.Provider
      value={{
        liveVisitors,
        todayStats,
        trafficHistory,
        deviceBreakdown,
        trackPageView,
        updateStats,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const ctx = useContext(AnalyticsContext);
  if (!ctx)
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  return ctx;
};
