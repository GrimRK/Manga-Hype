import React from "react";
import "./css/Loader.css";
function Loader({ loaderFlag }) {
  return (
    <div
      className={`loader_container ${loaderFlag === true ? "" : "loader_hide"}`}
    >
      <div className="loader"></div>
    </div>
  );
}

export default Loader;
