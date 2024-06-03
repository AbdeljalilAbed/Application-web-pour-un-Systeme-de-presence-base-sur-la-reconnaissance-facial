import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const RemoveProf = () => {
  const [MatriculeProf, setMatriculeProf] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemoveProf = async (e) => {
    e.preventDefault();
    try {
      // Send a DELETE request to your backend endpoint to remove the professor
      const response = await axios.delete(
        `${backendURL}/removeProf/${MatriculeProf}`
      );
      console.log(response.data); // Log response from the server
      setSuccessMessage("Professor removed successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error removing professor:", error);
      setErrorMessage("Error removing professor. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3 mt-5">
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="login-header">Supprimer un enseignant</div>
      <form onSubmit={handleRemoveProf}>
        <input
          value={MatriculeProf}
          onChange={(e) => setMatriculeProf(e.target.value)}
          placeholder="Matricule"
          type="text"
          className="login-input"
          id="MatriculeProf"
        />
        <button className="login-button" type="submit">
          Supprimer
        </button>
      </form>
    </div>
  );
};

export default RemoveProf;
