export const APP_NAME = "MindBlog";
export const APP_TAGLINE = "Ideas Worth Reading";
export const APP_DESCRIPTION =
  "Discover stories, thinking, and expertise from writers on any topic.";

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Blogs", path: "/blogs" },
  { label: "Categories", path: "/categories" },
  { label: "About", path: "/about" },
];

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/mindblog",
  instagram: "https://instagram.com/mindblog",
  linkedin: "https://linkedin.com/company/mindblog",
  github: "https://github.com/mindblog",
  youtube: "https://youtube.com/mindblog",
};

export const CATEGORIES = [
  { name: "Technology", slug: "technology", icon: "💻", color: "#6c63ff" },
  { name: "Design", slug: "design", icon: "🎨", color: "#06b6d4" },
  { name: "Startup", slug: "startup", icon: "🚀", color: "#f59e0b" },
  { name: "Science", slug: "science", icon: "🔬", color: "#10b981" },
  {
    name: "Mental Health",
    slug: "mental-health",
    icon: "🧠",
    color: "#a78bfa",
  },
  { name: "Productivity", slug: "productivity", icon: "⚡", color: "#ef4444" },
  { name: "Finance", slug: "finance", icon: "💰", color: "#14b8a6" },
  { name: "Travel", slug: "travel", icon: "✈️", color: "#f97316" },
];

export const READ_TIMES = [
  { label: "Quick read", value: "1-5" },
  { label: "Medium", value: "5-15" },
  { label: "Long read", value: "15+" },
];

export const SORT_OPTIONS = [
  { label: "Latest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Read", value: "views" },
  { label: "Most Liked", value: "likes" },
];

export const BLOG_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  SCHEDULED: "scheduled",
  ARCHIVED: "archived",
};

export const ROLES = {
  ADMIN: "admin",
  AUTHOR: "author",
  USER: "user",
};

export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 10;

export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80";

export const PLACEHOLDER_AVATAR =
  "https://ui-avatars.com/api/?background=6c63ff&color=fff&size=128";
