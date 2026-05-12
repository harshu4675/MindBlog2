import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./WelcomePopup.css";

const POPUP_DELAY = 8000; /* Show after 8 seconds */
const POPUP_KEY = "mindblog-welcome-shown";

const WelcomePopup = () => {
  const { isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    /* Don't show if already logged in or already dismissed */
    if (isAuthenticated) return;

    const alreadyShown = sessionStorage.getItem(POPUP_KEY);
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const handleClose = () => {
    setClosing(true);
    sessionStorage.setItem(POPUP_KEY, "true");
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 350);
  };

  const handleCTAClick = () => {
    sessionStorage.setItem(POPUP_KEY, "true");
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 200);
  };

  if (!visible || isAuthenticated) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`welcome-backdrop ${closing ? "welcome-backdrop-exit" : ""}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Popup */}
      <div
        className={`welcome-popup ${closing ? "welcome-popup-exit" : "welcome-popup-enter"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to MindBlog"
      >
        {/* Close */}
        <button
          className="welcome-close"
          onClick={handleClose}
          aria-label="Close popup"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className="welcome-content">
          {/* Illustration */}
          <div className="welcome-illustration">
            <div className="welcome-icon-circle">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#welcomeGrad)" />
                <path
                  d="M8 22V10l8 8 8-8v12"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="welcomeGrad"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#6c63ff" />
                    <stop offset="1" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h2 className="welcome-title">Welcome to MindBlog! 👋</h2>
          <p className="welcome-desc">
            Join our community of curious minds. Get access to exclusive
            articles, bookmark your favorites, and join the conversation.
          </p>

          {/* Benefits */}
          <div className="welcome-benefits">
            {[
              { icon: "📚", text: "Unlimited article access" },
              { icon: "🔖", text: "Bookmark & save for later" },
              { icon: "💬", text: "Comment & discuss" },
              { icon: "🎁", text: "Unlock exclusive resources" },
            ].map((benefit) => (
              <div key={benefit.text} className="welcome-benefit">
                <span className="welcome-benefit-icon">{benefit.icon}</span>
                <span className="welcome-benefit-text">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="welcome-actions">
            <Link
              to="/register"
              className="btn btn-primary welcome-cta-primary"
              onClick={handleCTAClick}
            >
              Create Free Account
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
            <Link
              to="/login"
              className="btn btn-secondary welcome-cta-secondary"
              onClick={handleCTAClick}
            >
              I already have an account
            </Link>
          </div>

          {/* Skip */}
          <button className="welcome-skip" onClick={handleClose}>
            Maybe later — let me read first
          </button>
        </div>
      </div>
    </>
  );
};

export default WelcomePopup;
