const mongoose = require("mongoose");

const ProfSchema = new mongoose.Schema({
  MatriculeProf: String,
  nom: String,
  prenom: String,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});
ProfSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};

const ProfModel = mongoose.model("profs", ProfSchema);
module.exports = ProfModel;
