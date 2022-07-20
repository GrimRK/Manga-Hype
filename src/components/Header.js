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
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/mangahype-logo1.png";
import avatar from "../images/mangahype-avatar.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header() {
  const [{ open, width, token, user }, dispatch] = useStateProviderValue();
  const [searchVal, setSearchVal] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
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
    navigate("/myprofile");
  };
  const handleLogout = () => {
    signOut(auth);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal) {
      var temp = searchVal;
      dispatch({
        type: "SET_CURRENTCOMPONENT",
        currentComponent: "mangalist",
      });
      setSearchVal("");
      navigate(`/mangalist?filter[text]=${temp}&page[limit]=20`);
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
                  <div className="avatar_option_link">
                    <PersonIcon className="avatar_option_icon" />
                    <p>{user ? user.username : ""}</p>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <div className="avatar_option_link">
                    <LogoutIcon className="avatar_option_icon" />
                    <p>Log Out</p>
                  </div>
                </MenuItem>
              </>
            ) : (
              <MenuItem>
                <Link className="router_link" to="/login">
                  <div className="avatar_option_link">
                    <LoginIcon className="avatar_option_icon" />
                    <p>Log In</p>
                  </div>
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
