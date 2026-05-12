import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/categoryService";
import { CATEGORIES } from "../../utils/constants";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "./Categories.css";

const Reveal = ({ children, delay = 0 }) => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.08 });
  return (
    <div
      ref={ref}
      className={`reveal ${hasIntersected ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => {
        if (data?.categories?.length) setCategories(data.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <div className="container">
          <span className="section-label">Explore</span>
          <h1 className="categories-title">Browse by Topic</h1>
          <p className="categories-subtitle">
            From deep tech to human psychology — find stories on every subject
            that moves you.
          </p>
        </div>
      </div>

      <div className="container categories-content">
        {/* Grid */}
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug || cat._id || i} delay={i * 50}>
              <Link
                to={`/categories/${cat.slug}`}
                className="category-card"
                style={{ "--cat-color": cat.color || "var(--color-primary)" }}
              >
                <div className="category-card-icon-wrap">
                  <span className="category-card-icon">{cat.icon || "📌"}</span>
                </div>
                <div className="category-card-body">
                  <h2 className="category-card-name">{cat.name}</h2>
                  {cat.description && (
                    <p className="category-card-desc">{cat.description}</p>
                  )}
                  <div className="category-card-footer">
                    {cat.count > 0 && (
                      <span className="category-card-count">
                        {cat.count} articles
                      </span>
                    )}
                    <span className="category-card-cta">
                      Explore
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="category-card-bg-icon" aria-hidden="true">
                  {cat.icon || "📌"}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="categories-cta">
          <div className="categories-cta-inner">
            <h2 className="categories-cta-title">Can't find your topic?</h2>
            <p className="categories-cta-desc">
              We're always adding new topics. Use search to find any subject.
            </p>
            <Link to="/blogs" className="btn btn-primary btn-lg">
              Browse All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
