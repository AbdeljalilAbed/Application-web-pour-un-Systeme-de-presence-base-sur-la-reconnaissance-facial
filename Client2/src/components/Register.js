import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";

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
      const response = await axios.post("http://localhost:3001/register", {
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
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="profCheckbox"
            value="prof"
            checked={role === "prof"}
            onChange={() => handleRoleChange("prof")}
          />
          <label className="form-check-label" htmlFor="profCheckbox">
            Prof
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
          <label className="form-check-label" htmlFor="adminCheckbox">
            Admin
          </label>
        </div>

        <input
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          placeholder="Matricule"
          required={!isMatriculeDisabled} // Set required only if matricule is not disabled
          disabled={isMatriculeDisabled}
        />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Registration;
