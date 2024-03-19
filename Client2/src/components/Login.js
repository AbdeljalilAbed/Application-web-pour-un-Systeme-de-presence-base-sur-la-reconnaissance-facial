import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../config";

import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/login`, {
        username,
        password,
      });

      const { token, role } = response.data; // Extract token and role from response
      console.log(role);
      setToken(token);
      localStorage.setItem("token", token);

      if (role === "prof") {
        navigate("/prof"); // Redirect to '/prof' if the user is a professor
      } else if (role === "admin") {
        navigate("/admin"); // Redirect to '/admin' if the user is an admin
      } else {
        // Handle other roles or scenarios
        // For example, navigate to a default route
        navigate("/default");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setToken(null);
      localStorage.removeItem("token");
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">Login</div>
      <div>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
            className="login-input"
            id="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            placeholder="Password"
            id="password"
          />
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
