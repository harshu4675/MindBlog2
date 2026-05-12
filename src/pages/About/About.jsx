import React from "react";
import { Link } from "react-router-dom";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import "./About.css";

const Reveal = ({ children, delay = 0, direction = "up" }) => {
  const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.08 });
  return (
    <div
      ref={ref}
      className={`reveal${direction === "left" ? "-left" : direction === "right" ? "-right" : ""} ${hasIntersected ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const TEAM = [
  {
    name: "Alex Morgan",
    role: "Founder & Editor in Chief",
    avatar:
      "https://ui-avatars.com/api/?name=Alex+Morgan&background=6c63ff&color=fff&size=120",
    bio: "Former journalist with 12 years covering tech and culture. Believes good writing can change minds.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Content",
    avatar:
      "https://ui-avatars.com/api/?name=Priya+Sharma&background=a78bfa&color=fff&size=120",
    bio: "Storyteller and strategist. Curates the voice and direction of everything you read here.",
  },
  {
    name: "James Liu",
    role: "Lead Developer",
    avatar:
      "https://ui-avatars.com/api/?name=James+Liu&background=06b6d4&color=fff&size=120",
    bio: "Built the platform from the ground up. Obsessed with performance, accessibility, and great UX.",
  },
  {
    name: "Sofia Reyes",
    role: "Community Manager",
    avatar:
      "https://ui-avatars.com/api/?name=Sofia+Reyes&background=10b981&color=fff&size=120",
    bio: "Connects writers and readers. Makes sure every voice in our community feels welcome.",
  },
];

const VALUES = [
  {
    icon: "🎯",
    title: "Quality First",
    desc: "We'd rather publish one great article than ten mediocre ones. Every piece goes through a thorough editorial process.",
  },
  {
    icon: "🤝",
    title: "Community-Driven",
    desc: "Our readers shape what we write. Feedback, comments, and dialogue are core to how we work.",
  },
  {
    icon: "🌱",
    title: "Independent",
    desc: "No venture capital pulling strings. We're reader-supported and editorially free to cover what actually matters.",
  },
  {
    icon: "♿",
    title: "Accessible",
    desc: "Great writing should be readable by everyone, on every device, in every context. Accessibility isn't optional.",
  },
];

const About = () => {
  return (
    <div className="about-page">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-orb about-hero-orb-1" aria-hidden="true" />
        <div className="about-hero-orb about-hero-orb-2" aria-hidden="true" />
        <div className="container about-hero-inner">
          <Reveal>
            <span className="section-label">Our Story</span>
            <h1 className="about-hero-title">
              We believe great <br />
              <span className="about-hero-title-accent">writing matters.</span>
            </h1>
            <p className="about-hero-desc">
              MindBlog started in 2026 with a simple idea: the internet needed
              fewer hot takes and more thoughtful long-reads. We built a home
              for writers who want to go deep, and readers who want to think
              differently.
            </p>
            <div className="about-hero-stats">
              {[
                { value: "1K+", label: "Monthly Readers" },
                { value: "8+", label: "Published Articles" },
                { value: "5+", label: "Contributing Authors" },
                { value: "1+", label: "Countries Represented" },
              ].map((s) => (
                <div key={s.label} className="about-stat">
                  <span className="about-stat-value">{s.value}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="section about-mission">
        <div className="container">
          <div className="about-mission-inner">
            <Reveal direction="left">
              <div className="about-mission-content">
                <span className="section-label">Our Mission</span>
                <h2 className="section-title">
                  Make people think, not just scroll.
                </h2>
                <p className="about-mission-text">
                  In an age of algorithmic noise and content farming, we're
                  committed to doing the opposite. Every article on MindBlog is
                  written by a real person with real expertise, edited for
                  clarity, and published with purpose.
                </p>
                <p className="about-mission-text">
                  We don't chase trends or optimize for outrage. We publish
                  stories that are genuinely worth your time — and we trust you
                  to know the difference.
                </p>
                <Link
                  to="/blogs"
                  className="btn btn-primary btn-lg"
                  style={{ marginTop: "var(--space-4)" }}
                >
                  Read Our Work
                </Link>
              </div>
            </Reveal>

            <Reveal direction="right" delay={100}>
              <div className="about-mission-visual">
                <div className="about-mission-card">
                  <blockquote className="about-mission-quote">
                    "The best time to plant a tree was 20 years ago. The second
                    best time to read a thoughtful article is right now."
                  </blockquote>
                  <div className="about-mission-quote-author">
                    <img
                      src="https://ui-avatars.com/api/?name=Alex+Morgan&background=6c63ff&color=fff&size=48"
                      alt="Alex Morgan"
                      className="about-mission-quote-avatar"
                    />
                    <div>
                      <strong>Harsh Solanki</strong>
                      <span>Founder, MindBlog</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        className="section"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="container">
          <Reveal className="text-center">
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle" style={{ marginInline: "auto" }}>
              These aren't just words on a page — they guide every decision we
              make as a publication.
            </p>
          </Reveal>

          <div className="about-values-grid">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="about-value-card">
                  <span className="about-value-icon">{v.icon}</span>
                  <h3 className="about-value-title">{v.title}</h3>
                  <p className="about-value-desc">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="section about-cta">
        <div className="container">
          <Reveal>
            <div className="about-cta-inner">
              <div className="about-cta-orb" aria-hidden="true" />
              <h2 className="about-cta-title">Want to write for MindBlog?</h2>
              <p className="about-cta-desc">
                We're always looking for thoughtful writers with something real
                to say. Pitch us your idea.
              </p>
              <div className="about-cta-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Pitch an Article
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Create Account
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default About;
