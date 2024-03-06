import React, { useEffect, useState } from "react";
import axios from "axios";

function Table() {
  const [Etds, setEtds] = useState([]);
  const [EtdsG2, setEtdsG2] = useState([]);
  const [isPresent, setIsPresent] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/getAggregatedData")
      .then((res) => {
        setEtds(res.data);

        // Obtenir les MatriculeEtd présents dans la réponse de getAggregatedData
        const matriculesInAggregatedData = res.data.map(item => item.MatriculeEtd);

        axios
          .get("http://localhost:3001/getGroupedDataForGroup2")
          .then((res) => {
            setEtdsG2(res.data);
            // Créer un objet avec les MatriculeEtd comme clés et initialiser à true
            const defaultPresentStatus = res.data.reduce((acc, cur) => {
              acc[cur.MatriculeEtd] = matriculesInAggregatedData.includes(cur.MatriculeEtd);
              return acc;
            }, {});
            setIsPresent(defaultPresentStatus);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCheckboxChange = (MatriculeEtd, checked) => {
    if (checked) {
      axios
        .post("http://localhost:3001/postEtds", { matricule: MatriculeEtd })
        .then(() => {
          setIsPresent(prevState => ({ ...prevState, [MatriculeEtd]: true }));
          console.log(`Added ${MatriculeEtd} to the collection presence`);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .delete(`http://localhost:3001/deleteEtd/${MatriculeEtd}`)
        .then(() => {
          setIsPresent(prevState => ({ ...prevState, [MatriculeEtd]: false }));
          console.log(`Deleted ${MatriculeEtd} from the collection presence`);
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
      </div>
    </div>
  );
}

export default Table;
