import React from "react";
import "../styles/Loader.css";

const Loader = ({ size = "medium", fullPage = false }) => {
    const spinner = <div className={`loader loader-${size}`} role="status" aria-label="Loading" />;

    if (fullPage) {
        return <div className="loader-fullpage">{spinner}</div>;
    }
    return spinner;
};

export default Loader;