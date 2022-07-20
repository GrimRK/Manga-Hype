import { Input } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useStateProviderValue } from "../StateProvider";
import "./css/Login.css";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
function Login() {
  const [{ token }, dispatch] = useStateProviderValue();
  const [toggle, setToggle] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    dispatch({
      type: "SET_CURRENTCOMPONENT",
      currentComponent: "login",
    });
  }, []);
  useEffect(() => {
    if (token) {
      navigate("/");
    }
    return;
  }, [token]);

  const handleLogin = (e) => {
    e.preventDefault();
    // console.log("user", email, password);
    signInWithEmailAndPassword(auth, email, password);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // console.log("user", email, username, password);

    async function getUsername() {
      const docRef = doc(db, `users/${username}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((res) => {
            // console.log("usercreated", res);
            updateProfile(auth.currentUser, {
              displayName: username,
            });
            setDoc(docRef, {
              username: username,
              followedManga: [],
            });
          })
          .catch((err) => console.log(err));
      }
    }
    getUsername();
  };

  return (
    <div className="login">
      <form className={`login_form ${toggle ? "hide_form" : ""}`}>
        <h1>Log In</h1>
        <Input
          className="login_input"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="login_input"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login_button" onClick={(e) => handleLogin(e)}>
          Log In
        </div>
        <div className="switch_button" onClick={() => setToggle(true)}>
          Sign Up
        </div>
      </form>
      <form className={`signup_form ${toggle ? "" : "hide_form"}`}>
        <h1>Sign Up</h1>
        <Input
          className="signup_input"
          placeholder="Username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          className="signup_input"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="signup_input"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="signup_button" onClick={(e) => handleSignUp(e)}>
          Sign Up
        </div>
        <div className="switch_button" onClick={() => setToggle(false)}>
          Log In
        </div>
      </form>
    </div>
  );
}

export default Login;
