import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useStateProviderValue } from "../StateProvider";
import "./css/MyProfile.css";
import UserListPanel from "./UserListPanel";
import avatar from "../images/mangahype-avatar.png";
function MyProfile() {
  const [tab, setTab] = useState("info");
  const [url, setUrl] = useState();
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState(null);
  const navigate = useNavigate();
  const [{}, dispatch] = useStateProviderValue();
  useEffect(() => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "myprofile",
    });
  }, []);
  useEffect(() => {
    const header = {
      Authorization: `Bearer ${localStorage.getItem("mhp_access_token")}`,
    };
    if (tab === "info") {
      axios
        .get("https://api.mangadex.org/user/me", { headers: header })
        .then((res) => setUser(res?.data?.data))
        .catch((err) => console.log(err.message));
    } else if (tab === "lists") {
      axios
        .get("https://api.mangadex.org/user/list", { headers: header })
        .then((res) => setLists(res?.data?.data))
        .catch((err) => console.log(err.message));
    }
    // else if (tab == "uploads") {
    //   axios
    //     .get("https://api.mangadex.org/upload", { headers: header })
    //     .then((res) => console.log("Uploads", res?.data?.data));
    // }
  }, [tab]);
  return (
    <div className="my_profile">
      <div className="my_profile_banner"></div>
      <div className="my_profile_info_container">
        <div className="my_profile_left">
          <img className="my_profile_image" src={avatar} alt="avatar"></img>
          <div className="my_profile_option">
            <div
              className={`my_profile_option_btn ${
                tab === "info" ? "active" : ""
              }`}
              onClick={() => setTab("info")}
            >
              <h3>Info</h3>
            </div>
            {/* <div
              className={`my_profile_option_btn ${
                tab === "uploads" ? "active" : ""
              }`}
              onClick={() => setTab("uploads")}
            >
              <h3>Uploads</h3>
            </div> */}
            <div
              className={`my_profile_option_btn ${
                tab === "lists" ? "active" : ""
              }`}
              onClick={() => setTab("lists")}
            >
              <h3>Lists</h3>
            </div>
          </div>
        </div>
        <div className="my_profile_right">
          <div className="transparent_banner"></div>
          <div className="content_container">
            <div
              className={`user_content ${
                tab === "info" ? "" : "hidden_content"
              }`}
            >
              <h1>{user?.attributes?.username}</h1>
              <h3>User Id</h3>
              <p>{user?.id}</p>
              <h3>Role</h3>
              <p>{user?.attributes?.roles}</p>
            </div>
            {/* <div
              className={`user_content ${
                tab === "uploads" ? "" : "hidden_content"
              }`}
            >
              This is uploads content
            </div> */}
            <div
              className={`user_content ${
                tab === "lists" ? "" : "hidden_content"
              }`}
            >
              {console.log("Lists", lists)}
              {lists?.map((list) => {
                return (
                  <div className="user_list">
                    <h2>{list?.attributes?.name}</h2>
                    <p className="user_list_visibility">
                      {list?.attributes?.visibility}
                    </p>
                    <div className="user_list_manga_container">
                      {list?.relationships?.map((manga) => (
                        <UserListPanel key={manga.id} id={manga?.id} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
