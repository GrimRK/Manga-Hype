import { Collapse } from "@mui/material";
import React from "react";
import "./css/ChapterList.css";
function ChapterList({ chapterList, show }) {
  return (
    <Collapse in={show}>
      <div className="chapter_container">
        {chapterList.map((chapter, i) => {
          return (
            <div key={i} className="chapter_panel">
              <div className="chapter_name_vers">
                <p>
                  Chapter {chapter?.attributes.chapter}:{" "}
                  {chapter?.attributes?.title}
                </p>
                <p className="chapter_bottom">
                  Version : {chapter?.attributes.version}
                </p>
              </div>
              <div className="chapter_time_user"></div>
            </div>
          );
        })}
      </div>
    </Collapse>
  );
}

export default ChapterList;
