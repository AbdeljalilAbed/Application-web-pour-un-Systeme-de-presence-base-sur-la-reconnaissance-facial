import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { backendURL } from "../config";

import EditProf from "../components/EditProf";
import { AuthProvider } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import History from "../components/History";
import "./Prof.css";
import "bootstrap/dist/css/bootstrap.css";

function Prof() {
  const navigate = useNavigate();
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [profInfo, setProfInfo] = useState(null);

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleProfileClick = async () => {
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
      // Now you can use the 'userId' variable for further processing
      console.log("User:", username);
    } else {
      console.error("Failed to decode JWT token");
    }

    try {
      const response = await axios.get(
        `${backendURL}/getProfByUsername/${decodedToken.username}`
      );
      setProfInfo(response.data);
      setIsProfilePopupOpen(true);
    } catch (error) {
      console.error("Error fetching professor information:", error);
    }
  };

  const closeProfilePopup = () => {
    setIsProfilePopupOpen(false);
    setProfInfo(null);
  };

  const handleUpdate = () => {
    // Logic to handle after update (e.g., refresh the data)
    closeProfilePopup();
  };
  return (
    <AuthProvider>
      {" "}
      {/* Wrap your component tree with AuthProvider */}
      <div className="div">
        <nav class="navbar navbar-light bg-light">
          <form class="container-fluid justify-content-between">
            <button
              onClick={handleLogout}
              class="btn btn-lg btn-outline-dark"
              type="button"
            >
              Se déconnecter
            </button>
            <button
              onClick={handleProfileClick}
              class="btn btn-lg btn-secondary"
              type="button"
            >
              Profile
            </button>
          </form>
        </nav>
        <div className="div-1">
          <div className="div-2">
            <div className="div-3">Aperçus en classe</div>
            <div className="div-4">Présence du jour en un coup d'œil.</div>
          </div>
        </div>
        <br />
        <Table />
        <br />
        <div className="div-1">
          <div className="div-2">
            <div className="div-3">Vue d'ensemble de la présence</div>
            <div className="div-4">Historique de presences </div>
          </div>
        </div>
      </div>
      <br />
      <History />
      {isProfilePopupOpen && (
        <Popup open={true} modal nested onClose={closeProfilePopup}>
          <div>
            <div className="row text-end">
              <div className="col">
                <button
                  className="btn btn-primary close mb-1"
                  onClick={closeProfilePopup}
                  position="top right"
                >
                  &times;
                </button>
              </div>
            </div>
            {profInfo && (
              <EditProf
                enseignant={profInfo}
                onClose={closeProfilePopup}
                onUpdate={handleUpdate}
              />
            )}
          </div>
        </Popup>
      )}{" "}
    </AuthProvider>
  );
}

export default Prof;
