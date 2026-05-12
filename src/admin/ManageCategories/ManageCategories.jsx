import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/Modal/Modal";
import { categoryService } from "../../services/categoryService";
import { CATEGORIES } from "../../utils/constants";
import { validateForm, isRequired, isMinLength } from "../../utils/validators";
import "./ManageCategories.css";

const defaultForm = {
  name: "",
  slug: "",
  icon: "",
  color: "#6c63ff",
  description: "",
};

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) =>
        setCategories(data?.categories?.length ? data.categories : CATEGORIES),
      )
      .catch(() => setCategories(CATEGORIES))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditingCat(null);
    setForm(defaultForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      icon: cat.icon || "",
      color: cat.color || "#6c63ff",
      description: cat.description || "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      ...(name === "name" && !editingCat
        ? {
            slug: value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateForm(form, {
      name: [isRequired, isMinLength(2)],
      slug: [isRequired],
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      if (editingCat) {
        const updated = await categoryService.update(
          editingCat._id || editingCat.slug,
          form,
        );
        setCategories((p) =>
          p.map((c) =>
            (c._id || c.slug) === (editingCat._id || editingCat.slug)
              ? { ...c, ...form }
              : c,
          ),
        );
        toast.success("Category updated");
      } else {
        const created = await categoryService.create(form);
        setCategories((p) => [...p, created?.category || form]);
        toast.success("Category created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete "${cat.name}"?`)) return;
    try {
      await categoryService.delete(cat._id || cat.slug);
      setCategories((p) =>
        p.filter((c) => (c._id || c.slug) !== (cat._id || cat.slug)),
      );
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="manage-categories">
      <div className="manage-header">
        <div>
          <h1 className="manage-title">Manage Categories</h1>
          <p className="manage-subtitle">{categories.length} categories</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Category
        </button>
      </div>

      {loading ? (
        <div className="manage-cat-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="manage-cat-skeleton">
              <div
                className="skeleton"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--border-radius-lg)",
                }}
              />
              <div
                className="skeleton"
                style={{
                  height: 16,
                  marginTop: "var(--space-3)",
                  borderRadius: 4,
                }}
              />
              <div
                className="skeleton"
                style={{
                  height: 12,
                  width: "60%",
                  marginTop: "var(--space-2)",
                  borderRadius: 4,
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="manage-cat-grid">
          {categories.map((cat) => (
            <div
              key={cat.slug || cat._id}
              className="manage-cat-card"
              style={{ "--cat-color": cat.color || "var(--color-primary)" }}
            >
              <div className="manage-cat-card-top">
                <div className="manage-cat-icon-wrap">
                  <span className="manage-cat-icon">{cat.icon || "📌"}</span>
                </div>
                <div className="manage-cat-actions">
                  <button
                    className="manage-action-btn manage-action-edit"
                    onClick={() => openEdit(cat)}
                    aria-label={`Edit ${cat.name}`}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="manage-action-btn manage-action-delete"
                    onClick={() => handleDelete(cat)}
                    aria-label={`Delete ${cat.name}`}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="manage-cat-name">{cat.name}</h3>
              {cat.description && (
                <p className="manage-cat-desc">{cat.description}</p>
              )}
              <div className="manage-cat-footer">
                <span className="manage-cat-slug">/{cat.slug}</span>
                {cat.count > 0 && (
                  <span className="manage-cat-count">{cat.count} posts</span>
                )}
              </div>
              <div
                className="manage-cat-color-bar"
                style={{ background: cat.color }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCat ? "Edit Category" : "Create Category"}
        size="sm"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : editingCat
                  ? "Save Changes"
                  : "Create Category"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} className="manage-cat-form" noValidate>
          <div className="auth-form-group">
            <label className="auth-form-label">Name *</label>
            <input
              name="name"
              className={`input ${errors.name ? "auth-input-error" : ""}`}
              placeholder="e.g. Technology"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span className="auth-form-error">{errors.name}</span>
            )}
          </div>
          <div className="auth-form-group">
            <label className="auth-form-label">Slug *</label>
            <input
              name="slug"
              className={`input ${errors.slug ? "auth-input-error" : ""}`}
              placeholder="e.g. technology"
              value={form.slug}
              onChange={handleChange}
            />
            {errors.slug && (
              <span className="auth-form-error">{errors.slug}</span>
            )}
          </div>
          <div className="manage-cat-form-row">
            <div className="auth-form-group">
              <label className="auth-form-label">Icon (emoji)</label>
              <input
                name="icon"
                className="input"
                placeholder="💻"
                value={form.icon}
                onChange={handleChange}
                style={{ fontSize: "1.25rem" }}
              />
            </div>
            <div className="auth-form-group">
              <label className="auth-form-label">Color</label>
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  alignItems: "center",
                }}
              >
                <input
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  style={{
                    width: 40,
                    height: 40,
                    padding: 2,
                    border: "1.5px solid var(--border-color)",
                    borderRadius: "var(--border-radius-md)",
                    cursor: "pointer",
                    background: "transparent",
                  }}
                />
                <input
                  name="color"
                  className="input"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="#6c63ff"
                />
              </div>
            </div>
          </div>
          <div className="auth-form-group">
            <label className="auth-form-label">Description</label>
            <textarea
              name="description"
              className="input"
              placeholder="Brief description…"
              value={form.description}
              onChange={handleChange}
              rows={2}
              style={{ resize: "vertical" }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;
