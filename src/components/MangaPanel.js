import React, { useEffect, useState } from "react";
import "./css/MangaPanel.css";

import { Link } from "react-router-dom";
function MangaPanel({ id, manga }) {
  const truncate = (str, len) => {
    if (!str) return "Description is Updating...";
    if (str.length === 0) return "Description is Updating...";
    return str.length < len ? str : str.substring(0, len) + ". . . ";
  };
  return (
    <Link className="router_link" to="/manga" state={{ mangaInfo: manga }}>
      <div className="manga_panel">
        <img
          className="manga_panel_img"
          src={manga.attributes.posterImage.original}
          alt="panelImg"
        />
        <div className="manga_panel_info">
          <h3>
            {manga
              ? manga?.attributes?.canonicalTitle ||
                manga?.attributes.titles?.en ||
                manga?.attributes.titles?.en_us ||
                manga?.attributes.titles?.en_uk ||
                manga?.attributes.titles?.en_jp ||
                manga?.attributes.title?.ja_jp
              : ""}
          </h3>
          <p>{truncate(manga?.attributes?.description, 110)}</p>
        </div>
      </div>
    </Link>
  );
}

export default MangaPanel;
