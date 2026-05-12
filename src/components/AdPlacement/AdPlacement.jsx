import React from "react";
import "./AdPlacement.css";

const AdPlacement = ({ slot = "banner", label = "Advertisement" }) => {
  return (
    <div className={`ad-placement ad-placement-${slot}`} aria-label={label}>
      <span className="ad-placement-label">{label}</span>
      <div className="ad-placement-content">
        {/* Inject real ad code here, e.g. Google AdSense */}
        <p className="ad-placement-placeholder">Ad Space · {slot}</p>
      </div>
    </div>
  );
};

export default AdPlacement;
