const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema({
  matricule: String,
  date: { type: Date, default: Date.now },
  creneau: {type:Number, default: 1},
});

const PModel = mongoose.model("presence", presenceSchema);

module.exports = PModel;
