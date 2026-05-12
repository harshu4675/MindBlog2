import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturedBlogs from "../../components/FeaturedBlogs/FeaturedBlogs";
import TrendingTopics from "../../components/TrendingTopics/TrendingTopics";
import Newsletter from "../../components/Newsletter/Newsletter";
import BlogCard from "../../components/BlogCard/BlogCard";
import { SkeletonGrid } from "../../components/SkeletonCard/SkeletonCard";
import { blogService } from "../../services/blogService";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "./Home.css";

const Reveal = ({ children, className = "", delay = 0 }) => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.08 });
  return (
    <div
      ref={ref}
      className={`reveal ${hasIntersected ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    blogService
      .getAll({ page: 1, limit: 12, sort: "newest" })
      .then((data) => {
        setBlogs(data?.blogs || []);
        setHasMore((data?.blogs?.length || 0) === 12);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await blogService.getAll({
        page: nextPage,
        limit: 12,
        sort: "newest",
      });
      const newBlogs = data?.blogs || [];
      setBlogs((prev) => [...prev, ...newBlogs]);
      setPage(nextPage);
      setHasMore(newBlogs.length === 12);
    } catch {
      /* silent */
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="latest-blogs section">
      <div className="container">
        <Reveal>
          <div className="latest-blogs-header">
            <div className="section-header">
              <span className="section-label">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Latest
              </span>
              <h2 className="section-title">Fresh from the Blog</h2>
              <p className="section-subtitle">
                The newest stories, perspectives, and ideas — published just for
                you.
              </p>
            </div>
            <Link to="/blogs" className="btn btn-secondary hide-mobile">
              Browse All
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
        </Reveal>

        {loading ? (
          <SkeletonGrid count={12} />
        ) : blogs.length > 0 ? (
          <>
            <div className="blog-grid">
              {blogs.map((blog, i) => (
                <Reveal key={blog._id} delay={Math.min(i % 6, 5) * 60}>
                  <BlogCard blog={blog} />
                </Reveal>
              ))}
            </div>
            {hasMore && (
              <div className="latest-blogs-load-more">
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load More Articles"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="latest-blogs-empty">
            <span className="latest-blogs-empty-icon">📝</span>
            <h3>No articles yet</h3>
            <p>Check back soon — great content is on its way.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const WhySection = () => {
  const features = [
    {
      icon: "✍️",
      title: "Curated Writing",
      desc: "Every article is reviewed for quality, depth, and originality.",
    },
    {
      icon: "🔍",
      title: "Deep Dives",
      desc: "Thoughtful, well-researched takes on complex topics.",
    },
    {
      icon: "🌍",
      title: "Global Voices",
      desc: "Authors from Many countries bring diverse perspectives.",
    },
    {
      icon: "⚡",
      title: "Fast & Clean",
      desc: "No clutter. Just great writing in a beautiful experience.",
    },
  ];

  return (
    <section
      className="why-section section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="container">
        <Reveal className="text-center">
          <span className="section-label">Why MindBlog</span>
          <h2 className="section-title">Reading, reimagined.</h2>
          <p className="section-subtitle" style={{ marginInline: "auto" }}>
            We built MindBlog for people who believe the right article can
            genuinely change how they think.
          </p>
        </Reveal>
        <div className="why-grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="why-card">
                <span className="why-card-icon">{f.icon}</span>
                <h3 className="why-card-title">{f.title}</h3>
                <p className="why-card-desc">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <Reveal>
        <FeaturedBlogs />
      </Reveal>
      <Reveal>
        <TrendingTopics />
      </Reveal>
      <LatestBlogs />
      <WhySection />
      <Reveal>
        <Newsletter />
      </Reveal>
    </div>
  );
};

export default Home;
