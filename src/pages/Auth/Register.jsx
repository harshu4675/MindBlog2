import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./Auth.css";

const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      errs.password = "Must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(form.password)) {
      errs.password = "Must contain at least one number";
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const getStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthScore];
  const strengthClass = ["", "weak", "fair", "good", "strong"][strengthScore];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.warning("Please agree to the Terms of Service to continue");
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success("Account created! Welcome to MindBlog 🎉");
      navigate("/");
    } catch (err) {
      const msg = err.message || "Registration failed. Please try again.";
      toast.error(msg);
      if (msg.toLowerCase().includes("email")) {
        setErrors({ email: msg });
      } else {
        setErrors({ confirmPassword: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="auth-orb auth-orb-1" aria-hidden="true" />
      <div className="auth-orb auth-orb-2" aria-hidden="true" />

      <div className="auth-card animate-scale-in">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#regGrad)" />
            <path
              d="M8 22V10l8 8 8-8v12"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="regGrad"
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
          <span className="auth-logo-text">MindBlog</span>
        </Link>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="auth-form-group">
            <label htmlFor="reg-name" className="auth-label">
              Full Name
            </label>
            <div className="auth-input-wrap">
              <svg
                className="auth-input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="reg-name"
                name="name"
                type="text"
                className={`input auth-input${errors.name ? " auth-input-error" : ""}`}
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "reg-name-err" : undefined}
              />
            </div>
            {errors.name && (
              <span id="reg-name-err" className="auth-error-msg" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="auth-form-group">
            <label htmlFor="reg-email" className="auth-label">
              Email address
            </label>
            <div className="auth-input-wrap">
              <svg
                className="auth-input-icon"
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
              <input
                id="reg-email"
                name="email"
                type="email"
                className={`input auth-input${errors.email ? " auth-input-error" : ""}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "reg-email-err" : undefined}
              />
            </div>
            {errors.email && (
              <span id="reg-email-err" className="auth-error-msg" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <label htmlFor="reg-password" className="auth-label">
              Password
            </label>
            <div className="auth-input-wrap">
              <svg
                className="auth-input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="reg-password"
                name="password"
                type={showPass ? "text" : "password"}
                className={`input auth-input auth-input-padded${errors.password ? " auth-input-error" : ""}`}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "reg-pass-err" : undefined}
              />
              <button
                type="button"
                className="auth-toggle-pass"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
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
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength meter */}
            {form.password && (
              <div className="auth-strength">
                <div className="auth-strength-bars">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`auth-strength-bar${
                        i <= strengthScore ? ` bar-${strengthClass}` : ""
                      }`}
                    />
                  ))}
                </div>
                <span className={`auth-strength-label label-${strengthClass}`}>
                  {strengthLabel}
                </span>
              </div>
            )}

            {errors.password && (
              <span id="reg-pass-err" className="auth-error-msg" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-form-group">
            <label htmlFor="reg-confirm" className="auth-label">
              Confirm Password
            </label>
            <div className="auth-input-wrap">
              <svg
                className="auth-input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showPass ? "text" : "password"}
                className={`input auth-input${errors.confirmPassword ? " auth-input-error" : ""}`}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "reg-confirm-err" : undefined
                }
              />
            </div>
            {errors.confirmPassword && (
              <span
                id="reg-confirm-err"
                className="auth-error-msg"
                role="alert"
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="animate-spin auth-spinner"
                  aria-hidden="true"
                />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Switch to login */}
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-switch-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
