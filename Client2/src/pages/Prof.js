import React from "react";
import { AuthProvider } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import History from "../components/History";
import "./Prof.css";
import "bootstrap/dist/css/bootstrap.css";

function Prof() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <AuthProvider>
      {" "}
      {/* Wrap your component tree with AuthProvider */}
      <div className="div">
        <nav class="navbar navbar-light bg-light">
          <form class="container-fluid justify-content-start">
            <button
              onClick={handleLogout}
              class="btn btn-outline-dark"
              type="button"
            >
              Se déconnecter
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
    </AuthProvider>
  );
}

export default Prof;
