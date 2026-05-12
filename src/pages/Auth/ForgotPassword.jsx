import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { isRequired, isEmail, validateForm } from "../../utils/validators";
import { APP_NAME } from "../../utils/constants";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm({ email }, { email: [isRequired, isEmail] });
    if (errs.email) {
      setError(errs.email);
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ gridTemplateColumns: "1fr" }}>
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />

      <div className="auth-form-panel">
        <Link to="/" className="auth-mobile-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#fpLogoGrad)" />
            <path
              d="M8 22V10l8 8 8-8v12"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="fpLogoGrad"
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
          <span className="auth-mobile-logo-text">{APP_NAME}</span>
        </Link>

        <div className="auth-card animate-scale-in">
          {sent ? (
            <div style={{ textAlign: "center", padding: "var(--space-4) 0" }}>
              <div
                style={{ fontSize: "3.5rem", marginBottom: "var(--space-5)" }}
              >
                📬
              </div>
              <h2 className="auth-card-title">Check your inbox</h2>
              <p
                className="auth-card-subtitle"
                style={{ marginBottom: "var(--space-6)" }}
              >
                We've sent a password reset link to <strong>{email}</strong>. It
                may take a few minutes to arrive.
              </p>
              <div className="auth-alert auth-alert-success" role="status">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Reset email sent successfully
              </div>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  marginTop: "var(--space-6)",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-card-header">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--border-radius-lg)",
                    background: "var(--color-primary-50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <h1 className="auth-card-title">Forgot your password?</h1>
                <p className="auth-card-subtitle">
                  No worries. Enter your email and we'll send you a secure reset
                  link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div className="auth-form-group">
                  <label htmlFor="fp-email" className="auth-form-label">
                    Email Address
                  </label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      id="fp-email"
                      type="email"
                      className={`input auth-input ${error ? "auth-input-error" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      autoComplete="email"
                    />
                  </div>
                  {error && (
                    <span className="auth-form-error" role="alert">
                      {error}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="animate-spin"
                        style={{
                          width: 18,
                          height: 18,
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          display: "block",
                        }}
                      />
                      Sending…
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <p className="auth-footer-link">
                Remember your password? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
