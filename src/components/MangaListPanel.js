import axios from "axios";
import React, { useEffect, useState } from "react";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import { Link } from "react-router-dom";
import "./css/MangaListPanel.css";
function MangaListPanel({ manga }) {
  const [cover, setCover] = useState(null);
  const [statistics, setStatistics] = useState(null);
  useEffect(() => {
    if (manga) {
      const coverInfo = manga?.relationships?.find(
        (ele) => ele.type === "cover_art"
      );
      axios
        .get(`https://api.mangadex.org/cover/${coverInfo?.id}`)
        .then((res) => {
          setCover(res.data.data);
        })
        .catch((err) => console.log(err.message));

      async function fetchStatistics() {
        const res = await axios
          .get(`https://api.mangadex.org/statistics/manga/${manga?.id}`)
          .catch((err) => console.log(err.message));

        setStatistics(res.data.statistics[manga?.id]);
      }
      fetchStatistics();
    }
  }, []);
  const truncate = (str, len) => {
    if (!str) return "Description is Updating...";
    if (str.length === 0) return "Description is Updating...";
    return str.length < len ? str : str.substring(0, len) + ". . .";
  };
  return (
    <Link className="router_link" to="/manga" state={{ mangaInfo: manga }}>
      <div className="filtered_manga_panel">
        <div className="filtered_manga_panel_image_container">
          <img
            className="filtered_manga_panel_image"
            src={
              cover
                ? `https://uploads.mangadex.org/covers/${manga?.id}/${cover?.attributes.fileName}`
                : ""
            }
            alt=""
          ></img>
        </div>

        <div className="filtered_manga_info">
          <div className="filtered_manga_top">
            <h3>
              {manga?.attributes?.title?.en || manga?.attributes?.title?.ja}
            </h3>
            <div className="filtered_manga_panel_statistic">
              <div className="filtered_ratings">
                <StarBorderPurple500OutlinedIcon />
                <p>{statistics?.rating?.average}</p>
              </div>
              <div className="filtered_follows">
                <BookmarkAddOutlinedIcon />
                <p>{statistics?.follows}</p>
              </div>
            </div>
          </div>
          <div className="filtered_manga_tags">
            {manga?.attributes?.tags?.map((tag, i) => {
              if (i > 3) return;
              return (
                <p key={i} className={`filtered_tag`}>
                  {tag?.attributes?.name?.en}
                </p>
              );
            })}
          </div>
          <p className="filtered_manga_info_description">
            {truncate(manga?.attributes?.description?.en, 200)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default MangaListPanel;
