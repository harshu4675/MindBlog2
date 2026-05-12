import React from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import "./ProgressBar.css";

const ProgressBar = () => {
  const progress = useScrollProgress();

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      style={{ "--progress-width": `${progress}%` }}
    >
      <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
