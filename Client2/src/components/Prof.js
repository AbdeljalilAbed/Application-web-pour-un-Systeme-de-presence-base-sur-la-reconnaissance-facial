import * as React from "react";
import Table from "./Table";
import History from "./History";
import Filters from "./Filters";
import "./Prof.css";
//import { useState } from "react";
//import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";

function Prof(props) {
  /*  const [Etds, setEtds] = useState([]);
  const fetchData = async () => {
    axios
      .get("http://localhost:3001/getEtds")
      .then((Etds) => setEtds(Etds.data))
      .catch((err) => console.log(err));
  };
 */
  return (
    <>
      <div className="div">
        <div className="div-1">
          <div className="div-2">
            <div className="div-3">Classroom Insights</div>
            <div className="div-4">Today's attendance at a glance.</div>
            {/*             <div className="div-5">
              <button
                //onClick={Table}
                type="button"
                className="btn btn-secondary btn-lg"
              >
                Mark Attendance
              </button>
            </div>
 */}{" "}
          </div>
        </div>
        <br></br>
        <Table />
        {/*         <table className="table table-bordered p-5 ">
          <thead>
            <tr>
              <th>#</th>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Presence</th>
            </tr>
          </thead>
          <tbody>
            {Etds.map((Etd, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{Etd.MatriculeEtd}</td>
                  <td>{Etd.nom}</td>
                  <td>{Etd.prenom}</td>
                  <td>
                    <input
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
 */}{" "}
        <br></br>
        <div className="div-1">
          <div className="div-2">
            <div className="div-3">Attendance Overview</div>
            <div className="div-4">Hsitory attendance </div>
          </div>
        </div>
      </div>
      <br></br>
      <Filters />

      <br></br>
      <History />
      <style jsx="true">{``}</style>
    </>
  );
}
export default Prof;
