import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { isEmail } from "../../utils/validators";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = isEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((res) => setTimeout(res, 1200));
      setSuccess(true);
      setEmail("");
      toast.success("You're subscribed! Welcome to MindBlog.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter section">
      <div className="container">
        <div className="newsletter-inner">
          {/* Decorative orbs */}
          <div className="newsletter-orb newsletter-orb-1" aria-hidden="true" />
          <div className="newsletter-orb newsletter-orb-2" aria-hidden="true" />

          <div className="newsletter-content">
            <span className="section-label">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Newsletter
            </span>
            <h2 className="newsletter-title">
              Stay in the loop, <br />
              <span className="newsletter-title-accent">every week.</span>
            </h2>
            <p className="newsletter-subtitle">
              Get the best articles, curated by our editors, delivered straight
              to your inbox. No spam. Unsubscribe anytime.
            </p>

            <ul className="newsletter-perks">
              {[
                "Weekly editorial picks",
                "Trending articles digest",
                "Exclusive author insights",
              ].map((perk) => (
                <li key={perk} className="newsletter-perk">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-success)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="newsletter-form-wrap">
            {success ? (
              <div className="newsletter-success animate-bounce-in">
                <div className="newsletter-success-icon">🎉</div>
                <h3>You're in!</h3>
                <p>
                  Thanks for subscribing. Your first digest arrives this Sunday.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="newsletter-form"
                noValidate
              >
                <div className="newsletter-avatars">
                  {[
                    "https://ui-avatars.com/api/?name=A+K&background=6c63ff&color=fff&size=36",
                    "https://ui-avatars.com/api/?name=J+M&background=a78bfa&color=fff&size=36",
                    "https://ui-avatars.com/api/?name=S+P&background=06b6d4&color=fff&size=36",
                    "https://ui-avatars.com/api/?name=R+T&background=10b981&color=fff&size=36",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="newsletter-avatar"
                      style={{ zIndex: 4 - i }}
                    />
                  ))}
                  <span className="newsletter-avatar-label">Join Us Today</span>
                </div>

                <div className="newsletter-input-group">
                  <label htmlFor="newsletter-email" className="visually-hidden">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    className={`newsletter-input input ${error ? "input-error" : ""}`}
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={loading}
                    aria-describedby={error ? "newsletter-error" : undefined}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary newsletter-submit"
                    disabled={loading}
                  >
                    {loading ? (
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
                    ) : (
                      <>
                        Subscribe
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
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <p
                    className="newsletter-error"
                    id="newsletter-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
