import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStateProviderValue } from "../StateProvider";
import "./css/RowMangaPanel.css";
import MangaView from "./MangaView";
import { Link } from "react-router-dom";
function RowMangaPanel({ manga }) {
  const [cover, setCover] = useState(null);

  useEffect(() => {
    const coverInfo = manga?.relationships?.find(
      (ele) => ele.type === "cover_art"
    );
    async function fetchData() {
      const res = await axios
        .get(`https://api.mangadex.org/cover/${coverInfo?.id}`)
        .catch((err) => console.log(err.message));
      //   console.log("cover : ", res.data);
      setCover(res.data.data);
    }
    if (coverInfo) fetchData();
  }, []);
  return (
    <Link className="router_link" to="/manga" state={{ mangaInfo: manga }}>
      <div key={manga.id} className="row_manga_panel">
        <img
          className="row_manga_panel_img"
          src={
            cover
              ? `https://uploads.mangadex.org/covers/${manga?.id}/${cover?.attributes?.fileName}`
              : ""
          }
          alt="panelImg"
        />
        {manga?.attributes.title.en ||
          manga?.attributes.title["ja-ro"] ||
          manga?.attributes.title.ja ||
          manga?.attributes.title["zh-hk"] ||
          manga?.attributes.title.ko ||
          manga?.attributes.title.th ||
          manga?.attributes.title.ru}
      </div>
    </Link>
  );
}

export default RowMangaPanel;
