import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const AddProf = () => {
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

      <div className="login-header">Add Professor</div>
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
          <button className="login-button" type="submit">
            Add Professor
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProf;
