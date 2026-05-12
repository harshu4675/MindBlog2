import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import SearchBar from "../SearchBar/SearchBar";
import { APP_NAME, NAV_LINKS } from "../../utils/constants";
import { generateAvatarUrl } from "../../utils/helpers";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="MindBlog Home">
            <span className="navbar-logo-icon">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
                <path
                  d="M8 22V10l8 8 8-8v12"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="logoGrad"
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
            </span>
            <span className="navbar-logo-text">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link-active" : ""}`
                }
                end={link.path === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="navbar-actions">
            {/* Search trigger */}
            <button
              className="navbar-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="navbar-user" ref={dropdownRef}>
                <button
                  className="navbar-avatar-btn"
                  onClick={() => setDropdownOpen((p) => !p)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <img
                    src={user?.avatar || generateAvatarUrl(user?.name || "U")}
                    alt={user?.name || "User"}
                    className="navbar-avatar"
                  />
                  <svg
                    className={`navbar-chevron ${dropdownOpen ? "rotated" : ""}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div
                    className="navbar-dropdown animate-fade-in-down"
                    role="menu"
                  >
                    <div className="navbar-dropdown-header">
                      <p className="navbar-dropdown-name">{user?.name}</p>
                      <p className="navbar-dropdown-email">{user?.email}</p>
                    </div>
                    <div className="navbar-dropdown-divider" />
                    <Link
                      to="/profile"
                      className="navbar-dropdown-item"
                      role="menuitem"
                    >
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
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="navbar-dropdown-item"
                        role="menuitem"
                      >
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
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <div className="navbar-dropdown-divider" />
                    <button
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      onClick={handleLogout}
                      role="menuitem"
                    >
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
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-auth-btns">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              className={`navbar-hamburger ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((p) => !p)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}
        ref={menuRef}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu-inner">
          <nav className="mobile-nav">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                }
                end={link.path === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            {isAuthenticated ? (
              <div className="mobile-user">
                <div className="mobile-user-info">
                  <img
                    src={user?.avatar || generateAvatarUrl(user?.name || "U")}
                    alt={user?.name}
                    className="mobile-user-avatar"
                  />
                  <div>
                    <p className="mobile-user-name">{user?.name}</p>
                    <p className="mobile-user-email">{user?.email}</p>
                  </div>
                </div>
                <div className="mobile-user-actions">
                  <Link to="/profile" className="btn btn-secondary btn-sm">
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="btn btn-ghost btn-sm">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-btns">
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Search Modal */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default Navbar;
