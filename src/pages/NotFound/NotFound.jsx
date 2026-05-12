import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-orb notfound-orb-1" aria-hidden="true" />
      <div className="notfound-orb notfound-orb-2" aria-hidden="true" />

      <div className="notfound-inner animate-fade-in-up">
        <div className="notfound-code" aria-hidden="true">
          404
        </div>
        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-desc">
          The page you're looking for doesn't exist, was removed, or maybe the
          link is just a little off. It happens to the best of us.
        </p>
        <div className="notfound-actions">
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate(-1)}
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Go Back
          </button>
          <Link to="/" className="btn btn-primary btn-lg">
            Take me Home
          </Link>
        </div>
        <div className="notfound-links">
          <span>Or try:</span>
          <Link to="/blogs">All Articles</Link>
          <span>·</span>
          <Link to="/categories">Categories</Link>
          <span>·</span>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
