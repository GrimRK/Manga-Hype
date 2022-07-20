import {
  Divider,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import { useStateProviderValue } from "../StateProvider";
import "./css/Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LinkIcon from "@mui/icons-material/Link";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../images/mangahype-logo1.png";
import { Link, useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  const [{ currentComponent, token, width }, dispatch] =
    useStateProviderValue();
  const [searchVal, setSearchVal] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal) {
      var temp = searchVal;
      dispatch({
        type: "SET_CURRENTCOMPONENT",
        currentComponent: "mangalist",
      });
      setSearchVal("");
      dispatch({
        type: "SET_OPEN",
        open: false,
      });
      navigate(`/mangalist?filter[text]=${temp}&page[limit]=20`);
    }
  };
  const handleClose = () => {
    dispatch({
      type: "SET_OPEN",
      open: false,
    });
  };
  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Link
          to="/"
          onClick={() => {
            dispatch({
              type: "SET_OPEN",
              open: false,
            });
          }}
        >
          <img className="sidebar_logo" src={logo} alt="logo" />{" "}
        </Link>
        <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
      </div>
      <List>
        <Divider className="sidebar_divider" />
        <Link className="router_link" to="/">
          <ListItem>
            <ListItemButton
              selected={currentComponent === "home"}
              onClick={() => {
                dispatch({
                  type: "SET_OPEN",
                  open: false,
                });
              }}
            >
              <ListItemIcon className="option_icon">
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className="router_link" to="/mangalist?sort=-updatedAt">
          <ListItem
            onClick={() => {
              dispatch({
                type: "SET_OPEN",
                open: false,
              });
              dispatch({
                type: "SET_CURRENTCOMPONENT",
                currentComponent: "latest",
              });
            }}
          >
            <ListItemButton selected={currentComponent === "latest"}>
              <ListItemIcon className="option_icon">
                <AccessTimeFilledIcon />
              </ListItemIcon>
              <ListItemText primary="Latest Updates" />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link className="router_link" to="/mangalist?sort=-averageRating">
          <ListItem
            onClick={() => {
              dispatch({
                type: "SET_OPEN",
                open: false,
              });
              dispatch({
                type: "SET_CURRENTCOMPONENT",
                currentComponent: "top_rated",
              });
            }}
          >
            <ListItemButton selected={currentComponent === "top_rated"}>
              <ListItemIcon className="option_icon">
                <StarIcon />
              </ListItemIcon>
              <ListItemText primary="Top Mangas" />
            </ListItemButton>
          </ListItem>
        </Link>
        {width < 700 ? (
          <>
            <Divider className="sidebar_divider" />
            <ListItem>
              <ListItemIcon>
                <SearchIcon className="option_icon" />
              </ListItemIcon>

              <form className="sidebar_form" onSubmit={(e) => handleSearch(e)}>
                <Input
                  className="sidebar_input"
                  placeholder="Search for a Manga"
                  type="text"
                  value={searchVal}
                  disableUnderline
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </form>
            </ListItem>
          </>
        ) : (
          ""
        )}
        {token ? (
          <>
            <Divider className="sidebar_divider" />
            <Link className="router_link" to="/myprofile">
              <ListItem
                onClick={() => {
                  dispatch({
                    type: "SET_OPEN",
                    open: false,
                  });
                  dispatch({
                    type: "SET_CURRENTCOMPONENT",
                    currentComponent: "myprofile",
                  });
                }}
              >
                <ListItemButton selected={currentComponent === "myprofile"}>
                  <ListItemIcon className="option_icon">
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItemButton>
              </ListItem>
            </Link>
          </>
        ) : (
          ""
        )}
        <Divider className="sidebar_divider" />
        <ListItem
          onClick={() => {
            window.location.href = "https://github.com/hummingbird-me/api-docs";
          }}
        >
          <ListItemButton>
            <ListItemIcon className="option_icon">
              <LinkIcon />
            </ListItemIcon>
            <ListItemText primary="Kitsu API" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
