const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EtdModel = require("./models/etudiants");
const PModel = require("./models/presence");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Welcome to my API"); // You can send any response you want here
});

app.post("/postEtds", (req, res) => {
  const data = req.body;
  console.log(data);
  /*   const newEtd = new EtdModel(data);
  newEtd
    .save()
    .then(() => res.status(201).send("Student data added successfully"))
    .catch((err) =>
      res.status(500).send(`Error adding student data: ${err.message}`)
    );
 */
});

app.get("/getEtds", (req, res) => {
  EtdModel.find()
    .then((Etds) => res.json(Etds))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.listen(3001, () => {
  console.log("Server is running");
});
