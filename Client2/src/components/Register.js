import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { backendURL } from "../config";
import "./Register.css";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [matricule, setMatricule] = useState("");

  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [isMatriculeDisabled, setIsMatriculeDisabled] = useState(false);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setIsMatriculeDisabled(selectedRole === "admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendURL + "/register", {
        username,
        password,
        matricule,
        role,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Registration failed:", error.response.data.error);
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3">
      <div className="login-header">Nouveau compte utilisateur</div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="d-flex">
            <div className="form-check pe-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="profCheckbox"
                value="prof"
                checked={role === "prof"}
                onChange={() => handleRoleChange("prof")}
              />
              <label
                className=" d-flex form-check-label"
                htmlFor="profCheckbox"
              >
                Enseignant
              </label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="adminCheckbox"
                value="admin"
                checked={role === "admin"}
                onChange={() => handleRoleChange("admin")}
              />
              <label
                className="d-flex form-check-label"
                htmlFor="adminCheckbox"
              >
                Administrateur
              </label>
            </div>
          </div>

          <input
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            placeholder="Matricule"
            required={!isMatriculeDisabled} // Set required only if matricule is not disabled
            disabled={isMatriculeDisabled}
            type="text"
            className="login-input"
            id="username"
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
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Registration;
