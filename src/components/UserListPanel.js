import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserListPanel({ id }) {
  const [cover, setCover] = useState(null);
  const [manga, setManga] = useState(null);
  useEffect(() => {
    if (id) {
      axios
        .get(`https://api.mangadex.org/manga/${id}`)
        .then((res) => {
          setManga(res.data.data);
          const coverInfo = res?.data?.data?.relationships?.find(
            (ele) => ele.type === "cover_art"
          );
          if (coverInfo) {
            axios
              .get(`https://api.mangadex.org/cover/${coverInfo?.id}`)
              .then((res) => setCover(res.data.data))
              .catch((err) => console.log(err.message));
          }
        })
        .catch((err) => console.log(err.message));
    }
  }, [id]);
  return (
    <Link className="router_link" to="/manga" state={{ mangaInfo: manga }}>
      <div className="user_list_panel">
        <img
          className="user_list_panel_image"
          src={
            cover
              ? `https://uploads.mangadex.org/covers/${id}/${cover?.attributes?.fileName}`
              : ""
          }
          alt=""
        ></img>
      </div>
    </Link>
  );
}

export default UserListPanel;
