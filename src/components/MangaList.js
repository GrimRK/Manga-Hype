import {
  Collapse,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import axios from "../axios";
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
  const [selectedTags, setSelectedTags] = useState(new Array());
  const [orderBy, setOrderBy] = useState("updatedAt");
  const [orderMode, setOrderMode] = useState("desc");
  const [mangaList, setMangaList] = useState();
  const [filterString, setFilterString] = useState("");
  const [listUrl, setListUrl] = useState("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const targetRef = useRef(null);
  const [{}, dispatch] = useStateProviderValue();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "mangalist",
    });
  }, []);
  useEffect(() => {
    if (window.location.search) {
      // console.log("keypair", window.location.search.split("?")[1]);
      if (window.location.search.split("?")[1]) {
        setFilterString(window.location.search.split("?")[1]);
        if (window.location.search.split("?")[1].split("page[offset]=")[1]) {
          setPage(
            parseInt(
              window.location.search.split("?")[1].split("page[offset]=")[1] /
                20
            ) + 1
          );
        }
      }
    }
  }, [window.location.search]);

  useEffect(() => {
    setListUrl(`https://kitsu.io/api/edge/manga?${filterString}`);
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
              res.data.meta.count % 20 === 0
                ? res.data.meta.count / 20
                : res.data.meta.count / 20 + 1
            )
          );
        })
        .catch((err) => console.log(err));
    }
  }, [listUrl]);

  const handleChange = (event, value) => {
    var temp = filterString;
    if (temp.split("page[offset]")[1]) {
      var arr = temp.split("page[offset]");
      arr[1] = `=${(value - 1) * 20}`;
      temp = arr.join("page[offset]");
      // console.log(temp, arr);
    } else {
      temp += `&page[offset]=${(value - 1) * 20}`;
    }
    navigate(`/mangalist?${temp}`);
    setPage(value);
  };

  const handleRemoveTag = (tag) => {
    var temp = selectedTags;
    setSelectedTags(temp.filter((ele) => ele.id !== tag.id));
  };
  const handleTags = (event) => {
    var temp = selectedTags;
    if (temp.find((item) => item.id === event.target.value.id)) return;
    temp.push(event.target.value);
    setCurrentTag(event.target.value);
    setSelectedTags(temp);
  };

  const handleSearch = () => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "mangalist",
    });
    var includeTags = "&filter[categories]=";
    selectedTags.forEach((tag) => {
      includeTags += tag.attributes.slug + ",";
    });
    var order = "sort=";
    if (orderMode == "desc") {
      order += "-";
    }
    order += orderBy;
    const url = `page[limit]=20&filter[text]=${title}${includeTags}&${order}`;

    setCurrentTag("");
    setSelectedTags(new Array());
    setTitle("");
    setOrderBy("updatedAt");
    setOrderMode("desc");

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
                        {tag?.attributes?.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>
          {selectedTags ? (
            <div className="show_tags">
              <div className="show_selected_tags">
                {selectedTags?.map((tag) => {
                  return (
                    <p key={tag?.id} onClick={() => handleRemoveTag(tag)}>
                      {tag?.attributes?.title}
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
                <MenuItem value={"updatedAt"}>Latest Uploads</MenuItem>
                <MenuItem value={"averageRating"}>Rating</MenuItem>
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
