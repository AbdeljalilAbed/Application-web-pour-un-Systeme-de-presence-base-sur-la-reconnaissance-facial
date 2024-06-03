import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      axios.post(backendURL + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload data");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3">
      <div className="login-header">Ajouter liste des etudiants</div>
      <p>Le ficiher doit être en excel sous fourme d'un tableau</p>
      <form>
        <input
          placeholder="Fichier"
          className="login-input"
          id="file"
          type="file"
          onChange={handleFileChange}
        />
        <button className="login-button" type="submit" onClick={handleUpload}>
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
