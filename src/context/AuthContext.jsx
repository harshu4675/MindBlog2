import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

export const AuthContext = createContext(null);

/* ── Hardcoded demo users (works without a backend) ── */
const DEMO_USERS = [
  {
    _id: "admin-001",
    name: "Admin User",
    email: "admin@mindblog.com",
    password: "Admin@123",
    role: "admin",
    avatar: null,
    bio: "Platform administrator",
  },
  {
    _id: "user-001",
    name: "Demo User",
    email: "user@mindblog.com",
    password: "User@123",
    role: "user",
    avatar: null,
    bio: "Regular reader",
  },
];

/* ── Registered users stored in localStorage ── */
const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("mindblog-users")) || [];
  } catch {
    return [];
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem("mindblog-users", JSON.stringify(users));
};

const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem("mindblog-session")) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Restore session on mount ── */
  useEffect(() => {
    const session = getStoredSession();
    if (session && session.user && session.expiresAt > Date.now()) {
      setUser(session.user);
    } else {
      localStorage.removeItem("mindblog-session");
      localStorage.removeItem("mindblog-token");
    }
    setLoading(false);
  }, []);

  /* ── Login ── */
  const login = useCallback(async ({ email, password }) => {
    setError(null);

    /* Try real API first */
    const token = localStorage.getItem("mindblog-token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("mindblog-token", data.token);
        const session = {
          user: data.user,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem("mindblog-session", JSON.stringify(session));
        setUser(data.user);
        return data;
      }
    } catch {
      /* API not available — fall through to local auth */
    }

    /* ── Local / demo authentication ── */
    const allUsers = [...DEMO_USERS, ...getStoredUsers()];
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!found) {
      throw new Error("Invalid email or password");
    }

    const { password: _pw, ...safeUser } = found;
    const fakeToken = btoa(
      JSON.stringify({
        id: safeUser._id,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }),
    );
    localStorage.setItem("mindblog-token", fakeToken);

    const session = {
      user: safeUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem("mindblog-session", JSON.stringify(session));
    setUser(safeUser);
    return { user: safeUser, token: fakeToken };
  }, []);

  /* ── Register ── */
  const register = useCallback(async ({ name, email, password }) => {
    setError(null);

    /* Try real API first */
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("mindblog-token", data.token);
        const session = {
          user: data.user,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem("mindblog-session", JSON.stringify(session));
        setUser(data.user);
        return data;
      }
    } catch {
      /* API not available — fall through to local register */
    }

    /* ── Local registration ── */
    const allUsers = [...DEMO_USERS, ...getStoredUsers()];
    const exists = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (exists) {
      throw new Error("An account with this email already exists");
    }

    const newUser = {
      _id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "user",
      avatar: null,
      bio: "",
      createdAt: new Date().toISOString(),
    };

    const storedUsers = getStoredUsers();
    saveStoredUsers([...storedUsers, newUser]);

    const { password: _pw, ...safeUser } = newUser;
    const fakeToken = btoa(
      JSON.stringify({
        id: safeUser._id,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }),
    );
    localStorage.setItem("mindblog-token", fakeToken);

    const session = {
      user: safeUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem("mindblog-session", JSON.stringify(session));
    setUser(safeUser);
    return { user: safeUser, token: fakeToken };
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem("mindblog-token");
    localStorage.removeItem("mindblog-session");
    setUser(null);
  }, []);

  /* ── Update user ── */
  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      const session = getStoredSession();
      if (session) {
        localStorage.setItem(
          "mindblog-session",
          JSON.stringify({ ...session, user: updated }),
        );
      }
      return updated;
    });
  }, []);

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
