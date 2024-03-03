const mongoose = require("mongoose");

const PSchema = new mongoose.Schema({
  MatriculeEtd: String,
});

const PModel = mongoose.model("prsence", PSchema);
module.exports = PModel;
