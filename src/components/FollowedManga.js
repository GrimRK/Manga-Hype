import { Pagination, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useStateProviderValue } from "../StateProvider";
import "./css/FollowedManga.css";
import MangaListPanel from "./MangaListPanel";
function FollowedManga() {
  const [{}, dispatch] = useStateProviderValue();
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [listUrl, setListUrl] = useState();
  const [searchString, setSearchString] = useState("limit=20");
  const [mangaList, setMangaList] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch({
      type: "CURRENT_COMPONENT",
      currentComponent: "followed_manga",
    });
  }, []);
  useEffect(() => {
    if (window.location.search) {
      console.log("keypair", window.location.search.split("?")[1]);
      if (window.location.search.split("?")[1]) {
        setSearchString(window.location.search.split("?")[1]);
        if (window.location.search.split("?")[1].split("offset=")[1]) {
          setPage(
            parseInt(
              window.location.search.split("?")[1].split("offset=")[1] / 20
            ) + 1
          );
        }
      }
    }
  }, [window.location.search]);

  useEffect(() => {
    setListUrl(`https://api.mangadex.org/user/follows/manga?${searchString}`);
  }, [searchString]);

  useEffect(() => {
    if (listUrl) {
      // console.log("ListUrl: ", listUrl);
      const header = {
        Authorization: `Bearer ${localStorage.getItem("mhp_access_token")}`,
      };
      axios
        .get(listUrl, { headers: header })
        .then((res) => {
          console.log("my manga", res.data);
          var myDiv = document.getElementById("body");
          myDiv.scrollTo(0, 0);
          setMangaList(res.data.data);
          setMaxPage(
            parseInt(
              res.data.total % 20 === 0
                ? res.data.total / 20
                : res.data.total / 20 + 1
            )
          );
        })
        .catch((err) => console.log(err));
    }
  }, [listUrl]);

  const handleChange = (e, value) => {
    var temp = searchString;
    if (temp.split("offset")[1]) {
      var arr = temp.split("offset");
      arr[1] = `=${(value - 1) * 20}`;
      temp = arr.join("offset");
      // console.log(temp, arr);
    } else {
      temp += `&offset=${(value - 1) * 20}`;
    }
    navigate(`/follow/manga?${temp}`);
    setPage(value);
  };

  return (
    <div className="followed_manga">
      <div className="followed_manga_title">
        <h1>Followed Manga</h1>
      </div>
      <div className="followed_manga_container">
        {mangaList?.map((manga) => (
          <MangaListPanel key={manga?.id} manga={manga} />
        ))}
      </div>

      <div className="followed_page_container">
        {/* {console.log("page: ", page)} */}
        <Stack className="followed_page_stack" spacing={1}>
          <Pagination
            className="followed_page_number"
            count={maxPage}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      </div>
    </div>
  );
}

export default FollowedManga;
