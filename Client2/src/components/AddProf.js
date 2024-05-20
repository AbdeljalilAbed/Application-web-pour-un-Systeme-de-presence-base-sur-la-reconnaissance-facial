import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const AddProf = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [MatriculeProf, setMatriculeProf] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddProf = async () => {
    try {
      // Send a POST request to your backend endpoint to add the professor
      const response = await axios.post(backendURL + "/addProf", {
        MatriculeProf,
        nom,
        prenom,
        username,
        password,
      });
      console.log(response.data); // Log response from the server
      setSuccessMessage("Professor added successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding professor:", error);
      setErrorMessage("Error adding professor. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3">
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="login-header">Ajouter un enseignant</div>
      <div>
        <form onSubmit={handleAddProf}>
          <input
            value={MatriculeProf}
            onChange={(e) => setMatriculeProf(e.target.value)}
            placeholder="Matricule"
            type="text"
            className="login-input"
            id="MatriculeProf"
          />
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom"
            className="login-input"
            id="NOm"
          />
          <input
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="prenom"
            required
            className="login-input"
            id="prenom"
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="login-input"
            id="password"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="login-input"
            id="password"
          />
          <button className="login-button" type="submit">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProf;
