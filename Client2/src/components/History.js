import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

const History = () => {
  const [Etds, setEtds] = useState([]);

  const [selectedPalier, setSelectedPalier] = useState("");
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [matricule, setMatricule] = useState("");
  const [specialites, setSpecialites] = useState([]);
  const [sections, setSections] = useState([]);

  // Define options for palier, specialite, and section
  const paliers = ["L1", "L2", "L3", "M1", "M2"];
  const specialitesByPalier = {
    L1: ["TRONC COMMUN"],
    L2: ["ACAD", "ISIL", "GTR"],
    L3: ["ACAD", "ISIL", "GTR"],
    M1: ["RSD", "IL", "SII", "SSI", "BIGDATAA", "MIND", "IV", "BIOINFO", "HPC"],
    M2: ["RSD", "IL", "SII", "SSI", "BIGDATAA", "MIND", "IV", "BIOINFO", "HPC"],
  };
  const sectionsBySpecialite = {
    "TRONC COMMUN": ["A", "B", "C", "D", "E", "F"],
    ACAD: ["A", "B", "C"],
    ISIL: ["A", "B"],
    RSd: ["A"],
    IL: ["A"],
    SII: ["A"],
    BIGDATAA: ["A"],
    MIND: ["A"],
    IV: ["A"],
    BIOINFO: ["A"],
    HPC: ["A"],
    // Add sections for other specialities
  };

  // Handle palier change
  const handlePalierChange = (e) => {
    const palier = e.target.value;
    setSelectedPalier(palier);
    setSelectedSpecialite(""); // Reset selected specialite
    setSpecialites(specialitesByPalier[palier] || []);
  };

  // Handle specialite change
  const handleSpecialiteChange = (e) => {
    const specialite = e.target.value;
    setSelectedSpecialite(specialite);
    setSelectedSection(""); // Reset selected section
    setSections(sectionsBySpecialite[specialite] || []);
  };

  // Handle section change
  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
  };

  // Handle form submit
  const handleSubmit = async () => {
    // Make a GET request with selected options
    console.log(selectedPalier);
    console.log(selectedGroup);
    console.log(matricule);
    try {
      const etdsResponse = await axios.get(backendURL + "/historyEtds", {
        params: {
          palier: selectedPalier,
          specialite: selectedSpecialite,
          section: selectedSection,
          groupe: selectedGroup,
          matricule: matricule,
        },
      });
      setEtds(etdsResponse.data);

      // Handle response data
      console.log("Response:", Etds);
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };

  return (
    <div className="container vh-100">
      <div className="container-fluid text-center">
        <div className="row">
          <div className="col-2">
            <select
              className="form-select"
              aria-label="Palier"
              value={selectedPalier}
              onChange={handlePalierChange}
            >
              <option value="">Palier</option>
              {paliers.map((palier) => (
                <option key={palier} value={palier}>
                  {palier}
                </option>
              ))}
            </select>
          </div>
          <div className="col-2">
            <select
              className="form-select"
              aria-label="Specialite"
              value={selectedSpecialite}
              onChange={handleSpecialiteChange}
              disabled={!selectedPalier}
            >
              <option value="">Specialite</option>
              {specialites.map((specialite) => (
                <option key={specialite} value={specialite}>
                  {specialite}
                </option>
              ))}
            </select>
          </div>
          <div className="col-2">
            <select
              className="form-select"
              aria-label="Section"
              value={selectedSection}
              onChange={handleSectionChange}
              disabled={!selectedSpecialite}
            >
              <option value="">Section</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
          <div className="col-2">
            <select
              className="form-select"
              aria-label="Group"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              disabled={!selectedSection}
            >
              <option value="">Group</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="col-2">
            <input
              className="form-control"
              type="text"
              placeholder="Matricule"
              aria-label="Matricule"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
            />
          </div>
          <div className="col-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="table-responsive">
        {" "}
        <div className="table-responsive">
          {Etds.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Date1</th>
                  <th>Date1</th>
                  <th>Date1</th>
                  <th>Date1</th>
                  <th>Date1</th>
                </tr>
              </thead>
              <tbody>
                {Etds.map((Etd, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{Etd.MatriculeEtd}</td>
                    <td>{Etd.nom}</td>
                    <td>{Etd.prenom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  <th>Date1</th>
                  <th>Date1</th>
                  <th>Date1</th>
                  <th>Date1</th>
                  <th>Date1</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>{Etds.MatriculeEtd}</td>
                  <td>{Etds.nom}</td>
                  <td>{Etds.prenom}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
