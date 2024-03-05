import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Table() {
  const [Etds, setEtds] = useState([]);
  //const [EtdsG2, setEtdsG2] = useState([]);

  /*   useEffect(() => {
    axios
      .get("http://localhost:3001/getGroupedDataForGroup2")
      .then((Etds) => setEtdsG2(EtdsG2.data))
      .catch((err) => console.log(err));
  }, []) */ useEffect(() => {
    axios
      .get("http://localhost:3001/getAggregatedData")
      .then((Etds) => setEtds(Etds.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="table-responsive">
        <table className="table table-bordered ">
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
                      key={index}
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                      checked
                    />
                    {/* 
                    {EtdsG2.map((EtdP, index) => {
                      if (EtdP.MatriculeEtd === Etd.MatriculeEtd) {
                        return (
                          <input
                            key={index}
                            type="checkbox"
                            aria-label="Checkbox for following text input"
                            checked
                          />
                        );
                      } else {
                        return (
                          <input
                            key={index}
                            type="checkbox"
                            aria-label="Checkbox for following text input"
                          />
                        );
                      }
                    })}
 */}{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
