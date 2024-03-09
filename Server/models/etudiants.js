const mongoose = require("mongoose");

const EtdSchema = new mongoose.Schema({
  palier: String,
  specialite: String,
  section: String,
  MatriculeEtd: String,
  nom: String,
  prenom: String,
  etat: String,
  groupe: String,
});

const EtdModel = mongoose.model("etudiants", EtdSchema);
module.exports = EtdModel;
