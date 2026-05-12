import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import { CATEGORIES } from "../../utils/constants";
import "./TrendingTopics.css";

const TrendingTopics = () => {
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => {
        if (data?.categories?.length > 0) setCategories(data.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      className="trending-topics section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container">
        <div className="section-header text-center">
          <span className="section-label">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Explore
          </span>
          <h2 className="section-title">Trending Topics</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>
            Browse by subject and discover what readers are talking about right
            now.
          </p>
        </div>

        <div className="trending-grid">
          {categories.slice(0, 8).map((cat, i) => (
            <Link
              key={cat.slug || cat._id || i}
              to={`/categories/${cat.slug}`}
              className="trending-card"
              style={{ "--cat-color": cat.color || "var(--color-primary)" }}
            >
              <span className="trending-card-icon">{cat.icon}</span>
              <div className="trending-card-info">
                <h3 className="trending-card-name">{cat.name}</h3>
                {cat.count > 0 && (
                  <span className="trending-card-count">
                    {cat.count} articles
                  </span>
                )}
              </div>
              <svg
                className="trending-card-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingTopics;
