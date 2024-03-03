const mongoose = require("mongoose");

const EtdSchema = new mongoose.Schema({
  matricule: String,
  nom: String,
  prenom: String,
});

const EtdModel = mongoose.model("etudiants", EtdSchema);
module.exports = EtdModel;
