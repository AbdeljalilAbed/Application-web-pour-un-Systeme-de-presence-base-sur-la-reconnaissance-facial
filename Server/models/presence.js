const mongoose = require("mongoose");
const getIdCreneau = require("../utils");

const presenceSchema = new mongoose.Schema({
  matricule: String,
  date: { type: Date, default: Date.now },
  creneau: {type:Number, default: getIdCreneau()},
});

const PModel = mongoose.model("presence", presenceSchema);

module.exports = PModel;
