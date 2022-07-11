import React, { useEffect } from "react";
import { useStateProviderValue } from "../StateProvider";
import "./css/Home.css";
import LatestUpdates from "./LatestUpdates";
import Row from "./Row";
function Home() {
  const [{ popular, manhwa, action, comedy }, dispatch] =
    useStateProviderValue();
  useEffect(() => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "home",
    });
  }, []);
  return (
    <div className="home">
      <LatestUpdates />
      <Row title={"Popular Mangas"} list={popular} />
      <Row title={"Action Mangas"} list={action} />
      <Row title={"Comedy Mangas"} list={comedy} />
      <Row title={"Top Manhwas"} list={manhwa} />
    </div>
  );
}

export default Home;
