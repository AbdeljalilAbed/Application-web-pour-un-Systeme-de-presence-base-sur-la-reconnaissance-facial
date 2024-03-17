const mongoose = require("mongoose");

const RaspberryPiSchema = new mongoose.Schema({
  salle: String,
  etat: Boolean,
  addressIp: String,
},{collection: 'rpi'});

const RaspberryPiModel = mongoose.model("rpi", RaspberryPiSchema);
module.exports = RaspberryPiModel;
