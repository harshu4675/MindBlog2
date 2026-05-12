import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../BlogCard/BlogCard";
import { SkeletonGrid } from "../SkeletonCard/SkeletonCard";
import { blogService } from "../../services/blogService";
import "./FeaturedBlogs.css";

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService
      .getFeatured()
      .then((data) => setBlogs(data?.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="featured-blogs section">
      <div className="container">
        <div className="featured-blogs-header">
          <div className="section-header">
            <span className="section-label">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Featured
            </span>
            <h2 className="section-title">Editor's Picks</h2>
            <p className="section-subtitle">
              Hand-selected stories that inspire, inform, and spark new ideas.
            </p>
          </div>
          <Link to="/blogs" className="btn btn-secondary">
            View All
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={6} variant="featured" />
        ) : blogs.length > 0 ? (
          <div className="featured-grid">
            {blogs.slice(0, 6).map((blog) => (
              <BlogCard key={blog._id} blog={blog} variant="featured" />
            ))}
          </div>
        ) : (
          <div className="featured-empty">
            <p>No featured posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBlogs;
