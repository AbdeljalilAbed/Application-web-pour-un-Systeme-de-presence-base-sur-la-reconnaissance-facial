import React, { useState } from "react";
import { backendURL } from "../config";
import axios from "axios";
import "./Table.css";

function Table() {
  //const [Etds, setEtds] = useState([]);
  const [EtdsG2, setEtdsG2] = useState([]);
  const [isPresent, setIsPresent] = useState({});

  function fetchData() {
    axios
      .get(backendURL + "/getEtdsPresent")
      .then((res) => {
        //setEtds(res.data);

        // Obtenir les MatriculeEtd présents dans la réponse de getAggregatedData
        const matriculesInAggregatedData = res.data.map(
          (item) => item.MatriculeEtd
        );

        axios
          .get(backendURL + "/getEtds")
          .then((res) => {
            setEtdsG2(res.data);
            // Créer un objet avec les MatriculeEtd comme clés et initialiser à true
            const defaultPresentStatus = res.data.reduce((acc, cur) => {
              acc[cur.MatriculeEtd] = matriculesInAggregatedData.includes(
                cur.MatriculeEtd
              );
              return acc;
            }, {});
            setIsPresent(defaultPresentStatus);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  const handleCheckboxChange = (MatriculeEtd, checked) => {
    if (checked) {
      axios
        .post(backendURL + "/postEtdsPresent", {
          matricule: MatriculeEtd,
        })
        .then(() => {
          setIsPresent((prevState) => ({ ...prevState, [MatriculeEtd]: true }));
          console.log(`Added ${MatriculeEtd} to the collection presence`);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .delete(`${backendURL}/deleteEtd/${MatriculeEtd}`)
        .then(() => {
          setIsPresent((prevState) => ({
            ...prevState,
            [MatriculeEtd]: false,
          }));
          console.log(`Deleted ${MatriculeEtd} from the collection presence`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container">
      <div className="suii">
        <button
          onClick={fetchData}
          type="button"
          className="btn btn-secondary btn-lg"
        >
          Mark Attendance
        </button>
      </div>

      <div className="table-responsive">
        {EtdsG2.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Présence</th>
              </tr>
            </thead>
            <tbody>
              {EtdsG2.map((Etd, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{Etd.MatriculeEtd}</td>
                  <td>{Etd.nom}</td>
                  <td>{Etd.prenom}</td>
                  <td>
                    <input
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                      checked={isPresent[Etd.MatriculeEtd] || false}
                      onChange={(e) =>
                        handleCheckboxChange(Etd.MatriculeEtd, e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">Aucune présence à afficher</p>
        )}
      </div>
    </div>
  );
}

export default Table;
