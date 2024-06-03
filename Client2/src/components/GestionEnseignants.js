import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import AddProf from "./AddProf";
import EditProf from "./EditProf";
import { backendURL } from "../config";
import axios from "axios";

const GestionEnseignants = () => {
  const [Enseignants, setEnseignants] = useState([]);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const EnseignantsResponse = await axios.get(
          `${backendURL}/getEnseignants`
        );
        setEnseignants(EnseignantsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (matricule) => {
    try {
      await axios.delete(`${backendURL}/removeProf/${matricule}`);
      setEnseignants(
        Enseignants.filter((ens) => ens.MatriculeProf !== matricule)
      );
      setSelectedEnseignant(null);
    } catch (error) {
      console.error("Error deleting Enseignant:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const EnseignantsResponse = await axios.get(
        `${backendURL}/getEnseignants`
      );
      setEnseignants(EnseignantsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container bg-body rounded mt-3 text-center">
      <div className="row p-4">
        <div className="col">
          <Popup
            trigger={
              <button type="button" className="btn btn-secondary btn-lg">
                Ajouter Enseignant
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div>
                <div className="row text-end">
                  <div className="col">
                    <button
                      className="btn btn-primary close mb-1"
                      onClick={close}
                      position="top right"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <AddProf />
              </div>
            )}
          </Popup>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom d'utilisateur</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Enseignants.map((Enseignant, index) => (
                <tr key={index}>
                  <td>{Enseignant.MatriculeProf}</td>
                  <td>{Enseignant.username}</td>
                  <td>{Enseignant.nom}</td>
                  <td>{Enseignant.prenom}</td>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        setSelectedEnseignant(Enseignant);
                        setIsEdit(true);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pen"
                        viewBox="0 0 16 16"
                      >
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                      </svg>
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setSelectedEnseignant(Enseignant)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEnseignant && isEdit && (
        <Popup
          open={true}
          modal
          nested
          onClose={() => {
            setSelectedEnseignant(null);
            setIsEdit(false);
          }}
        >
          <div>
            <div className="row text-end">
              <div className="col">
                <button
                  className="btn btn-primary close mb-1"
                  onClick={() => {
                    setSelectedEnseignant(null);
                    setIsEdit(false);
                  }}
                  position="top right"
                >
                  &times;
                </button>
              </div>
            </div>
            <EditProf
              enseignant={selectedEnseignant}
              onClose={() => {
                setSelectedEnseignant(null);
                setIsEdit(false);
              }}
              onUpdate={handleUpdate}
            />
          </div>
        </Popup>
      )}

      {selectedEnseignant && !isEdit && (
        <Popup
          open={true}
          modal
          nested
          onClose={() => setSelectedEnseignant(null)}
        >
          <div>
            <div className="row text-end">
              <div className="col">
                <button
                  className="btn btn-primary close mb-1"
                  onClick={() => setSelectedEnseignant(null)}
                  position="top right"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="col border border-primary border-3 rounded text-center p-3 m-2">
              <h5>Confirmation de suppression</h5>
              <p>Êtes-vous sûr de vouloir supprimer l'enseignant suivant ?</p>
              <p>
                <strong>Matricule:</strong> {selectedEnseignant.MatriculeProf}
              </p>
              <p>
                <strong>Nom:</strong> {selectedEnseignant.nom}
              </p>
              <p>
                <strong>Prénom:</strong> {selectedEnseignant.prenom}
              </p>
              <button
                className="btn btn-danger m-2"
                onClick={() => handleDelete(selectedEnseignant.MatriculeProf)}
              >
                Supprimer
              </button>
              <button
                className="btn btn-secondary m-2"
                onClick={() => setSelectedEnseignant(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default GestionEnseignants;
