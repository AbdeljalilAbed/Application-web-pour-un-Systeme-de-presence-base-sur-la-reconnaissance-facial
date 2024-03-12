const mongoose = require("mongoose");

const ProfSchema = new mongoose.Schema({
  MatriculeProf: String,
  nom: String,
  prenom: String,
});

const ProfModel = mongoose.model("profs", ProfSchema);
module.exports = ProfModel;
