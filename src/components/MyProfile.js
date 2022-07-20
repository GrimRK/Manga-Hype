import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useStateProviderValue } from "../StateProvider";
import "./css/MyProfile.css";
import UserListPanel from "./UserListPanel";
import avatar from "../images/mangahype-avatar.png";
function MyProfile() {
  const navigate = useNavigate();
  const [{ user }, dispatch] = useStateProviderValue();
  useEffect(() => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "myprofile",
    });
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="my_profile">
      <div className="my_profile_banner"></div>
      <div className="my_profile_info_container">
        <div className="my_profile_left">
          <img className="my_profile_image" src={avatar} alt="avatar"></img>
          <div className="my_profile_option">
            <div className={`my_profile_option_btn active`}>
              <h3>Info</h3>
            </div>
          </div>
        </div>
        <div className="my_profile_right">
          <div className="transparent_banner"></div>
          <div className="content_container">
            <div className={`user_content`}>
              <h1>{user?.username}</h1>
            </div>
            <div className={`manga_followed`}>
              <h2 style={{ padding: "15px" }}>Followed Mangas</h2>
              <div className="manga_followed_container">
                {user?.followedManga.map((manga) => {
                  return <UserListPanel id={manga} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
