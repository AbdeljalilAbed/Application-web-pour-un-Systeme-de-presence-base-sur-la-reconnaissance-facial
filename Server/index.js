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
  const newEtd = new PModel(data);
  newEtd
    .save()
    .then(() => res.status(201).send("Student data added successfully"))
    .catch((err) =>
      res.status(500).send(`Error adding student data: ${err.message}`)
    );
});

app.delete("/deleteEtd/:matricule", (req, res) => {
  const { matricule } = req.params;
  PModel.deleteOne({ matricule: matricule })
    .then(() => res.status(204).send())
    .catch((err) =>
      res.status(500).send(`Error deleting student data: ${err.message}`)
    );
});

app.get("/getEtds", (req, res) => {
  EtdModel.find()
    .then((Etds) => res.json(Etds))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/getP", (req, res) => {
  PModel.find()
    .then((Etds) => res.json(Etds))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Assuming you have already defined your Express app, Mongoose models, and middleware

app.get("/getAggregatedData", async (req, res) => {
  try {
    const result = await PModel.aggregate([
      {
        $lookup: {
          from: "etudiants",
          localField: "matricule",
          foreignField: "MatriculeEtd",
          as: "etudiant",
        },
      },
      {
        $unwind: "$etudiant",
      },
      {
        $project: {
          _id: 0,
          MatriculeEtd: "$matricule",
          nom: "$etudiant.nom",
          prenom: "$etudiant.prenom",
        },
      },
    ]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.get("/getGroupedDataForGroup2", async (req, res) => {
  try {
    const result = await EtdModel.aggregate([
      {
        $lookup: {
          from: "etudiants",
          localField: "matricule",
          foreignField: "MatriculeEtd",
          as: "etudiant",
        },
      },
      {
        $unwind: {
          path: "$etudiant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          groupe: "2",
        },
      },
      {
        $project: {
          _id: 0,
          MatriculeEtd: 1,
          nom: 1,
          prenom: 1,
        },
      },
    ]);

    res.json(result);
    console.log(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
