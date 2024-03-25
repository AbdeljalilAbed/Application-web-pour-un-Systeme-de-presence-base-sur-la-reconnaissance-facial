import React, { useEffect, useState } from "react";
import { backendURL } from "../config";
import axios from "axios";
import "./Table.css";
import { jwtDecode } from "jwt-decode";

function Table() {
  //const [Etds, setEtds] = useState([]);
  const [Etds, setEtds] = useState([]);
  const [isPresent, setIsPresent] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [matricule, setMatricule] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found in local storage");
          return;
        }
        // Decode the JWT token
        const decodedToken = jwtDecode(token);
        if (decodedToken) {
          // Extract the desired field (e.g., 'userId') into a variable
          const username = decodedToken.username;
          // Now you can use the 'userId' variable for further processing
          console.log("User:", username);
        } else {
          console.error("Failed to decode JWT token");
        }

        const etdsResponse = await axios.get(
          `${backendURL}/getEtds/${decodedToken.username}`
        );
        const etdsData = etdsResponse.data;
        setEtds(etdsResponse.data);

        const aggregatedResponse = await axios.get(
          backendURL + "/getEtdsPresent"
        );
        const matriculesInAggregatedData = aggregatedResponse.data.map(
          (item) => item.MatriculeEtd
        );

        const defaultPresentStatus = etdsData.reduce((acc, cur) => {
          acc[cur.MatriculeEtd] = matriculesInAggregatedData.includes(
            cur.MatriculeEtd
          );
          return acc;
        }, {});
        setIsPresent(defaultPresentStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(); // Call fetchData when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

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
          onClick={() => window.location.reload()} // Refresh the page to fetch data again
          type="button"
          className="btn btn-secondary btn-lg"
        >
          Refresh Attendance
        </button>
      </div>

      <div className="table-responsive">
        {Etds.length > 0 ? (
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
              {Etds.map((Etd, index) => (
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
