import { Collapse, Drawer } from "@mui/material";
import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import Header from "../components/Header";
import Home from "../components/Home";
import Loader from "../components/Loader";
import Login from "../components/Login";
import MangaList from "../components/MangaList";
import MangaView from "../components/MangaView";
import MyProfile from "../components/MyProfile";
import Sidebar from "../components/Sidebar";
import { useStateProviderValue } from "../StateProvider";
import "./css/Display.css";
function Display() {
  const [{ open, currentComponent }, dispatch] = useStateProviderValue();
  const { width: screenWidth } = useWindowSize();
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    if (screenWidth < 1024) {
      dispatch({
        type: "SET_OPEN",
        open: false,
      });
    }
    async function fetchTags() {
      const res = await axios
        .get(`https://kitsu.io/api/edge/categories?page[limit]=300`)
        .catch((err) => console.log(err.message));
      var temp = res.data.data;
      temp?.sort(function (a, b) {
        if (a.attributes.title < b.attributes.title) return -1;
        if (a.attributes.title > b.attributes.title) return 1;
        return 0;
      });
      dispatch({
        type: "SET_TAGS",
        tags: temp,
      });
    }
    fetchTags();
  }, []);
  useEffect(() => {
    dispatch({
      type: "SET_WIDTH",
      width: screenWidth,
    });
  }, [screenWidth]);
  useEffect(() => {
    var myDiv = document.getElementById("body");
    myDiv.scrollTo(0, 0);
    setFlag(true);
    setTimeout(() => {
      setFlag(false);
    }, 3800);
  }, [currentComponent]);
  return (
    <div className="display">
      {screenWidth < 1024 ? (
        <Drawer
          open={open}
          onClose={() => {
            dispatch({
              type: "SET_OPEN",
              open: false,
            });
          }}
        >
          <Sidebar />
        </Drawer>
      ) : (
        <Collapse
          className="display_collapse"
          orientation="horizontal"
          in={open}
        >
          <Sidebar />
        </Collapse>
      )}
      <div
        className="body"
        id="body"
        onLoad={() => {
          setTimeout(() => {
            setFlag(false);
          }, 1800);
        }}
      >
        <Header />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/manga" element={<MangaView />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/mangalist" element={<MangaList />} />
          <Route exact path="/myprofile" element={<MyProfile />} />
        </Routes>

        {/* <CurrentComponent /> */}
      </div>
      <Loader loaderFlag={flag} />
    </div>
  );
}

export default Display;
