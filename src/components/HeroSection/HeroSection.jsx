import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { blogService } from "../../services/blogService";
import { timeAgo, generateAvatarUrl } from "../../utils/helpers";
import { PLACEHOLDER_IMAGE } from "../../utils/constants";
import "./HeroSection.css";

const HeroSection = () => {
  const heroRef = useRef(null);
  const [heroBlog, setHeroBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Load hero blog from admin selection or fallback to latest featured ── */
  useEffect(() => {
    const loadHeroBlog = async () => {
      try {
        /* Check if admin selected a hero blog */
        const savedHeroId = localStorage.getItem("mindblog-hero-blog");

        if (savedHeroId) {
          const data = await blogService.getById(savedHeroId);
          if (data?.blog) {
            setHeroBlog(data.blog);
            setLoading(false);
            return;
          }
        }

        /* Fallback: get latest featured blog */
        const data = await blogService.getFeatured();
        if (data?.blogs?.length > 0) {
          setHeroBlog(data.blogs[0]);
        }
      } catch {
        /* Silent fail — hero works without a blog */
      } finally {
        setLoading(false);
      }
    };

    loadHeroBlog();
  }, []);

  /* ── Scroll animation ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".hero-animate").forEach((el, i) => {
              el.style.animationDelay = `${i * 120}ms`;
              el.classList.add("in-view");
            });
          }
        });
      },
      { threshold: 0.1 },
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-label="Hero section">
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />
      <div className="hero-orb hero-orb-3" aria-hidden="true" />

      <div className="container hero-inner">
        {/* Content */}
        <div className="hero-content">
          <span className="hero-badge hero-animate">
            <span className="hero-badge-dot" />
            New articles every day
          </span>

          <h1 className="hero-title hero-animate">
            Where Great <br />
            <span className="hero-title-gradient">Ideas Live</span>
            <br />& Grow
          </h1>

          <p className="hero-subtitle hero-animate">
            Discover thoughtfully written stories on technology, design,
            startups, and the human experience. Written by real people, for
            curious minds.
          </p>

          <div className="hero-actions hero-animate">
            <Link to="/blogs" className="btn btn-primary btn-lg">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
              Start Reading
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Write with us
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

          {/* Stats */}
          <div className="hero-stats hero-animate">
            {[
              { value: "1K+", label: "Readers" },
              { value: "8+", label: "Articles" },
              { value: "5+", label: "Authors" },
            ].map((stat) => (
              <div key={stat.label} className="hero-stat">
                <span className="hero-stat-value">{stat.value}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Visual: Admin-selected blog card ── */}
        <div className="hero-visual hero-animate">
          <div className="hero-illustration">
            {heroBlog ? (
              <Link
                to={`/blogs/${heroBlog.slug}`}
                className="hero-card hero-card-main hero-card-clickable"
              >
                <div className="hero-card-img-wrap">
                  <img
                    src={heroBlog.thumbnail || PLACEHOLDER_IMAGE}
                    alt={heroBlog.title}
                    className="hero-card-img"
                    loading="eager"
                    onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                  />
                  {heroBlog.category?.name && (
                    <span className="hero-card-category">
                      {heroBlog.category.name}
                    </span>
                  )}
                </div>
                <div className="hero-card-body">
                  <h3 className="hero-card-title">{heroBlog.title}</h3>
                  {heroBlog.excerpt && (
                    <p className="hero-card-excerpt">{heroBlog.excerpt}</p>
                  )}
                  <div className="hero-card-footer">
                    <div className="hero-card-author-wrap">
                      <img
                        src={
                          heroBlog.author?.avatar ||
                          generateAvatarUrl(heroBlog.author?.name || "A")
                        }
                        alt={heroBlog.author?.name}
                        className="hero-card-avatar"
                      />
                      <div className="hero-card-author-info">
                        <span className="hero-card-author-name">
                          {heroBlog.author?.name || "Anonymous"}
                        </span>
                        <span className="hero-card-date">
                          {timeAgo(heroBlog.createdAt)} ·{" "}
                          {heroBlog.readTime || "5 min read"}
                        </span>
                      </div>
                    </div>
                    <span className="hero-card-read-btn">
                      Read
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
              </Link>
            ) : (
              /* Fallback static card when no blog is selected */
              <div className="hero-card hero-card-main">
                <div className="hero-card-body">
                  <span className="badge badge-primary">Featured</span>
                  <h3 className="hero-card-title">
                    Discover amazing stories written by talented authors
                  </h3>
                  <div className="hero-card-footer">
                    <Link to="/blogs" className="hero-card-read-btn">
                      Browse Articles
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
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Floating cards */}
            <div className="hero-float-card hero-float-card-1 animate-float">
              <span className="hero-float-icon">✍️</span>
              <div>
                <p className="hero-float-title">New Post</p>
                <p className="hero-float-sub">Read it</p>
              </div>
            </div>

            <div
              className="hero-float-card hero-float-card-2 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <span className="hero-float-icon">🔥</span>
              <div>
                <p className="hero-float-title">Trending</p>
                <p className="hero-float-sub">Most Opened today</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-wheel" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
