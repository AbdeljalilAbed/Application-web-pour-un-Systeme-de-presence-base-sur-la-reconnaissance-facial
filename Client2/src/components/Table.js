import React, { useEffect, useState } from "react";
import axios from "axios";

function Table() {
  const [Etds, setEtds] = useState([]);
  const [EtdsG2, setEtdsG2] = useState([]);
  const [isPresent, setIsPresent] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/getAggregatedData")
      .then((res) => setEtds(res.data))
      .catch((err) => console.log(err));
      
    axios
      .get("http://localhost:3001/getGroupedDataForGroup2")
      .then((res) => {
        setEtdsG2(res.data);
        // Créer un objet avec les MatriculeEtd comme clés et false comme valeur par défaut
        const defaultPresentStatus = res.data.reduce((acc, cur) => {
          acc[cur.MatriculeEtd] = false;
          return acc;
        }, {});
        setIsPresent(defaultPresentStatus);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCheckboxChange = (MatriculeEtd, checked) => {
    // Mettre à jour l'état local après la réussite de l'API
    if (checked) {
      axios
        .post("http://localhost:3001/postEtds", { matricule: MatriculeEtd })
        .then(() => {
          setIsPresent((prev) => ({ ...prev, [MatriculeEtd]: true })); // Mettre à jour l'état isPresent
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .delete(`http://localhost:3001/deleteEtd/${MatriculeEtd}`)
        .then(() => {
          setIsPresent((prev) => ({ ...prev, [MatriculeEtd]: false })); // Mettre à jour l'état isPresent
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container">
      <div className="table-responsive">
        <table className="table table-bordered">
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
            {EtdsG2.map((Etd, index) => {
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
                      checked={isPresent[Etd.MatriculeEtd]}
                      onChange={(e) =>
                        handleCheckboxChange(
                          Etd.MatriculeEtd,
                          e.target.checked
                        )
                      }
                    />
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
