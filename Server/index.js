const express = require("express");
const mongoose = require("mongoose");

const multer = require("multer");
const xlsx = require("xlsx");

const cors = require("cors");
const EtdModel = require("./models/etudiants");
const PModel = require("./models/presence");
const EnseigneModel = require("./models/enseigne");
const ProfModel = require("./models/Profs");

const process = require("process");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Welcome to my API"); // You can send any response you want here
});

// route to convertToEmbeddings a directory of images
app.post("/convertToEmbeddings", upload.array("images"), (req, res) => {
  //console.log(req.files);
  // res.send("Images uploaded successfully");
  var spawn = require("child_process").spawn;
  var processe = spawn("python", [
    process.env.EMBEDDING_SCRIPT_PATH,
    "C:/Users/TRETEC/Desktop/PFE/archive",
    process.env.DB_URL,
    process.env.RECOGNITION_MODEL_PATH,
    process.env.DETECTION_MODEL_PATH,
  ]);

  // Takes stdout data from script which executed
  // with arguments and send this data to res object
  processe.stdout.on("data", function (data) {
    console.log(data.toString());
  });
  processe.stderr.on("data", function (data) {
    console.log(data.toString());
  });
});

// Route for uploading Excel file
app.post("/upload", upload.single("file"), (req, res) => {
  // Parse the Excel file
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Map Excel columns to MongoDB fields
  const fieldMap = {
    palier: "palier",
    specialite: "specialite",
    section: "section",
    matricule: "MatriculeEtd",
    nom: "nom",
    prenom: "prenom",
    etat: "etat",
    groupe: "groupe",
  };

  const mappedData = data.map((row) => {
    const mappedRow = {};
    for (const [excelField, mongoField] of Object.entries(fieldMap)) {
      mappedRow[mongoField] = row[excelField];
    }
    return mappedRow;
  });
  //console.log(mappedData);
  try {
    EtdModel.insertMany(mappedData);
    EtdModel.updateMany({}, { $unset: { __v: 0 } });
    res.send("Data inserted succesfully");
  } catch (error) {
    console.log(err);
    res.status(500).send(`Failed ti insert data in mongoDB`);
  }
});

app.post("/postEtdsPresent", (req, res) => {
  const data = req.body;
  //console.log(data);
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

app.get("/getEtds/:IdCreneau/:MatriculeProf", async (req, res) => {
  const { IdCreneau, MatriculeProf } = req.params;
  try {
    const enseigne = await EnseigneModel.findOne({ IdCreneau, MatriculeProf });
    if (!enseigne) {
      return res.status(404).json({ message: "Enseigne not found" });
    }

    const { palier, specialite, section, groupe } = enseigne;
    etudiants = null;
    if (groupe == null) {
      etudiants = await EtdModel.find({
        palier: palier,
        specialite,
        specialite,
        section: section,
        //groupe: groupe,
      });
    } else {
      etudiants = await EtdModel.find({
        palier: palier,
        specialite,
        specialite,
        section: section,
        groupe: groupe,
      });
    }

    res.json(etudiants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Assuming you have already defined your Express app, Mongoose models, and middleware

app.get("/getEtdsPresent", async (req, res) => {
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
    //console.log(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
