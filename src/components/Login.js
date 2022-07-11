import { Button, Input } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useStateProviderValue } from "../StateProvider";
import "./css/Login.css";
function Login() {
  const [{ currentComponent, token }, dispatch] = useStateProviderValue();
  const [username, setUsername] = useState("");
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
    console.log("user", username, password);
    axios
      .post("https://api.mangadex.org/auth/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        const headers = {
          Authorization: `Bearer ${res?.data?.token?.session}`,
        };
        dispatch({
          type: "SET_TOKEN",
          token: res?.data?.token.session,
        });
        localStorage.setItem("mhp_access_token", res?.data?.token?.session);
        var expires = new Date();
        expires.setHours(expires.getHours() + 1);
        localStorage.setItem("mhp_expires", expires.toLocaleString());
        axios
          .get("https://api.mangadex.org/auth/check", { headers: headers })
          .then((res) => {
            console.log("Hello", res);
            navigate("/");
          });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login">
      <form className="login_form">
        <h1>Log In</h1>
        <Input
          className="login_input"
          placeholder="Username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
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
      </form>
    </div>
  );
}

export default Login;
