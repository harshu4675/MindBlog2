import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
  validateForm,
  isRequired,
  isEmail,
  isMinLength,
} from "../../utils/validators";
import "./Contact.css";

const CONTACT_REASONS = [
  "General Inquiry",
  "Write for MindBlog",
  "Advertise with us",
  "Report an Issue",
  "Partnership",
  "Other",
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(form, {
      name: [isRequired, isMinLength(2)],
      email: [isRequired, isEmail],
      reason: [isRequired],
      message: [isRequired, isMinLength(20)],
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setSent(true);
      toast.success("Message sent! We'll get back to you within 48 hours.");
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1 className="contact-title">We'd love to hear from you.</h1>
          <p className="contact-subtitle">
            Whether it's a pitch, a partnership, or just a question — our inbox
            is always open.
          </p>
        </div>
      </div>

      <div className="container contact-layout">
        {/* Info sidebar */}
        <aside className="contact-info">
          <div className="contact-info-card">
            <h2 className="contact-info-title">Other ways to reach us</h2>

            <div className="contact-info-items">
              {[
                {
                  icon: (
                    <svg
                      width="20"
                      height="20"
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
                  ),
                  label: "Email",
                  value: "hello@mindblog.io",
                  href: "mailto:hello@mindblog.io",
                },
                {
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                  label: "Twitter / X",
                  value: "@mindblog",
                  href: "https://twitter.com/mindblog",
                },
                {
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                  label: "LinkedIn",
                  value: "MindBlog",
                  href: "https://linkedin.com/company/mindblog",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="contact-info-item"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  <span className="contact-info-icon">{item.icon}</span>
                  <div>
                    <span className="contact-info-label">{item.label}</span>
                    <span className="contact-info-value">{item.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-response-card">
            <span className="contact-response-icon">⏱</span>
            <div>
              <h3>Response Time</h3>
              <p>
                We typically respond within <strong>24–48 hours</strong> on
                business days.
              </p>
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success animate-bounce-in">
              <span className="contact-success-icon">🎉</span>
              <h2>Message Received!</h2>
              <p>
                Thanks for reaching out. One of our team members will get back
                to you within 48 hours.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", reason: "", message: "" });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <h2 className="contact-form-title">Send us a message</h2>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="contact-name" className="contact-form-label">
                    Full Name <span aria-hidden>*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className={`input ${errors.name ? "input-error-state" : ""}`}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <span
                      className="contact-form-error"
                      id="name-error"
                      role="alert"
                    >
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-email" className="contact-form-label">
                    Email Address <span aria-hidden>*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className={`input ${errors.email ? "input-error-state" : ""}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <span
                      className="contact-form-error"
                      id="email-error"
                      role="alert"
                    >
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-reason" className="contact-form-label">
                  Reason for Contact <span aria-hidden>*</span>
                </label>
                <select
                  id="contact-reason"
                  name="reason"
                  className={`input contact-select ${errors.reason ? "input-error-state" : ""}`}
                  value={form.reason}
                  onChange={handleChange}
                  aria-describedby={errors.reason ? "reason-error" : undefined}
                  aria-invalid={!!errors.reason}
                >
                  <option value="">Select a reason…</option>
                  {CONTACT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <span
                    className="contact-form-error"
                    id="reason-error"
                    role="alert"
                  >
                    {errors.reason}
                  </span>
                )}
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-message" className="contact-form-label">
                  Message <span aria-hidden>*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className={`input contact-textarea ${errors.message ? "input-error-state" : ""}`}
                  placeholder="Tell us what's on your mind (minimum 20 characters)…"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  maxLength={2000}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  aria-invalid={!!errors.message}
                />
                <div className="contact-form-footer-row">
                  {errors.message ? (
                    <span
                      className="contact-form-error"
                      id="message-error"
                      role="alert"
                    >
                      {errors.message}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="contact-char-count">
                    {form.message.length}/2000
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg contact-submit"
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
                  <>
                    Send Message
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
