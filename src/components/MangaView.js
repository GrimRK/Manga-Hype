import { Button, Collapse } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./css/MangaView.css";
import ChapterList from "./ChapterList";
import { useLocation } from "react-router";
import { useStateProviderValue } from "../StateProvider";

function MangaView() {
  const location = useLocation();
  const mangaInfo = location?.state?.mangaInfo;
  const [cover, setCover] = useState(null);
  const [author, setAuthor] = useState(null);
  const [artist, setArtist] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [feed, setFeed] = useState(null);
  const [show, setShow] = useState(null);
  const [{}, dispatch] = useStateProviderValue();
  useEffect(() => {
    const coverInfo = mangaInfo?.relationships?.find(
      (ele) => ele.type === "cover_art"
    );
    const authorInfo = mangaInfo?.relationships?.find(
      (ele) => ele.type === "author"
    );
    const artistInfo = mangaInfo?.relationships?.find(
      (ele) => ele.type === "artist"
    );
    async function fetchCover() {
      const res = await axios
        .get(`https://api.mangadex.org/cover/${coverInfo?.id}`)
        .catch((err) => console.log(err.message));
      // console.log(res.data.data);
      setCover(res.data.data);
    }
    async function fetchAuthor() {
      const res = await axios
        .get(`https://api.mangadex.org/author/${authorInfo?.id}`)
        .catch((err) => console.log(err.message));
      // console.log(res.data.data);
      setAuthor(res.data.data);
    }
    async function fetchArtist() {
      const res = await axios
        .get(`https://api.mangadex.org/author/${artistInfo?.id}`)
        .catch((err) => console.log(err.message));
      // console.log(res.data.data);
      setArtist(res.data.data);
    }
    async function fetchStatistics() {
      const res = await axios
        .get(`https://api.mangadex.org/statistics/manga/${mangaInfo?.id}`)
        .catch((err) => console.log(err.message));

      setStatistics(res.data.statistics[mangaInfo?.id]);
    }
    async function fetchFeed() {
      const res = await axios
        .get(`https://api.mangadex.org/manga/${mangaInfo?.id}/feed`)
        .catch((err) => console.log(err.message));
      var x = res.data.data;
      x = x.sort(function (a, b) {
        return (
          parseFloat(a.attributes.chapter) - parseFloat(b.attributes.chapter)
        );
      });
      // console.log("X : ", x);
      const grouped = x.reduce((group, chapter) => {
        const { volume } = chapter.attributes;
        group[volume] = group[volume] ?? [];
        group[volume].unshift(chapter);
        return group;
      }, {});
      var temp = new Array();
      Object.keys(grouped)
        .reverse()
        .forEach((i) => {
          if (i === "null") {
            temp[Object.keys(grouped).length] = false;
          } else temp[i] = true;
        });
      setShow(temp);
      setFeed(grouped);
    }
    if (mangaInfo) {
      if (coverInfo) fetchCover();
      if (authorInfo) fetchAuthor();
      if (artistInfo) fetchArtist();
      fetchFeed();
      fetchStatistics();
    }
  }, [mangaInfo]);
  useEffect(() => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "manga",
    });
  }, []);
  return (
    <div className="manga_view">
      {/* {console.log("FeedsGroup: ", feed, show)} */}
      <div className="manga_view_top">
        <div
          className="manga_view_banner"
          style={{
            background: cover
              ? `url(https://uploads.mangadex.org/covers/${mangaInfo?.id}/${cover?.attributes?.fileName})`
              : "",
            filter: "blur(5px)",
          }}
        ></div>
        <div className="manga_view_content">
          <div className="manga_view_content_image">
            <img
              src={
                cover
                  ? `https://uploads.mangadex.org/covers/${mangaInfo?.id}/${cover?.attributes?.fileName}`
                  : ""
              }
              alt=""
            ></img>
          </div>
          <div className="manga_view_content_right">
            <div className="manga_view_names">
              <h1>
                {mangaInfo?.attributes.title.en ||
                  mangaInfo?.attributes.title["ja-ro"] ||
                  mangaInfo?.attributes.title.ja ||
                  mangaInfo?.attributes.title["zh-hk"] ||
                  mangaInfo?.attributes.title.ko ||
                  mangaInfo?.attributes.title.th ||
                  mangaInfo?.attributes.title.ru}
              </h1>
              <h3>
                {mangaInfo?.attributes?.altTitles?.find((item) => item.ja)?.ja}
              </h3>
              <h4>{author?.attributes?.name}</h4>
            </div>
            <div className="manga_view_btns">
              <div className="manga_view_button">Start Reading</div>
            </div>
          </div>
        </div>
        <div className="manga_view_content_info">
          <div className="manga_view_meta_container">
            <div className="manga_view_line_container">
              <div className="manga_view_tags">
                {mangaInfo?.attributes.tags.map((item) => (
                  <p className="tags" key={item.id}>
                    {item.attributes.name.en}
                  </p>
                ))}
              </div>
              <div className="manga_view_status">
                <p>
                  Publication :{" "}
                  {new Date(mangaInfo?.attributes.createdAt).getFullYear()},{" "}
                  {mangaInfo?.attributes.status}
                </p>
              </div>
            </div>

            <div className="manga_view_statistic">
              <div className="ratings">
                <StarBorderPurple500OutlinedIcon />
                <p>{statistics?.rating?.average}</p>
              </div>
              <div className="follows">
                <BookmarkAddOutlinedIcon />
                <p>{statistics?.follows}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="manga_view_middle">
        <div className="manga_view_middle_left">
          <div className="manga_view_middle_content">
            <h3>Author</h3>
            <div className="manga_view_middle_spans">
              <p>{author?.attributes?.name}</p>
            </div>
          </div>
          <div className="manga_view_middle_content">
            <h3>Artist</h3>
            <div className="manga_view_middle_spans">
              <p>{artist?.attributes?.name}</p>
            </div>
          </div>
          <div className="manga_view_middle_content">
            <h3>Tags</h3>
            <div className="manga_view_middle_spans">
              {mangaInfo?.attributes.tags.map((item) => (
                <p className="tags" key={item.id}>
                  {item.attributes.name.en}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="manga_view_middle_right">
          <div className="manga_view_chapter_content">
            <h2>Chapters</h2>
            {/* Chapters container */}
            {feed
              ? Object.keys(feed)
                  .reverse()
                  .map((i) => {
                    const toggleFlag = () => {
                      var temp = [...show];
                      if (i === "null") {
                        // console.log("temp: ", i, temp["null"]);
                        temp[Object.keys(feed).length] =
                          !temp[Object.keys(feed).length];
                      } else {
                        temp[i] = !temp[i];
                      }
                      setShow(temp);
                    };

                    if (feed[i])
                      return (
                        <div key={i} className="manga_view_volume">
                          <div className="volume_header">
                            <div className="volume_left">
                              <p>
                                Volume{" "}
                                {feed[i][0]?.attributes.volume
                                  ? feed[i][0].attributes.volume
                                  : Object.keys(feed).length}
                              </p>
                            </div>
                            <div className="volume_middle">
                              <p>{`Ch. ${
                                feed[i][feed[i].length - 1]?.attributes.chapter
                              }-${feed[i][0]?.attributes.chapter}`}</p>
                            </div>

                            <div
                              className="chapter_collapse"
                              onClick={() => toggleFlag()}
                            >
                              <p>{feed[i].length}</p>
                              {show[i] ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </div>
                          </div>

                          <ChapterList
                            chapterList={feed[i]}
                            show={
                              i === "null"
                                ? show[Object.keys(feed).length]
                                : show[i]
                            }
                          />
                        </div>
                      );
                  })
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MangaView;
