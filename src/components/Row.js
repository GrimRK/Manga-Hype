import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import React, { useRef } from "react";
import "./css/Row.css";
import RowMangaPanel from "./RowMangaPanel";
function Row({ title, list }) {
  const rowRef = useRef(null);
  const handleScroll = (scrollVal) => {
    rowRef.current.scrollLeft += scrollVal;
  };
  // {
  //   console.log(title, list);
  // }
  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_scroll_right" onClick={() => handleScroll(200)}>
        <KeyboardArrowRight color="white" fontSize="large" />
      </div>
      <div className="row_scroll_left" onClick={() => handleScroll(-200)}>
        <KeyboardArrowLeft color="white" fontSize="large" />
      </div>
      <div className="row_item_container" ref={rowRef}>
        {list?.map((item) => (
          <RowMangaPanel key={item.id} manga={item} />
        ))}
      </div>
    </div>
  );
}

export default Row;
