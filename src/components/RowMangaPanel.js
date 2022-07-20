import React from "react";
import "./css/RowMangaPanel.css";
import { Link } from "react-router-dom";
function RowMangaPanel({ manga }) {
  return (
    <Link className="router_link" to="/manga" state={{ mangaInfo: manga }}>
      <div key={manga.id} className="row_manga_panel">
        <img
          className="row_manga_panel_img"
          src={manga?.attributes?.posterImage?.original}
          alt="panelImg"
        />
        {manga?.attributes?.canonicalTitle ||
          manga?.attributes?.titles?.en ||
          manga?.attributes.titles?.en_us ||
          manga?.attributes.titles?.en_uk ||
          manga?.attributes.titles?.en_jp ||
          manga?.attributes.title?.ja_jp}
      </div>
    </Link>
  );
}

export default RowMangaPanel;
