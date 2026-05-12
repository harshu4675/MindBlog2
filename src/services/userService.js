import { api } from "./api";

const MOCK_USERS = [
  {
    _id: "admin-001",
    name: "Admin User",
    email: "admin@mindblog.com",
    role: "admin",
    avatar: null,
    bio: "Platform administrator",
    articlesCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    lastActive: new Date().toISOString(),
  },
  {
    _id: "user-001",
    name: "Demo User",
    email: "user@mindblog.com",
    role: "user",
    avatar: null,
    bio: "Regular reader",
    articlesCount: 1,
    createdAt: "2024-01-05T00:00:00Z",
    lastActive: new Date().toISOString(),
  },
];

const getLocalUsers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("mindblog-users")) || [];
    const all = [
      ...MOCK_USERS,
      ...stored.map((u) => {
        const { password, ...safe } = u;
        return { ...safe, articlesCount: 0 };
      }),
    ];
    /* Remove duplicates by email */
    const seen = new Set();
    return all.filter((u) => {
      if (seen.has(u.email)) return false;
      seen.add(u.email);
      return true;
    });
  } catch {
    return MOCK_USERS;
  }
};

export const userService = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await api.get(`/users${query ? `?${query}` : ""}`, true);
    } catch {
      let users = getLocalUsers();

      if (params.search) {
        const q = params.search.toLowerCase();
        users = users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        );
      }

      if (params.role) {
        users = users.filter((u) => u.role === params.role);
      }

      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 10;
      const total = users.length;
      const paginated = users.slice((page - 1) * limit, page * limit);

      return { users: paginated, total };
    }
  },

  updateRole: async (userId, role) => {
    try {
      return await api.patch(`/users/${userId}/role`, { role }, true);
    } catch {
      return { success: true };
    }
  },

  delete: async (userId) => {
    try {
      return await api.delete(`/users/${userId}`, true);
    } catch {
      /* Remove from localStorage if registered user */
      const stored = JSON.parse(localStorage.getItem("mindblog-users")) || [];
      localStorage.setItem(
        "mindblog-users",
        JSON.stringify(stored.filter((u) => u._id !== userId)),
      );
      return { success: true };
    }
  },
};
