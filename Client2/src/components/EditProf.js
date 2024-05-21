import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

const EditProf = ({ enseignant, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    MatriculeProf: enseignant.MatriculeProf,
    username: enseignant.username,
    nom: enseignant.nom,
    prenom: enseignant.prenom,
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${backendURL}/modifierEnseignant/${enseignant.MatriculeProf}`,
        formData
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating professor:", error);
    }
  };

  return (
    <div className="col border border-primary border-3 rounded p-3 m-2">
      <h5 class="text-center">Modifier Enseignant</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Matricule</label>
          <input
            type="text"
            className="form-control"
            name="MatriculeProf"
            value={formData.MatriculeProf}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Prénom</label>
          <input
            type="text"
            className="form-control"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Mot de passe (laisser vide si inchangé)
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="row text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary m-2">
              Mettre à jour
            </button>
            <button
              type="button"
              className="btn btn-secondary m-2"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProf;
