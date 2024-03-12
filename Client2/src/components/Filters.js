import React from "react";

const Filters = () => {
  return (
    <div className="container-fluid text-center">
      <div className="row">
        <div className="col ">
          <input
            className="form-control"
            type="text"
            placeholder="Module"
            aria-label="Module"
          />
        </div>
        <div className="col">
          <select className="form-select" aria-label="Default select example">
            <option>Section</option>
            <option value="1">A</option>
            <option value="2">B</option>
            <option value="3">C</option>
          </select>
        </div>
        <div className="col">
          {" "}
          <select className="form-select" aria-label="Default select example">
            <option>Groupe</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="col">
          {" "}
          <input
            className="form-control"
            type="text"
            placeholder="Matricule"
            aria-label="Matricule"
          />
        </div>
        <div className="col">
          {" "}
          <button type="button" className="btn btn-secondary">
            submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
