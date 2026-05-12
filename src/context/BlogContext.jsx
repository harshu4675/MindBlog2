import React, { createContext, useState, useCallback, useContext } from "react";

export const BlogContext = createContext(null);

export const BlogProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mindblog-bookmarks")) || [];
    } catch {
      return [];
    }
  });

  const [readingHistory, setReadingHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mindblog-history")) || [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = useCallback((blogId) => {
    setBookmarks((prev) => {
      const updated = prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId];
      localStorage.setItem("mindblog-bookmarks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (blogId) => bookmarks.includes(blogId),
    [bookmarks],
  );

  const addToHistory = useCallback((blogId) => {
    setReadingHistory((prev) => {
      const filtered = prev.filter((id) => id !== blogId);
      const updated = [blogId, ...filtered].slice(0, 20);
      localStorage.setItem("mindblog-history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <BlogContext.Provider
      value={{
        bookmarks,
        readingHistory,
        toggleBookmark,
        isBookmarked,
        addToHistory,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used within BlogProvider");
  return ctx;
};
