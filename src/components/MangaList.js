import {
  Button,
  Collapse,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useStateProviderValue } from "../StateProvider";
import "./css/MangaList.css";
import MangaListPanel from "./MangaListPanel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
function MangaList() {
  const [{ tags }] = useStateProviderValue();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [currentNotTag, setCurrentNotTag] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Array());
  const [deselectedTags, setDeselectedTags] = useState(new Array());
  const [orderBy, setOrderBy] = useState("latestUploadedChapter");
  const [orderMode, setOrderMode] = useState("desc");
  const [mangaList, setMangaList] = useState();
  const [filterString, setFilterString] = useState("");
  const [listUrl, setListUrl] = useState(
    "https://api.mangadex.org/manga?order%5BlatestUploadedChapter%5D=desc&limit=20"
  );
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const targetRef = useRef(null);
  const [{}, dispatch] = useStateProviderValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.search) {
      // console.log("keypair", window.location.search.split("?")[1]);
      if (window.location.search.split("?")[1]) {
        setFilterString(window.location.search.split("?")[1]);
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
    setListUrl(`https://api.mangadex.org/manga?${filterString}`);
  }, [filterString]);

  useEffect(() => {
    if (listUrl) {
      // console.log("ListUrl: ", listUrl);
      setOpen(false);
      axios
        .get(listUrl)
        .then((res) => {
          // console.log("Search data ", res.data);
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

  const handleChange = (event, value) => {
    var temp = filterString;
    if (temp.split("offset")[1]) {
      var arr = temp.split("offset");
      arr[1] = `=${(value - 1) * 20}`;
      temp = arr.join("offset");
      // console.log(temp, arr);
    } else {
      temp += `&offset=${(value - 1) * 20}`;
    }
    navigate(`/mangalist?${temp}`);
    setPage(value);
  };

  const handleRemoveTag = (tag) => {
    var temp = selectedTags;
    setSelectedTags(temp.filter((ele) => ele.id !== tag.id));
  };
  const handleRemoveNotTag = (tag) => {
    var temp = deselectedTags;
    setDeselectedTags(temp.filter((ele) => ele.id !== tag.id));
  };

  const handleTags = (event) => {
    var temp = selectedTags;
    if (temp.find((item) => item.id === event.target.value.id)) return;
    if (deselectedTags?.find((item) => item.id === event.target.value.id)) {
      handleRemoveNotTag(event.target.value);
    }
    temp.push(event.target.value);
    setCurrentTag(event.target.value);
    setSelectedTags(temp);
  };
  const handleNotTags = (event) => {
    var temp = deselectedTags;
    if (temp.find((item) => item.id === event.target.value.id)) return;
    if (selectedTags?.find((item) => item.id === event.target.value.id)) {
      handleRemoveTag(event.target.value);
    }
    temp.push(event.target.value);
    setCurrentNotTag(event.target.value);
    setDeselectedTags(temp);
  };

  const handleSearch = () => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "mangalist",
    });
    var includeTags = "";
    selectedTags.forEach((tag) => {
      includeTags += "&includedTags%5B%5D=" + tag.id;
    });
    var excludeTags = "";
    deselectedTags.forEach((tag) => {
      excludeTags += "&excludedTags%5B%5D=" + tag.id;
    });
    const url = `${
      title ? "title=" + title : ""
    }${includeTags}&includedTagsMode=AND${excludeTags}&excludedTagsMode=OR&order%5B${orderBy}%5D=${orderMode}&limit=20`;
    navigate(`/mangalist?${url}`);
  };
  return (
    <div className="mangalist" ref={targetRef}>
      <div
        className="list_filter"
        onClick={() => (open ? setOpen(false) : setOpen(true))}
      >
        <h1></h1>
        <h1>Filter</h1>
        {open ? (
          <ExpandLessIcon className="filter_icon" />
        ) : (
          <ExpandMoreIcon className="filter_icon" />
        )}
      </div>
      <Collapse dir="down" in={open}>
        <div className="list_filter_contianer">
          <div className="fliter">
            <p>Title</p>
            <div className="form_input_container">
              <Input
                className="filter_input"
                placeholder="Title"
                value={title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="fliter ">
            <p>Tags</p>
            <div className="form_input_container">
              <FormControl fullWidth>
                <InputLabel className="filtered_label">Include Tags</InputLabel>
                <Select
                  className="filter_input"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentTag}
                  label="Tags"
                  onChange={handleTags}
                >
                  {tags?.map((tag) => {
                    return (
                      <MenuItem key={tag?.id} value={tag}>
                        {tag?.attributes?.name?.en}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel className="filtered_label">Exclude Tags</InputLabel>
                <Select
                  className="filter_input"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentNotTag}
                  label="Tags"
                  onChange={handleNotTags}
                >
                  {tags?.map((tag) => {
                    return (
                      <MenuItem key={tag?.id} value={tag}>
                        {tag?.attributes?.name?.en}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>
          {selectedTags || deselectedTags ? (
            <div className="show_tags">
              <div className="show_selected_tags">
                {selectedTags?.map((tag) => {
                  return (
                    <p key={tag?.id} onClick={() => handleRemoveTag(tag)}>
                      {tag?.attributes?.name?.en}
                    </p>
                  );
                })}
              </div>
              <div className="show_deselected_tags">
                {deselectedTags?.map((tag) => {
                  return (
                    <p key={tag?.id} onClick={() => handleRemoveNotTag(tag)}>
                      {tag?.attributes?.name?.en}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="fliter">
            <p>Order By</p>
            <div className="form_input_container">
              <Select
                className="filter_input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderBy}
                label="OrderBy"
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <MenuItem value={"latestUploadedChapter"}>
                  Latest Uploads
                </MenuItem>
                <MenuItem value={"rating"}>Rating</MenuItem>
                <MenuItem value={"relevance"}>Relevance</MenuItem>
              </Select>

              <Select
                className="filter_input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderMode}
                label="OrderBy"
                onChange={(e) => setOrderMode(e.target.value)}
              >
                <MenuItem value={"asc"}>Ascending</MenuItem>
                <MenuItem value={"desc"}>Descending</MenuItem>
              </Select>
            </div>
          </div>
          <div className="search_button" onClick={() => handleSearch()}>
            Search
          </div>
        </div>
      </Collapse>
      <div className="filtered_manga_container">
        {mangaList?.map((manga) => {
          return <MangaListPanel key={manga?.id} manga={manga} />;
        })}
      </div>

      <div className="filtered_page_container">
        {/* {console.log("page: ", page)} */}
        <Stack className="filtered_page_stack" spacing={1}>
          <Pagination
            className="filtered_page_number"
            count={maxPage}
            page={page}
            onChange={handleChange}
          />
        </Stack>
      </div>
    </div>
  );
}

export default MangaList;
