import React, { useEffect, useState } from "react";
import { backendURL } from "../config";
import axios from "axios";
import Modal from "react-modal";
import AddProf from "./AddProf"; // Ensure the path is correct
import "./ModalStyles.css"; // Create and import CSS for modal

// Set the app element for react-modal
Modal.setAppElement("#root"); // '#root' should match the id of your app's root element

const GestionEnseignants = () => {
  const [Enseignants, setEnseignants] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

    fetchData(); // Call fetchData when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="container bg-body rounded mt-3 text-center">
      <div className="row p-4">
        <div className="col">
          <button
            onClick={openModal} // Open the modal when button is clicked
            type="button"
            className="btn btn-secondary"
          >
            Ajouter Enseignant
          </button>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive">
          <table className="table mt-2">
            <thead>
              <tr>
                <th>Matricule</th>
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
                  <td>{Enseignant.nom}</td>
                  <td>{Enseignant.prenom}</td>
                  <td>
                    <button type="button" className="btn">
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
                    <button type="button" className="btn">
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Professor"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <AddProf />
        <button onClick={closeModal} className="close-modal-button">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default GestionEnseignants;
