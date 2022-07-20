import axios from "../axios";
import React, { useEffect, useState } from "react";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import { Link } from "react-router-dom";
import "./css/MangaListPanel.css";
function MangaListPanel({ manga }) {
  const [tags, setTags] = useState(null);
  useEffect(() => {
    if (manga) {
      async function fetchTags() {
        const res = await axios
          .get(
            `https://kitsu.io/api/edge/manga/${manga?.id}/categories?page[limit]=3`
          )
          .catch((err) => console.log(err.message));

        setTags(res?.data?.data);
      }
      fetchTags();
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
            src={manga?.attributes?.posterImage?.original}
            alt=""
          ></img>
        </div>

        <div className="filtered_manga_info">
          <div className="filtered_manga_top">
            <h3>
              {manga?.attributes?.canonicalTitle ||
                manga?.attributes?.titles?.en ||
                manga?.attributes?.titles?.en_jp ||
                manga?.attributes?.titles?.en_us ||
                manga?.attributes?.titles?.en_uk ||
                manga?.attributes?.titles?.ja_jp ||
                manga?.attributes?.titles?.ja}
            </h3>
            <div className="filtered_manga_panel_statistic">
              <div className="filtered_ratings">
                <StarBorderPurple500OutlinedIcon />
                <p>{manga?.attributes?.averageRating}</p>
              </div>
              <div className="filtered_follows">
                <BookmarkAddOutlinedIcon />
                <p>{manga?.attributes?.favoritesCount}</p>
              </div>
            </div>
          </div>
          <div className="filtered_manga_tags">
            {tags?.map((tag, i) => {
              if (i > 3) return;
              return (
                <p key={i} className={`filtered_tag`}>
                  {tag?.attributes?.title}
                </p>
              );
            })}
          </div>
          <p className="filtered_manga_info_description">
            {truncate(manga?.attributes?.description, 200)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default MangaListPanel;
