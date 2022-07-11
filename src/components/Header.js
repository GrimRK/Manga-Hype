import React, { useEffect, useState } from "react";
import "./css/Header.css";
import {
  Avatar,
  Button,
  FormControl,
  Input,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import { useStateProviderValue } from "../StateProvider";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/mangahype-logo1.png";
import avatar from "../images/mangahype-avatar.png";

function Header() {
  const [{ open, width, token }, dispatch] = useStateProviderValue();
  const [searchVal, setSearchVal] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      const header = {
        Authorization: `Bearer ${localStorage.getItem("mhp_access_token")}`,
      };
      axios
        .get("https://api.mangadex.org/user/me", {
          headers: header,
        })
        .then((res) => {
          console.log("user", res.data);
          setUser(res.data);
        });
    }
    return;
  }, [token]);
  const handleOpen = () => {
    dispatch({
      type: "SET_OPEN",
      open: true,
    });
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMe = () => {
    const header = {
      Authorization: `Bearer ${localStorage.getItem("mhp_access_token")}`,
    };
    navigate("/myprofile");
    // axios
    //   .get("https://api.mangadex.org/user/me", {
    //     headers: header,
    //   })
    //   .then((res) => console.log("user", res.data));
  };
  const handleLogout = () => {
    const header = {
      Authorization: `Bearer ${localStorage.getItem("mhp_access_token")}`,
    };
    axios
      .post("https://api.mangadex.org/auth/logout", {
        headers: header,
      })
      .then((res) => {
        dispatch({
          type: "SET_TOKEN",
          token: null,
        });
        localStorage.setItem("mhp_expires", null);
        localStorage.setItem("mhp_access_token", null);
        console.log("Logged out");
        navigate("/");
      });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal) {
      dispatch({
        type: "SET_CURRENTCOMPONENT",
        currentComponent: "mangalist",
      });
      navigate(
        `/mangalist?title=${searchVal}&order%5BlatestUploadedChapter%5D=desc&limit=20`
      );
    }
  };

  return (
    <div className="header">
      {open ? (
        <div></div>
      ) : (
        <>
          <MenuOpenOutlinedIcon
            className="header_options"
            onClick={handleOpen}
          />
          {width < 470 ? (
            ""
          ) : (
            <Link to="/">
              <img className="header_logo" src={logo} alt="no logo" />
            </Link>
          )}
        </>
      )}

      <div className="header_right header_options">
        {width > 700 ? (
          <div className="header_search_bar">
            <SearchIcon />
            <form className="header_form" onSubmit={(e) => handleSearch(e)}>
              <Input
                className="header_input"
                placeholder="Search for a Manga"
                type="text"
                value={searchVal}
                disableUnderline
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </form>
          </div>
        ) : (
          ""
        )}

        <Avatar src={avatar} onClick={handleClickMenu} />
        <Menu
          className="menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClick={handleCloseMenu}
        >
          <div className="avatar_options">
            {token ? (
              <>
                <MenuItem onClick={handleMe}>
                  {user ? user.data.attributes.username : ""}
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem>
                <Link className="router_link" to="/login">
                  Log In
                </Link>
              </MenuItem>
            )}
          </div>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
