import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/MangaPanel.css";

import { Link } from "react-router-dom";
function MangaPanel({ id, manga }) {
  const [cover, setCover] = useState(null);
  useEffect(() => {
    const coverInfo = manga?.relationships?.find(
      (ele) => ele.type === "cover_art"
    );
    // console.log("cover : ", coverInfo);
    async function fetchData() {
      const res = await axios
        .get(`https://api.mangadex.org/cover/${coverInfo?.id}`)
        .catch((err) => console.log(err.message));
      // console.log("cover : ", res.data);
      setCover(res.data.data);
    }
    if (coverInfo) fetchData();
  }, []);
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
          src={
            cover
              ? `https://uploads.mangadex.org/covers/${id}/${cover?.attributes?.fileName}`
              : ""
          }
          alt="panelImg"
        />
        <div className="manga_panel_info">
          <h3>
            {manga
              ? manga?.attributes.title.en ||
                manga?.attributes.title["ja-ro"] ||
                manga?.attributes.title.ja ||
                manga?.attributes.title["zh-hk"] ||
                manga?.attributes.title.ko ||
                manga?.attributes.title.th ||
                manga?.attributes.title.ru
              : ""}
          </h3>
          <p>{truncate(manga?.attributes?.description?.en, 110)}</p>
        </div>
      </div>
    </Link>
  );
}

export default MangaPanel;
