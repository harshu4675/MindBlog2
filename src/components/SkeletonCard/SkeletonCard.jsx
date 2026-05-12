import React from "react";
import "./SkeletonCard.css";

const SkeletonCard = ({ variant = "default" }) => {
  return (
    <div
      className={`skeleton-card skeleton-card-${variant}`}
      aria-busy="true"
      aria-label="Loading article"
    >
      <div className="skeleton-img skeleton" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-category" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-title skeleton-title-short" />
        <div className="skeleton skeleton-excerpt" />
        <div className="skeleton skeleton-excerpt skeleton-excerpt-short" />
        <div className="skeleton-footer">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton skeleton-meta" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6, variant = "default" }) => (
  <div className="blog-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} variant={variant} />
    ))}
  </div>
);

export default SkeletonCard;
