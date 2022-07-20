import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserListPanel({ id }) {
  const [manga, setManga] = useState(null);
  useEffect(() => {
    if (id) {
      axios
        .get(`https://kitsu.io/api/edge/manga/${id}`)
        .then((res) => {
          setManga(res.data.data);
        })
        .catch((err) => console.log(err.message));
    }
  }, [id]);
  return (
    <Link className="router_link" to="/manga" state={{ mangaInfo: manga }}>
      <div className="user_list_panel">
        <img
          className="user_list_panel_image"
          src={manga?.attributes?.posterImage?.original}
          alt=""
        ></img>
      </div>
    </Link>
  );
}

export default UserListPanel;
