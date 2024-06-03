const mongoose = require("mongoose");
const getIdCreneau = require("../utils");

const presenceSchema = new mongoose.Schema({
  matricule: String,
  date: Date,
  creneau: { type: Number, default: getIdCreneau() },
});

const PresenceModel = mongoose.model("presences", presenceSchema);

module.exports = PresenceModel;
