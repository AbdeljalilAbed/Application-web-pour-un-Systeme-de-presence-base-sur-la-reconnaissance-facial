/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import UploadForm from "../components/UploadForm";
import Register from "../components/Register";
import AddProf from "../components/AddProf";
import RemoveProf from "../components/RemoveProf";
import { jwtDecode } from "jwt-decode";
import "./Admin.css";

function Admin() {
  const [username, setUsername] = useState("");
  const [column1Component, setColumn1Component] = useState(null);
  const [column2Component, setColumn2Component] = useState(null);
  const [column3Component, setColumn3Component] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found in local storage");
      return;
    }
    // Decode the JWT token
    const decodedToken = jwtDecode(token);
    if (decodedToken) {
      // Extract the desired field (e.g., 'userId') into a variable
      const username = decodedToken.username;
      setUsername(username);
      // Now you can use the 'userId' variable for further processing
      console.log("User:", username);
    } else {
      console.error("Failed to decode JWT token");
    }
  }, []); // Empty dependency array ensures this effect runs only once after initial render
  const handleGestionEtudiantClick = () => {
    setColumn1Component(<UploadForm />);
    //setColumn2Component(<AddEtd />);
    setColumn3Component(null);
  };

  const handleGestionProfsClick = () => {
    setColumn1Component(<Register />);
    setColumn2Component(<AddProf />);
    setColumn3Component(<RemoveProf />);
  };
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          Navbar
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Features
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Pricing
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link disabled"
                href="#"
                tabindex="-1"
                aria-disabled="true"
              >
                Disabled
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Admin;
