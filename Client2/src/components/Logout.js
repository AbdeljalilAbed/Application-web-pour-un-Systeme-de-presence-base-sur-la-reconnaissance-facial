import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const Logout = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <button
      type="button"
      className="btn btn-outline-dark btn-sm"
      onClick={handleLogout}
    >
      Se déconnecter
    </button>
  );
};

export default Logout;
