import React, { useEffect, useState } from "react";
import MangaPanel from "./MangaPanel";
import "./css/LatestUpdates.css";
import axios from "../axios";
import { useWindowSize } from "usehooks-ts";

function LatestUpdates() {
  const [mangas, setMangas] = useState([]);
  const { width } = useWindowSize();

  useEffect(() => {
    async function fetchManga() {
      var todayDate = new Date().getTime();
      var yesterdayDate = new Date(todayDate - 3600 * 24000);
      var string =
        yesterdayDate
          .toLocaleDateString("zh-Hans-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/")
          .join("-") +
        "T" +
        yesterdayDate
          .toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .slice(0, yesterdayDate.toLocaleTimeString().length - 2)
          .split(":")
          .join("%3A");

      // console.log(string);
      // 2022-04-29T17%3A21%3A44
      const res = await axios.get(
        `https://kitsu.io/api/edge/manga?page[limit]=15&sort=updatedAt`
      );
      // console.log("Yesterday : ", res?.data?.data);
      setMangas(res?.data?.data);
    }
    fetchManga();
  }, []);
  return (
    <div className="latest_updates">
      <h2>Latest Updates</h2>
      <div className="latest_update_manga_container">
        <div className="latest_left">
          {mangas?.map((manga, i) =>
            i < 5 ? (
              <MangaPanel key={manga?.id} id={manga?.id} manga={manga} />
            ) : (
              ""
            )
          )}
        </div>
        {width > 900 ? (
          <div className="latest_middle">
            {mangas?.map((manga, i) =>
              i >= 5 && i < 10 ? (
                <MangaPanel key={manga?.id} id={manga?.id} manga={manga} />
              ) : (
                ""
              )
            )}
          </div>
        ) : (
          ""
        )}
        {width > 1180 ? (
          <div className="latest_right">
            {mangas?.map((manga, i) =>
              i >= 10 ? (
                <MangaPanel key={manga?.id} id={manga?.id} manga={manga} />
              ) : (
                ""
              )
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default LatestUpdates;
