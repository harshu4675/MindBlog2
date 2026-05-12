import React, { useState, useCallback } from "react";
import { useToast } from "../../context/ToastContext";
import "./ShareModal.css";

const SOCIAL_PLATFORMS = [
  {
    name: "Twitter / X",
    color: "#000",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    color: "#0077b5",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (url, title) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    color: "#25D366",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: "Facebook",
    color: "#1877f2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    color: "#0088cc",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    getUrl: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

const ShareModal = ({ isOpen, onClose, blog }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showRewardAd, setShowRewardAd] = useState(false);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [adWatching, setAdWatching] = useState(false);

  const blogUrl = blog
    ? `${window.location.origin}/blogs/${blog.slug}`
    : window.location.href;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Could not copy link");
    }
  }, [blogUrl, toast]);

  const handleSocialShare = (platform) => {
    const url = platform.getUrl(blogUrl, blog?.title || "Check this out");
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  /* ── Rewarded link feature ── */
  const handleWatchAd = () => {
    setShowRewardAd(true);
    setAdWatching(true);
    setAdCountdown(5);

    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdWatching(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClaimReward = () => {
    setRewardUnlocked(true);
    setShowRewardAd(false);
    toast.success("🎉 Reward unlocked! Here are the top AI model links.");
  };

  const REWARD_LINKS = blog?.rewardLinks || [
    {
      title: "ChatGPT",
      url: "https://chat.openai.com",
      desc: "OpenAI's flagship AI assistant",
      icon: "🤖",
    },
    {
      title: "Claude by Anthropic",
      url: "https://claude.ai",
      desc: "Most thoughtful AI for long-form tasks",
      icon: "🧠",
    },
    {
      title: "Google Gemini",
      url: "https://gemini.google.com",
      desc: "Google's multimodal AI model",
      icon: "✨",
    },
    {
      title: "Perplexity AI",
      url: "https://perplexity.ai",
      desc: "AI-powered search engine",
      icon: "🔍",
    },
    {
      title: "Midjourney",
      url: "https://midjourney.com",
      desc: "Best AI image generation",
      icon: "🎨",
    },
    {
      title: "Mistral AI",
      url: "https://mistral.ai",
      desc: "Open-weight powerful models",
      icon: "💨",
    },
    {
      title: "Llama by Meta",
      url: "https://llama.meta.com",
      desc: "Meta's open source LLM",
      icon: "🦙",
    },
    {
      title: "Grok by xAI",
      url: "https://grok.x.ai",
      desc: "Elon Musk's AI with real-time data",
      icon: "⚡",
    },
    {
      title: "Hugging Face",
      url: "https://huggingface.co",
      desc: "AI model hub & community",
      icon: "🤗",
    },
    {
      title: "GitHub Copilot",
      url: "https://github.com/features/copilot",
      desc: "AI coding assistant",
      icon: "👨‍💻",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="share-overlay animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="share-modal animate-scale-in">
        {/* Header */}
        <div className="share-modal-header">
          <div>
            <h2 className="share-modal-title">Share this article</h2>
            <p className="share-modal-subtitle">{blog?.title}</p>
          </div>
          <button
            className="share-close-btn"
            onClick={onClose}
            aria-label="Close"
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
        </div>

        {/* Copy link */}
        <div className="share-copy-section">
          <div className="share-url-wrap">
            <input
              type="text"
              className="share-url-input input"
              value={blogUrl}
              readOnly
              aria-label="Article URL"
            />
            <button
              className={`btn ${copied ? "btn-secondary" : "btn-primary"} share-copy-btn`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social platforms */}
        <div className="share-platforms">
          <p className="share-platforms-label">Share on</p>
          <div className="share-platform-grid">
            {SOCIAL_PLATFORMS.map((platform) => (
              <button
                key={platform.name}
                className="share-platform-btn"
                onClick={() => handleSocialShare(platform)}
                style={{ "--platform-color": platform.color }}
              >
                <span className="share-platform-icon">{platform.icon}</span>
                <span className="share-platform-name">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rewarded ad section */}
        <div className="share-reward-section">
          <div className="share-reward-header">
            <div className="share-reward-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ color: "#f59e0b" }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Reward Zone
            </div>
            <h3 className="share-reward-title">Unlock Top 10 AI Model Links</h3>
            <p className="share-reward-desc">
              Watch a short ad to unlock a curated list of the best AI tools —
              completely free.
            </p>
          </div>

          {/* Ad player */}
          {showRewardAd && !rewardUnlocked && (
            <div className="share-ad-player animate-fade-in">
              <div className="share-ad-screen">
                <div className="share-ad-content">
                  {/* This is where Google AdSense rewarded ad would render */}
                  <div className="share-ad-placeholder">
                    <div className="share-ad-placeholder-inner">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="1.5"
                      >
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect
                          x="1"
                          y="5"
                          width="15"
                          height="14"
                          rx="2"
                          ry="2"
                        />
                      </svg>
                      <p>Advertisement</p>
                      <span>Your ad would play here</span>
                      <small>
                        Integrate Google AdSense Rewarded Ads SDK here
                      </small>
                    </div>
                  </div>
                  <div className="share-ad-overlay-bar">
                    <span>Ad · Google AdSense</span>
                    {adCountdown > 0 ? (
                      <span className="share-ad-countdown">
                        Skip in {adCountdown}s
                      </span>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm share-claim-btn"
                        onClick={handleClaimReward}
                      >
                        🎁 Claim Reward
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unlocked reward */}
          {rewardUnlocked && (
            <div className="share-reward-unlocked animate-fade-in-up">
              <div className="share-reward-unlocked-header">
                <span className="share-reward-unlocked-icon">🎉</span>
                <h4>Top 10 AI Models — Unlocked!</h4>
              </div>
              <div className="share-reward-links">
                {REWARD_LINKS.map((link, i) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-reward-link"
                  >
                    <span className="share-reward-link-num">{i + 1}</span>
                    <span className="share-reward-link-icon">{link.icon}</span>
                    <div className="share-reward-link-info">
                      <span className="share-reward-link-title">
                        {link.title}
                      </span>
                      <span className="share-reward-link-desc">
                        {link.desc}
                      </span>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Watch ad CTA */}
          {!showRewardAd && !rewardUnlocked && (
            <button className="share-watch-ad-btn" onClick={handleWatchAd}>
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
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Watch Short Ad · Unlock Top 10 AI Links
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
