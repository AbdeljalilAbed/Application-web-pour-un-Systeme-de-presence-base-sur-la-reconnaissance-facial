const mongoose = require("mongoose");

const EnseigneSchema = new mongoose.Schema({
  MatriculeProf: String,
  section: String,
  groupe: String,
  module: String,
  IdCreneau: String,
  salle: String,
  palier: String,
  specialite: String,
});

const EnseigneModel = mongoose.model("enseignements", EnseigneSchema);
console.log(EnseigneModel.find());
module.exports = EnseigneModel;
