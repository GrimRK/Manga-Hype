import { Box, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Router } from "react-router";
import "./App.css";
import Loader from "./components/Loader";
import Display from "./pages/Display";
import { useStateProviderValue } from "./StateProvider";

function App() {
  const [{ token }, dispatch] = useStateProviderValue();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    async function fetchPopular() {
      const res = await axios
        .get(
          `https://api.mangadex.org/manga?limit=15&order%5BfollowedCount%5D=desc&availableTranslatedLanguage%5B%5D=en`
        )
        .catch((err) => console.log(err));
      // console.log("Popular : ", res?.data?.data);
      dispatch({
        type: "SET_POPULAR",
        popular: res?.data?.data,
      });
    }
    async function fetchAction() {
      const res = await axios
        .get(
          `https://api.mangadex.org/manga?limit=15&order%5BfollowedCount%5D=desc&includedTags%5B%5D=391b0423-d847-456f-aff0-8b0cfc03066b&includedTagsMode=AND&availableTranslatedLanguage%5B%5D=en`
        )
        .catch((err) => console.log(err));
      // console.log("Action : ", res?.data?.data);
      dispatch({
        type: "SET_ACTION",
        action: res?.data?.data,
      });
    }
    async function fetchComedy() {
      const res = await axios
        .get(
          `https://api.mangadex.org/manga?limit=15&order%5BfollowedCount%5D=desc&includedTags%5B%5D=4d32cc48-9f00-4cca-9b5a-a839f0764984&includedTagsMode=AND&availableTranslatedLanguage%5B%5D=en`
        )
        .catch((err) => console.log(err));
      // console.log("Comedy : ", res?.data?.data);
      dispatch({
        type: "SET_COMEDY",
        comedy: res?.data?.data,
      });
    }
    async function fetchManhwa() {
      const res = await axios
        .get(
          `https://api.mangadex.org/manga?limit=15&order%5BfollowedCount%5D=desc&originalLanguage%5B%5D=ko&availableTranslatedLanguage%5B%5D=en`
        )
        .catch((err) => console.log(err));
      // console.log("Manhwa : ", res?.data?.data);
      dispatch({
        type: "SET_MANHWA",
        manhwa: res?.data?.data,
      });
    }

    fetchAction();
    fetchPopular();
    fetchComedy();
    fetchManhwa();
    setOpen(false);
  }, []);
  useEffect(() => {
    console.log("Changing token");
    var expire = localStorage.getItem("mhp_expires");
    var temp = new Date(expire).getTime();
    if (new Date().getTime() < temp) {
      var _token = localStorage.getItem("mhp_access_token");
      if (_token) {
        dispatch({
          type: "SET_TOKEN",
          token: _token,
        });
      } else {
        localStorage.setItem("mhp_expires", null);
        localStorage.setItem("mhp_access_token", null);
      }
    } else {
      localStorage.setItem("mhp_expires", null);
      localStorage.setItem("mhp_access_token", null);
    }
  }, [token]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onClick={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <center>
            <h1>Read Before</h1>
          </center>
          <p>
            This is a Unofficial Manga viewing web app created using api
            provided by{" "}
            <strong
              onClick={() =>
                (window.location.href =
                  "https://api.mangadex.org/swagger.html#")
              }
              style={{ cursor: "pointer" }}
            >
              MangaDex.
            </strong>
          </p>

          <p>
            User can use their MangaDex accounts to log in and view their
            personalise list however to avoid copyright issues user cannot view
            any of the chapters. This web application was a development project
            and is <strong>NOT</strong> used for any commercial gain.
          </p>
          <p>
            The web application is made to only view the content and does{" "}
            <strong>NOT</strong> affect user's mangadex account in any manner.
          </p>
        </Box>
      </Modal>

      <Display />
    </div>
  );
}

export default App;
