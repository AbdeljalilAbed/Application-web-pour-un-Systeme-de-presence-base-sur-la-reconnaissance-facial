/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { AuthProvider } from "../components/AuthContext";
import { jwtDecode } from "jwt-decode";
import Logout from "../components/Logout";
import "./Admin.css";
import GestionEnseignants from "../components/GestionEnseignants";
import GestionEtudiants from "../components/GestionEtudiants";
import GestionEdt from "../components/GestionEdt";

function Admin() {
  const [username, setUsername] = useState("");
  const [column1Component, setColumn1Component] = useState(null);

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
    } else {
      console.error("Failed to decode JWT token");
    }

    // Call handleGestionProfsClick to render components in the "Gestion de Prof" tab by default
    handleGestionProfsClick();
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const handleGestionEtudiantClick = () => {
    setColumn1Component(<GestionEtudiants />);
  };

  const handleGestionProfsClick = () => {
    setColumn1Component(<GestionEnseignants />);
  };

  const handleGestionEdtClick = () => {
    setColumn1Component(<GestionEdt />);
  };

  return (
    <div className="container-fluid bg">
      <br></br>
      <div className="container p-3 bg-body rounded ">
        <div className="row">
          <div className="col-4">
            <ul className="nav">
              <li className="nav-item mt-1">
                <AuthProvider>
                  <Logout />
                </AuthProvider>
              </li>
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
                  Getsion des Enseignants
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
                <a
                  className="nav-link text-dark"
                  aria-current="page"
                  href="#"
                  onClick={handleGestionEdtClick}
                >
                  Gestion des Emploi du temps
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {column1Component}
    </div>
  );
}

export default Admin;
