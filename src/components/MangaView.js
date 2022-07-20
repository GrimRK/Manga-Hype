import { Pagination, Stack } from "@mui/material";
import axios from "../axios";
import React, { useEffect, useState } from "react";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import "./css/MangaView.css";
import { useLocation, useNavigate } from "react-router";
import { useStateProviderValue } from "../StateProvider";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function MangaView() {
  const location = useLocation();
  const mangaInfo = location?.state?.mangaInfo;
  const [genres, setGenres] = useState();
  const [staff, setStaff] = useState();
  const [chapters, setChapters] = useState();
  const [maxPage, setMaxPage] = useState(1);
  const [page, setPage] = useState(1);
  const [{ user }, dispatch] = useStateProviderValue();
  const navigate = useNavigate();
  useEffect(() => {
    const genreRel = mangaInfo?.relationships?.categories?.links;
    const staffRel = mangaInfo?.relationships?.staff?.links;
    async function fetchGenres() {
      const res = await axios
        .get(genreRel?.related)
        .catch((err) => console.log(err));
      // console.log("genres:", res?.data);
      setGenres(res?.data?.data);
    }
    async function fetchStaff() {
      const res = await axios
        .get(staffRel?.related + "?include=person")
        .catch((err) => console.log(err));
      // console.log("staffs:", res?.data);
      setStaff(res?.data);
    }
    // console.log("genresstaff:", genreRel, staffRel);
    if (genreRel) fetchGenres();
    if (staffRel) fetchStaff();
  }, [mangaInfo]);

  useEffect(() => {
    const chapterRel = mangaInfo?.relationships?.chapters?.links;
    async function fetchData() {
      const res = await axios
        .get(
          `${chapterRel?.related}?page[limit]=15&page[offset]=${
            (page - 1) * 15
          }`
        )
        .catch((err) => console.log(err));
      setMaxPage(
        Math.floor(
          res?.data?.meta?.count % 15 === 0
            ? res?.data?.meta?.count / 15
            : res?.data?.meta?.count / 15 + 1
        )
      );
      setChapters(res?.data?.data);
    }

    if (mangaInfo) {
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "manga",
    });
  }, []);

  useEffect(() => {
    document.getElementById("chapters").style.filter = "blur(0px)";
  }, [chapters]);

  const handleChange = (e, v) => {
    document.getElementById("chapters").style.filter = "blur(10px)";
    setPage(v);
  };
  const handleAddManga = () => {
    async function updateUser() {
      const docRef = doc(db, `users/${user?.username}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const upd = await updateDoc(docRef, {
          followedManga: arrayUnion(mangaInfo?.id),
        });
      }
    }
    updateUser();
  };
  const handleRemoveManga = () => {
    async function updateUser() {
      const docRef = doc(db, `users/${user?.username}`);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const upd = await updateDoc(docRef, {
          followedManga: arrayRemove(mangaInfo?.id),
        });
      }
    }
    updateUser();
  };
  const handleTagClick = (tag) => {
    navigate(
      `/mangalist?page[limit]=20&filter[categories]=${tag?.slug}&sort=-averageRating`
    );
  };
  return (
    <div className="manga_view">
      <div className="manga_view_top">
        <div
          className="manga_view_banner"
          style={{
            backgroundRepeat: "no-repeat",
            background: mangaInfo
              ? `url(${
                  mangaInfo?.attributes?.coverImage?.original ||
                  mangaInfo?.attributes?.posterImage?.original
                })`
              : "",
            backgroundSize: "cover",
            filter: "blur(5px)",
          }}
        ></div>
        <div className="manga_view_content">
          <div className="manga_view_content_image">
            <img
              src={mangaInfo?.attributes?.posterImage?.original}
              alt=""
            ></img>
          </div>
          <div className="manga_view_content_right">
            <div className="manga_view_names">
              <h1>
                {mangaInfo?.attributes?.canonicalTitle ||
                  mangaInfo?.attributes?.titles?.en ||
                  mangaInfo?.attributes.titles?.en_us ||
                  mangaInfo?.attributes.titles?.en_uk ||
                  mangaInfo?.attributes.titles?.en_jp ||
                  mangaInfo?.attributes.titles?.ja_jp}
              </h1>
              <h3>
                {mangaInfo?.attributes.titles?.ja_jp ||
                  mangaInfo?.attributes.titles?.ja}
              </h3>
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
                {genres?.map((item) => (
                  <p
                    className="tags"
                    key={item.id}
                    onClick={() => handleTagClick(item?.attributes)}
                  >
                    {item?.attributes?.title}
                  </p>
                ))}
              </div>
              <div className="manga_view_status">
                <p>
                  Publication :{" "}
                  {new Date(mangaInfo?.attributes?.createdAt).getFullYear()},{" "}
                  {mangaInfo?.attributes?.status}
                </p>
              </div>
            </div>

            <div className="manga_view_statistic">
              <div className="ratings">
                <StarBorderPurple500OutlinedIcon />
                <p>{(mangaInfo?.attributes?.averageRating / 10).toFixed(2)}</p>
              </div>
              {user ? (
                user?.followedManga?.findIndex(
                  (item) => item === mangaInfo?.id
                ) === -1 ? (
                  <div className="follows" onClick={() => handleAddManga()}>
                    <BookmarkAddOutlinedIcon />
                    <p>{mangaInfo?.attributes?.favoritesCount}</p>
                  </div>
                ) : (
                  <div className="follows" onClick={() => handleRemoveManga()}>
                    <BookmarkAddedIcon />
                    <p>{mangaInfo?.attributes?.favoritesCount + 1}</p>
                  </div>
                )
              ) : (
                <div className="follows" onClick={() => handleAddManga()}>
                  <BookmarkAddOutlinedIcon />
                  <p>{mangaInfo?.attributes?.favoritesCount}</p>
                </div>
              )}

              <div className="views">
                <RemoveRedEyeOutlinedIcon />
                <p>{mangaInfo?.attributes?.userCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="manga_view_middle">
        <div className="manga_view_middle_left">
          <div className="manga_view_middle_content">
            <h3>Staff</h3>
            <div className="manga_view_middle_spans">
              {staff?.included?.map((person) => {
                return <p key={person?.id}>{person?.attributes?.name}</p>;
              })}
            </div>
          </div>

          <div className="manga_view_middle_content">
            <h3>Tags</h3>
            <div className="manga_view_middle_spans">
              {genres?.map((item) => (
                <p
                  className="tags"
                  key={item.id}
                  onClick={() => handleTagClick(item?.attributes)}
                >
                  {item?.attributes?.title}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="manga_view_middle_right">
          <div className="manga_view_chapter_content">
            <h2>Chapters</h2>
            <div id="chapters" className="chapter_container">
              {chapters?.map((chapter) => {
                return (
                  <div key={chapter?.id} className="chapter_cell">
                    Vol. {chapter?.attributes?.volumeNumber} | Chapter{" "}
                    {chapter?.attributes?.number} :{" "}
                    {chapter?.attributes?.canonicalTitle}
                  </div>
                );
              })}
              <Stack className="chapter_page_stack" spacing={1}>
                <Pagination
                  className="chapter_page_number"
                  count={maxPage}
                  page={page}
                  onChange={handleChange}
                />
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MangaView;
