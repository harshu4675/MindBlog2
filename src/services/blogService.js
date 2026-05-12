import { api } from "./api";

/* ── Mock blogs for demo (no backend needed) ── */
const MOCK_BLOGS = [
  {
    _id: "blog-001",
    title: "The Future of AI in Creative Writing",
    slug: "future-of-ai-creative-writing",
    excerpt:
      "How artificial intelligence is reshaping storytelling, content creation, and the very definition of authorship.",
    content:
      "<h2>Introduction</h2><p>Artificial intelligence is no longer a distant concept — it is actively reshaping how we write, create, and communicate. From auto-completing sentences to generating full essays, AI tools are becoming indispensable for modern writers.</p><h2>The Creative Shift</h2><p>The integration of AI in creative workflows doesn't replace human creativity. Instead, it amplifies it. Writers can now focus more on ideas, structure, and emotion while letting AI handle repetitive drafting tasks.</p><h2>What This Means for the Future</h2><p>As AI models become more sophisticated, the line between human and machine-generated content will blur. This raises important questions about authenticity, copyright, and the value of human creativity.</p><p>The writers who thrive will be those who learn to collaborate with AI rather than compete against it.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    category: {
      _id: "cat-001",
      name: "Technology",
      slug: "technology",
      color: "#6c63ff",
    },
    author: {
      _id: "admin-001",
      name: "Alex Morgan",
      avatar: null,
      bio: "Founder & Editor",
    },
    tags: ["ai", "writing", "technology", "future"],
    status: "published",
    featured: true,
    views: 24800,
    likes: 1240,
    readTime: "6 min read",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "blog-002",
    title: "Design Systems That Scale: A Practical Guide",
    slug: "design-systems-that-scale",
    excerpt:
      "Building a design system that grows with your product without becoming a maintenance nightmare.",
    content:
      "<h2>Why Design Systems Matter</h2><p>A well-built design system is the backbone of any scalable product. It ensures consistency, speeds up development, and creates a shared language between designers and developers.</p><h2>Core Principles</h2><p>The best design systems are built on three pillars: consistency, flexibility, and documentation. Without all three, the system will eventually break down as the team grows.</p><h2>Practical Steps</h2><p>Start small. Define your tokens — colors, spacing, typography — before building components. Each component should be atomic, composable, and well-documented.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
    category: {
      _id: "cat-002",
      name: "Design",
      slug: "design",
      color: "#06b6d4",
    },
    author: {
      _id: "user-001",
      name: "Sarah Kim",
      avatar: null,
      bio: "UX Designer",
    },
    tags: ["design", "systems", "ux", "scalability"],
    status: "published",
    featured: true,
    views: 18400,
    likes: 920,
    readTime: "8 min read",
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
  {
    _id: "blog-003",
    title: "Building Your First SaaS Product in 2024",
    slug: "building-first-saas-2024",
    excerpt:
      "A founder's honest guide to shipping your first software product — mistakes included.",
    content:
      "<h2>Start Before You're Ready</h2><p>The biggest mistake first-time founders make is waiting until everything is perfect. The truth is, your first version will be rough. Ship it anyway.</p><h2>Find the Problem First</h2><p>Before writing a single line of code, talk to at least 20 potential customers. Understand their pain deeply. The product should feel like an obvious solution, not a clever idea.</p><h2>Pricing Strategy</h2><p>Charge from day one. Free users give you feedback but not revenue. You need both to survive. Start with a simple pricing model and evolve it as you learn.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
    category: {
      _id: "cat-003",
      name: "Startup",
      slug: "startup",
      color: "#f59e0b",
    },
    author: {
      _id: "admin-001",
      name: "Alex Morgan",
      avatar: null,
      bio: "Founder & Editor",
    },
    tags: ["startup", "saas", "entrepreneurship", "product"],
    status: "published",
    featured: false,
    views: 15200,
    likes: 760,
    readTime: "10 min read",
    createdAt: "2024-01-13T10:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
  },
  {
    _id: "blog-004",
    title: "The Psychology of Deep Work and Flow States",
    slug: "psychology-deep-work-flow",
    excerpt:
      "Understanding the neuroscience behind peak performance and how to engineer flow states deliberately.",
    content:
      "<h2>What is Flow?</h2><p>Flow is a state of complete immersion in a challenging activity. It was first described by psychologist Mihaly Csikszentmihalyi and has since become a cornerstone of peak performance research.</p><h2>Engineering Your Environment</h2><p>Flow doesn't happen by accident. It requires the right environment, the right challenge level, and deliberate elimination of distractions. Your workspace is your first line of defense.</p><h2>The 90-Minute Rule</h2><p>Research shows the brain operates in 90-minute ultradian cycles. Aligning your deep work sessions with these cycles can dramatically improve output quality and mental endurance.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    category: {
      _id: "cat-005",
      name: "Mental Health",
      slug: "mental-health",
      color: "#a78bfa",
    },
    author: {
      _id: "user-001",
      name: "Demo User",
      avatar: null,
      bio: "Regular reader",
    },
    tags: ["productivity", "psychology", "focus", "flow"],
    status: "published",
    featured: true,
    views: 12600,
    likes: 630,
    readTime: "7 min read",
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
  {
    _id: "blog-005",
    title: "10 Essential VS Code Extensions for 2024",
    slug: "vscode-extensions-2024",
    excerpt:
      "Supercharge your development workflow with these carefully curated VS Code extensions.",
    content:
      "<h2>Why Extensions Matter</h2><p>The right extensions can cut your development time by 30% or more. After years of experimenting, these are the ones that have earned permanent spots in my setup.</p><h2>Top Picks</h2><p>1. GitLens — supercharge Git capabilities. 2. Prettier — automatic code formatting. 3. ESLint — catch errors before they reach production. 4. Thunder Client — API testing inside VS Code. 5. Error Lens — inline error highlighting.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    category: {
      _id: "cat-001",
      name: "Technology",
      slug: "technology",
      color: "#6c63ff",
    },
    author: {
      _id: "admin-001",
      name: "Alex Morgan",
      avatar: null,
      bio: "Founder & Editor",
    },
    tags: ["vscode", "developer", "tools", "productivity"],
    status: "published",
    featured: false,
    views: 9800,
    likes: 490,
    readTime: "5 min read",
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-11T10:00:00Z",
  },
  {
    _id: "blog-006",
    title: "Understanding React Server Components",
    slug: "react-server-components-guide",
    excerpt:
      "A deep dive into React Server Components — what they are, why they matter, and when to use them.",
    content:
      "<h2>The Problem They Solve</h2><p>Traditional React components run on the client. This means JavaScript is shipped to the browser, parsed, and executed before the user sees anything. Server Components flip this model.</p><h2>How They Work</h2><p>Server Components render on the server and send HTML to the client. They can access databases, file systems, and APIs directly — without exposing sensitive data to the client.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    category: {
      _id: "cat-001",
      name: "Technology",
      slug: "technology",
      color: "#6c63ff",
    },
    author: {
      _id: "user-001",
      name: "Demo User",
      avatar: null,
      bio: "Regular reader",
    },
    tags: ["react", "javascript", "webdev", "nextjs"],
    status: "draft",
    featured: false,
    views: 0,
    likes: 0,
    readTime: "9 min read",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
];

/* ── Local storage blog management ── */
const getLocalBlogs = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("mindblog-blogs")) || [];
    return [...MOCK_BLOGS, ...stored];
  } catch {
    return MOCK_BLOGS;
  }
};

const saveLocalBlog = (blog) => {
  try {
    const stored = JSON.parse(localStorage.getItem("mindblog-blogs")) || [];
    const exists = stored.findIndex((b) => b._id === blog._id);
    if (exists >= 0) stored[exists] = blog;
    else stored.push(blog);
    localStorage.setItem("mindblog-blogs", JSON.stringify(stored));
  } catch {}
};

const deleteLocalBlog = (id) => {
  try {
    const stored = JSON.parse(localStorage.getItem("mindblog-blogs")) || [];
    localStorage.setItem(
      "mindblog-blogs",
      JSON.stringify(stored.filter((b) => b._id !== id)),
    );
  } catch {}
};

/* ── Try API, fall back to local ── */
const tryApi = async (apiFn, fallbackFn) => {
  try {
    return await apiFn();
  } catch {
    return fallbackFn();
  }
};

export const blogService = {
  getAll: async (params = {}) => {
    return tryApi(
      async () => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/blogs${query ? `?${query}` : ""}`);
      },
      () => {
        let blogs = getLocalBlogs();

        /* Search */
        if (params.search) {
          const q = params.search.toLowerCase();
          blogs = blogs.filter(
            (b) =>
              b.title.toLowerCase().includes(q) ||
              b.excerpt?.toLowerCase().includes(q) ||
              b.tags?.some((t) => t.toLowerCase().includes(q)),
          );
        }

        /* Category filter */
        if (params.category) {
          blogs = blogs.filter(
            (b) =>
              b.category?.slug === params.category ||
              b.category?._id === params.category,
          );
        }

        /* Status filter */
        if (params.status) {
          blogs = blogs.filter((b) => b.status === params.status);
        } else {
          /* Default: show all for admin, published for public */
          if (!params.showAll) {
            blogs = blogs.filter((b) => b.status === "published");
          }
        }

        /* Sort */
        const sort = params.sort || "newest";
        if (sort === "newest")
          blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sort === "oldest")
          blogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        else if (sort === "views")
          blogs.sort((a, b) => (b.views || 0) - (a.views || 0));
        else if (sort === "likes")
          blogs.sort((a, b) => (b.likes || 0) - (a.likes || 0));

        /* Pagination */
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 12;
        const total = blogs.length;
        const paginated = blogs.slice((page - 1) * limit, page * limit);

        return {
          blogs: paginated,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      },
    );
  },

  getById: async (id) => {
    return tryApi(
      () => api.get(`/blogs/${id}`),
      () => {
        const blog = getLocalBlogs().find((b) => b._id === id);
        if (!blog) throw new Error("Blog not found");
        return { blog };
      },
    );
  },

  getBySlug: async (slug) => {
    return tryApi(
      () => api.get(`/blogs/slug/${slug}`),
      () => {
        const blog = getLocalBlogs().find((b) => b.slug === slug);
        if (!blog) throw new Error("Blog not found");
        return { blog };
      },
    );
  },

  getFeatured: async () => {
    return tryApi(
      () => api.get("/blogs/featured"),
      () => {
        const blogs = getLocalBlogs()
          .filter((b) => b.featured && b.status === "published")
          .slice(0, 6);
        return { blogs };
      },
    );
  },

  getTrending: async () => {
    return tryApi(
      () => api.get("/blogs/trending"),
      () => {
        const blogs = getLocalBlogs()
          .filter((b) => b.status === "published")
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 6);
        return { blogs };
      },
    );
  },

  getRelated: async (id) => {
    return tryApi(
      () => api.get(`/blogs/${id}/related`),
      () => {
        const blog = getLocalBlogs().find((b) => b._id === id);
        const related = getLocalBlogs()
          .filter(
            (b) =>
              b._id !== id &&
              b.status === "published" &&
              b.category?.slug === blog?.category?.slug,
          )
          .slice(0, 4);
        return { blogs: related };
      },
    );
  },

  create: async (data) => {
    return tryApi(
      () => api.post("/blogs", data, true),
      () => {
        const newBlog = {
          ...data,
          _id: `blog-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          likes: 0,
          comments: [],
        };
        saveLocalBlog(newBlog);
        return { blog: newBlog };
      },
    );
  },

  update: async (id, data) => {
    return tryApi(
      () => api.put(`/blogs/${id}`, data, true),
      () => {
        const blogs = getLocalBlogs();
        const existing = blogs.find((b) => b._id === id);
        if (!existing) throw new Error("Blog not found");
        const updated = {
          ...existing,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        saveLocalBlog(updated);
        return { blog: updated };
      },
    );
  },

  delete: async (id) => {
    return tryApi(
      () => api.delete(`/blogs/${id}`, true),
      () => {
        /* Can only delete user-created blogs, not mock ones */
        const stored = JSON.parse(localStorage.getItem("mindblog-blogs")) || [];
        const idx = stored.findIndex((b) => b._id === id);
        if (idx >= 0) {
          stored.splice(idx, 1);
          localStorage.setItem("mindblog-blogs", JSON.stringify(stored));
        }
        return { success: true };
      },
    );
  },

  uploadImage: async (formData) => {
    return tryApi(
      () => api.upload("/blogs/upload", formData),
      () => {
        /* Return a placeholder for demo */
        return {
          url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
        };
      },
    );
  },

  toggleLike: async (id) => {
    return tryApi(
      () => api.post(`/blogs/${id}/like`, {}, true),
      () => {
        const blogs = getLocalBlogs();
        const blog = blogs.find((b) => b._id === id);
        if (blog) {
          blog.likes = (blog.likes || 0) + 1;
          saveLocalBlog(blog);
        }
        return { success: true };
      },
    );
  },

  getComments: async (id) => {
    return tryApi(
      () => api.get(`/blogs/${id}/comments`),
      () => {
        try {
          const comments =
            JSON.parse(localStorage.getItem(`mindblog-comments-${id}`)) || [];
          return { comments };
        } catch {
          return { comments: [] };
        }
      },
    );
  },

  addComment: async (id, data) => {
    return tryApi(
      () => api.post(`/blogs/${id}/comments`, data, true),
      () => {
        const session = JSON.parse(localStorage.getItem("mindblog-session"));
        const newComment = {
          _id: `comment-${Date.now()}`,
          content: data.content,
          author: session?.user || { name: "Anonymous", _id: "guest" },
          createdAt: new Date().toISOString(),
        };
        const existing =
          JSON.parse(localStorage.getItem(`mindblog-comments-${id}`)) || [];
        localStorage.setItem(
          `mindblog-comments-${id}`,
          JSON.stringify([newComment, ...existing]),
        );
        return { comment: newComment };
      },
    );
  },

  deleteComment: async (blogId, commentId) => {
    return tryApi(
      () => api.delete(`/blogs/${blogId}/comments/${commentId}`, true),
      () => {
        const existing =
          JSON.parse(localStorage.getItem(`mindblog-comments-${blogId}`)) || [];
        localStorage.setItem(
          `mindblog-comments-${blogId}`,
          JSON.stringify(existing.filter((c) => c._id !== commentId)),
        );
        return { success: true };
      },
    );
  },

  incrementView: async (id) => {
    return tryApi(
      () => api.post(`/blogs/${id}/view`, {}),
      () => {
        /* Track views in localStorage for analytics */
        const views = JSON.parse(localStorage.getItem("mindblog-views")) || {};
        views[id] = (views[id] || 0) + 1;
        localStorage.setItem("mindblog-views", JSON.stringify(views));

        /* Track daily traffic */
        const today = new Date().toISOString().split("T")[0];
        const traffic =
          JSON.parse(localStorage.getItem("mindblog-traffic")) || {};
        if (!traffic[today]) traffic[today] = { views: 0, users: new Set() };
        traffic[today].views = (traffic[today].views || 0) + 1;
        localStorage.setItem(
          "mindblog-traffic",
          JSON.stringify(
            Object.fromEntries(
              Object.entries(traffic).map(([k, v]) => [
                k,
                { ...v, users: Array.isArray(v.users) ? v.users.length : 0 },
              ]),
            ),
          ),
        );
        return { success: true };
      },
    );
  },

  search: async (query, filters = {}) => {
    return tryApi(
      () =>
        api.get(
          `/blogs/search?q=${encodeURIComponent(query)}&${new URLSearchParams(filters)}`,
        ),
      () => {
        const q = query.toLowerCase();
        const blogs = getLocalBlogs()
          .filter(
            (b) =>
              b.status === "published" &&
              (b.title.toLowerCase().includes(q) ||
                b.excerpt?.toLowerCase().includes(q) ||
                b.tags?.some((t) => t.toLowerCase().includes(q)) ||
                b.category?.name.toLowerCase().includes(q)),
          )
          .slice(0, 10);
        return { blogs };
      },
    );
  },
};
