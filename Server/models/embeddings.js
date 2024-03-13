const mongoose = require("mongoose");

const EmbeddingsSchema = new mongoose.Schema({
  MatriculeEtd: String,
  embeddings: Array,
});

const EmbeddingsModel = mongoose.model("embeddings", EmbeddingsSchema);
module.exports = EmbeddingsModel;
