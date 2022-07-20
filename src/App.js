import axios from "./axios";
import { useEffect, useState } from "react";
import "./App.css";
import Display from "./pages/Display";
import { useStateProviderValue } from "./StateProvider";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { BrowserRouter } from "react-router-dom";

function App() {
  const [{}, dispatch] = useStateProviderValue();
  useEffect(() => {
    async function fetchPopular() {
      const res = await axios
        .get(
          `https://kitsu.io/api/edge/manga?page[limit]=20&sort=popularityRank`
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
          `https://kitsu.io/api/edge/manga?filter[categories]=Action&page[limit]=15&sort=-averageRating`
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
          `https://kitsu.io/api/edge/manga?filter[categories]=comedy&page[limit]=15&sort=-averageRating`
        )
        .catch((err) => console.log(err));
      // console.log("Comedy : ", res?.data?.data);
      dispatch({
        type: "SET_COMEDY",
        comedy: res?.data?.data,
      });
    }
    async function fetchRomance() {
      const res = await axios
        .get(
          `https://kitsu.io/api/edge/manga?filter[categories]=romance&page[limit]=15&sort=-averageRating`
        )
        .catch((err) => console.log(err));
      // console.log("Romance : ", res?.data?.data);
      dispatch({
        type: "SET_ROMANCE",
        romance: res?.data?.data,
      });
    }

    onAuthStateChanged(auth, (authUser) => {
      console.log("authenticated SUer", authUser);
      if (authUser) {
        dispatch({
          type: "SET_TOKEN",
          token: authUser?.accessToken,
        });

        async function getUser() {
          const docRef = doc(db, `users/${authUser.displayName}`);
          const docSnap = await getDoc(docRef);
          dispatch({
            type: "SET_USER",
            user: docSnap.data(),
          });
        }
        getUser();
      } else {
        dispatch({
          type: "SET_TOKEN",
          token: null,
        });
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });

    fetchAction();
    fetchPopular();
    fetchComedy();
    fetchRomance();
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      const docRef = doc(db, `users/${auth.currentUser.displayName}`);
      onSnapshot(docRef, (res) => {
        console.log("changed User", res.data());
        dispatch({
          type: "SET_USER",
          user: res?.data(),
        });
      });
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Display />
      </BrowserRouter>
    </div>
  );
}

export default App;
