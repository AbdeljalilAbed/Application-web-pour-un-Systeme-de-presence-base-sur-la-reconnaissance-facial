const mongoose = require("mongoose");

const ESchema = new mongoose.Schema({
  matriculeProf: String,
  Idcreneau: String,
  section: String,
  groupe: String,
  module: String,
  salle: String,
});

const EModel = mongoose.model("enseigne", ESchema);
module.exports = EModel;
