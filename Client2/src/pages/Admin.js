/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Register from "../components/Register";
import AddProf from "../components/AddProf";
import RemoveProf from "../components/RemoveProf";
import UploadForm from "../components/UploadForm";
import AddEtd from "../components/AddEtd";
import RemoveEtd from "../components/RemoveEtd";
import Logout from "../components/Logout";
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

    // Call handleGestionProfsClick to render components in the "Gestion de Prof" tab by default
    handleGestionProfsClick();
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const handleGestionEtudiantClick = () => {
    setColumn1Component(<UploadForm />);
    setColumn2Component(<AddEtd />);
    setColumn3Component(<RemoveEtd />);
  };

  const handleGestionProfsClick = () => {
    setColumn1Component(<Register />);
    setColumn2Component(<AddProf />);
    setColumn3Component(<RemoveProf />);
  };

  return (
    <div className="container-fluid bg vh-100">
      <br></br>

      <div className="container p-3 bg-body rounded ">
        <div className="row">
          <div className="col-4">
            <ul className="nav">
              <li className="nav-item">
                {" "}
                <a
                  className="nav-link active text-dark"
                  aria-current="page"
                  href="#"
                >
                  User : {username}
                </a>
              </li>
              {/* <li className="nav-item">
                <Logout />
              </li> */}
            </ul>
          </div>
          <div className="col-8">
            <ul className="nav justify-content-end nav-underline">
              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  href="#"
                  onClick={handleGestionProfsClick}
                >
                  Getsion de Prof
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link text-dark"
                  href="#"
                  onClick={handleGestionEtudiantClick}
                >
                  Gestion des Etudiants
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" aria-current="page" href="#">
                  Gestion des Rpi
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" aria-current="page" href="#">
                  Gestion des Emplois du temps
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container vh-100 text-center pt-5">
        <div className="row pt-5">
          <div className="col  p-3 m-5 bg-body rounded pt-5">
            {column1Component}
          </div>
          <div className="col  p-3 m-5 bg-body rounded pt-5">
            {column2Component}
          </div>
          <div className="col  p-3 m-5 bg-body rounded pt-5">
            {column3Component}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
