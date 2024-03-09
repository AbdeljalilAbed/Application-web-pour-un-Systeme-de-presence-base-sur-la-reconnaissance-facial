import React from "react";
import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 px-4">
      <div className="row gx-5 p-2">
        <div className="col text-center">
          <Link to="/admin">
            <button className="btn btn-primary btn-lg ">Admin</button>
          </Link>
        </div>
      </div>
      <div className="row gx-5 p-2">
        <div className="col text-center">
          <Link to="/prof">
            <button className="btn btn-primary btn-lg ">Prof</button>
          </Link>
        </div>
      </div>
      <div className="row gx-5 p-2">
        <div className="col text-center">
          <Link to="Etudiant">
            <button className="btn btn-primary btn-lg ">Etudiant</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
