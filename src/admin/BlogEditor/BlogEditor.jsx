import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogService } from "../../services/blogService";
import { categoryService } from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";
import { slugify, calcReadTime } from "../../utils/helpers";
import { BLOG_STATUSES } from "../../utils/constants";
import "./BlogEditor.css";

const TOOLBAR_ACTIONS = [
  { label: "Bold", icon: "B", tag: "strong", shortcut: "b" },
  { label: "Italic", icon: "I", tag: "em", shortcut: "i" },
  { label: "H2", icon: "H2", tag: "h2", shortcut: null },
  { label: "H3", icon: "H3", tag: "h3", shortcut: null },
  { label: "Quote", icon: "❝", tag: "blockquote", shortcut: null },
  { label: "Code", icon: "</>", tag: "code", shortcut: null },
  { label: "Link", icon: "🔗", tag: "a", shortcut: null },
  { label: "Bullet List", icon: "•", tag: "ul", shortcut: null },
  { label: "Ordered List", icon: "1.", tag: "ol", shortcut: null },
  { label: "Image", icon: "🖼", tag: "img", shortcut: null },
  { label: "HR", icon: "—", tag: "hr", shortcut: null },
];

const defaultForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  status: BLOG_STATUSES.DRAFT,
  thumbnail: "",
  featured: false,
};

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [activeTab, setActiveTab] = useState("content");
  const [uploadingImg, setUploadingImg] = useState(false);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);
  const autoSaveTimer = useRef(null);

  /* Load categories */
  useEffect(() => {
    categoryService
      .getAll()
      .then((d) => setCategories(d?.categories || []))
      .catch(() => {});
  }, []);

  /* Load blog for edit */
  useEffect(() => {
    if (!isEdit) return;
    blogService
      .getById(id)
      .then((d) => {
        const b = d.blog;
        setForm({
          title: b.title || "",
          slug: b.slug || "",
          excerpt: b.excerpt || "",
          content: b.content || "",
          category: b.category?._id || b.category || "",
          tags: Array.isArray(b.tags) ? b.tags.join(", ") : "",
          status: b.status || "draft",
          thumbnail: b.thumbnail || "",
          featured: b.featured || false,
        });
        setWordCount(
          b.content
            ? b.content
                .replace(/<[^>]*>/g, "")
                .split(/\s+/)
                .filter(Boolean).length
            : 0,
        );
      })
      .catch(() => toast.error("Failed to load article"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  /* Word count */
  useEffect(() => {
    const text = form.content.replace(/<[^>]*>/g, "");
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  }, [form.content]);

  /* Auto-save draft */
  useEffect(() => {
    if (!form.title && !form.content) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      localStorage.setItem("mindblog-draft", JSON.stringify(form));
    }, 3000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !isEdit ? { slug: slugify(value) } : {}),
    }));
  };

  const handleContentChange = (e) => {
    setForm((p) => ({ ...p, content: e.target.value }));
  };

  /* Toolbar insert */
  const insertTag = useCallback((tag) => {
    const el = contentRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    let insertion = "";

    if (tag === "hr") {
      insertion = "\n<hr />\n";
    } else if (tag === "ul") {
      insertion = `\n<ul>\n  <li>${selected || "Item"}</li>\n</ul>\n`;
    } else if (tag === "ol") {
      insertion = `\n<ol>\n  <li>${selected || "Item"}</li>\n</ol>\n`;
    } else if (tag === "a") {
      const url = window.prompt("URL:", "https://");
      if (!url) return;
      insertion = `<a href="${url}">${selected || "Link text"}</a>`;
    } else if (tag === "img") {
      const url = window.prompt("Image URL:", "https://");
      if (!url) return;
      insertion = `<img src="${url}" alt="Image" />`;
    } else if (tag === "h2" || tag === "h3") {
      insertion = `\n<${tag}>${selected || "Heading"}</${tag}>\n`;
    } else if (tag === "blockquote") {
      insertion = `\n<blockquote>${selected || "Quote text"}</blockquote>\n`;
    } else if (tag === "code") {
      insertion = selected
        ? `<code>${selected}</code>`
        : `\n<pre><code>// code here\n</code></pre>\n`;
    } else {
      insertion = `<${tag}>${selected || "text"}</${tag}>`;
    }

    const newContent =
      el.value.substring(0, start) + insertion + el.value.substring(end);
    setForm((p) => ({ ...p, content: newContent }));
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = start + insertion.length;
      el.focus();
    }, 0);
  }, []);

  /* Image upload */
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const data = await blogService.uploadImage(fd);
      setForm((p) => ({ ...p, thumbnail: data.url || data.imageUrl }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed. Try a URL instead.");
    } finally {
      setUploadingImg(false);
    }
  };

  /* Save */
  const handleSave = async (status = form.status) => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Content is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        status,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        readTime: calcReadTime(form.content.replace(/<[^>]*>/g, "")),
      };
      if (isEdit) {
        await blogService.update(id, payload);
        toast.success("Article updated!");
      } else {
        const data = await blogService.create(payload);
        toast.success("Article created!");
        navigate(`/admin/blogs/edit/${data.blog._id}`);
      }
      localStorage.removeItem("mindblog-draft");
    } catch (err) {
      toast.error(err.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-editor-loading">
        <div
          className="animate-spin"
          style={{
            width: 36,
            height: 36,
            border: "3px solid var(--border-color)",
            borderTopColor: "var(--color-primary)",
            borderRadius: "50%",
          }}
        />
        <p>Loading article…</p>
      </div>
    );
  }

  return (
    <div className="blog-editor">
      {/* Editor header */}
      <div className="editor-header">
        <div className="editor-header-left">
          <h1 className="editor-title">
            {isEdit ? "Edit Article" : "New Article"}
          </h1>
          <div className="editor-meta">
            <span className="editor-word-count">{wordCount} words</span>
            <span>·</span>
            <span className="editor-read-time">
              {calcReadTime(form.content.replace(/<[^>]*>/g, ""))}
            </span>
            {form.status && (
              <>
                <span>·</span>
                <span
                  className={`badge ${form.status === "published" ? "badge-success" : "badge-warning"}`}
                >
                  {form.status}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="editor-header-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? (
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
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>{" "}
                Edit
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>{" "}
                Preview
              </>
            )}
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        {/* Main editor */}
        <div className="editor-main">
          {/* Title */}
          <input
            className="editor-title-input"
            type="text"
            name="title"
            placeholder="Your article title…"
            value={form.title}
            onChange={handleChange}
            maxLength={200}
          />

          {/* Excerpt */}
          <textarea
            className="editor-excerpt-input input"
            name="excerpt"
            placeholder="Short excerpt / meta description (150-160 characters)…"
            value={form.excerpt}
            onChange={handleChange}
            rows={2}
            maxLength={300}
          />

          {/* Content area */}
          {preview ? (
            <div
              className="editor-preview prose"
              dangerouslySetInnerHTML={{
                __html:
                  form.content || "<p><em>Nothing to preview yet…</em></p>",
              }}
            />
          ) : (
            <div className="editor-content-wrap">
              {/* Toolbar */}
              <div
                className="editor-toolbar"
                role="toolbar"
                aria-label="Text formatting"
              >
                {TOOLBAR_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="editor-toolbar-btn"
                    onClick={() => insertTag(action.tag)}
                    title={action.label}
                    aria-label={action.label}
                  >
                    <span>{action.icon}</span>
                  </button>
                ))}
              </div>
              <textarea
                ref={contentRef}
                className="editor-textarea"
                name="content"
                placeholder="Write your article here using HTML or plain text…&#10;&#10;Tip: Use the toolbar above to format your content."
                value={form.content}
                onChange={handleContentChange}
                spellCheck="true"
              />
            </div>
          )}
        </div>

        {/* Sidebar settings */}
        <aside className="editor-sidebar">
          {/* Tabs */}
          <div className="editor-tabs">
            {["content", "seo", "settings"].map((tab) => (
              <button
                key={tab}
                className={`editor-tab ${activeTab === tab ? "is-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Settings panel */}
          {activeTab === "settings" && (
            <div className="editor-settings animate-fade-in">
              {/* Thumbnail */}
              <div className="editor-setting-group">
                <label className="editor-setting-label">Featured Image</label>
                {form.thumbnail ? (
                  <div className="editor-thumbnail-preview">
                    <img
                      src={form.thumbnail}
                      alt="Thumbnail"
                      className="editor-thumbnail-img"
                    />
                    <button
                      className="editor-thumbnail-remove"
                      onClick={() => setForm((p) => ({ ...p, thumbnail: "" }))}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="editor-thumbnail-upload">
                    <button
                      type="button"
                      className="editor-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImg}
                    >
                      {uploadingImg ? "Uploading…" : "Upload Image"}
                    </button>
                    <span className="editor-upload-or">or</span>
                    <input
                      className="input editor-setting-input"
                      type="url"
                      placeholder="Paste image URL…"
                      value={form.thumbnail}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, thumbnail: e.target.value }))
                      }
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="editor-setting-group">
                <label className="editor-setting-label">Category</label>
                <select
                  className="input editor-setting-input"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select category…</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="editor-setting-group">
                <label className="editor-setting-label">Status</label>
                <select
                  className="input editor-setting-input"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Tags */}
              <div className="editor-setting-group">
                <label className="editor-setting-label">Tags</label>
                <input
                  className="input editor-setting-input"
                  type="text"
                  name="tags"
                  placeholder="ai, design, startup (comma-separated)"
                  value={form.tags}
                  onChange={handleChange}
                />
              </div>

              {/* Featured */}
              <div className="editor-setting-group editor-setting-toggle">
                <label className="editor-setting-label">Featured Article</label>
                <label className="editor-toggle">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  <span className="editor-toggle-slider" />
                </label>
              </div>
            </div>
          )}

          {/* SEO panel */}
          {activeTab === "seo" && (
            <div className="editor-settings animate-fade-in">
              <div className="editor-setting-group">
                <label className="editor-setting-label">URL Slug</label>
                <div className="editor-slug-wrap">
                  <span className="editor-slug-prefix">/blogs/</span>
                  <input
                    className="input editor-setting-input editor-slug-input"
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="article-url-slug"
                  />
                </div>
              </div>
              <div className="editor-setting-group">
                <label className="editor-setting-label">Meta Description</label>
                <textarea
                  className="input editor-setting-textarea"
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  placeholder="SEO meta description…"
                  rows={3}
                />
                <span className="editor-char-count">
                  {form.excerpt.length}/160
                </span>
              </div>
              {/* SEO preview */}
              <div className="editor-seo-preview">
                <p className="editor-seo-url">
                  mindblog.io/blogs/{form.slug || "article-slug"}
                </p>
                <p className="editor-seo-title">
                  {form.title || "Your Article Title"}
                </p>
                <p className="editor-seo-desc">
                  {form.excerpt ||
                    "Your meta description will appear here in search results."}
                </p>
              </div>
            </div>
          )}

          {/* Content tab */}
          {activeTab === "content" && (
            <div className="editor-settings animate-fade-in">
              <div className="editor-content-stats">
                <div className="editor-content-stat">
                  <span className="editor-content-stat-val">{wordCount}</span>
                  <span className="editor-content-stat-label">Words</span>
                </div>
                <div className="editor-content-stat">
                  <span className="editor-content-stat-val">
                    {form.content.replace(/<[^>]*>/g, "").length}
                  </span>
                  <span className="editor-content-stat-label">Characters</span>
                </div>
                <div className="editor-content-stat">
                  <span className="editor-content-stat-val">
                    {calcReadTime(form.content.replace(/<[^>]*>/g, ""))}
                  </span>
                  <span className="editor-content-stat-label">Read Time</span>
                </div>
              </div>
              <div className="editor-tips">
                <h4 className="editor-tips-title">Writing Tips</h4>
                <ul className="editor-tips-list">
                  <li>Start with a compelling hook</li>
                  <li>Use subheadings every 300 words</li>
                  <li>Include images to break up text</li>
                  <li>End with a clear takeaway</li>
                  <li>Aim for 800–2000 words</li>
                </ul>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BlogEditor;
