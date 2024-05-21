const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { spawn } = require("child_process");
require("dotenv").config();

const multer = require("multer");
const xlsx = require("xlsx");

const cors = require("cors");
const EtdModel = require("./models/etudiants");
const PModel = require("./models/presence");
const EnseigneModel = require("./models/enseigne");
const User = require("./models/user");
const EmbeddingsModel = require("./models/embeddings");
const Prof = require("./models/Profs");
const PresenceModel = require("./models/presenceHistory");

const process = require("process");
const getIdCreneau = require("./utils");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

mongoose.connect(process.env.DB_URL + "/mydb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

const imageUploadPath =
  "C:/Users/TRETEC/Desktop/WebappV2/webapp/Server/archive";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const imageUpload = multer({ storage: storage });

// Remove the res.send() inside the /images-upload route
app.post("/images-upload", imageUpload.array("images"), (req, res) => {
  // Handle the uploaded files
  if (req.files.length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const uploadedFiles = req.files.map((file) => file.filename);
  /*   res.send(
    `Uploaded ${uploadedFiles.length} files: ${uploadedFiles.join(", ")}`
  );
 */
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", [
    "arrayFromImages.py",
    process.env.IMG_PATH,
    process.env.DB_URL,
    process.env.DETECTION_MODEL_PATH,
    process.env.RECOGNITION_MODEL_PATH,
  ]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend);
  });
});

app.post("/edt-upload", upload.single("file"), (req, res) => {
  const palier = req.body.palier;
  const specialite = req.body.specialite;
  const section = req.body.section;

  let dataToSend;

  // Spawn a new child process to call the Python script
  const python = spawn("python", [
    "ExcelToEdt.py",
    req.file.path,
    section,
    palier,
    specialite,
  ]);

  // Collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });

  // In close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`Child process close all stdio with code ${code}`);
    // Send data to browser
    res.send(dataToSend);
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

//LOGIN ENDPOINT
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username == "admin") {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const Admin = new Prof({
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ username: Admin.username }, "secretKey");

    Admin.role = "admin";
    res.send({ token, role: Admin.role, matricule: Admin.matricule });
  } else {
    const user = await Prof.findOne({ username });

    if (!user) return res.status(400).send("Invalid username or password.");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).send("Invalid username or password.");

    const token = jwt.sign({ username: user.username }, "secretKey");

    user.role = "prof";
    res.send({ token, role: user.role, matricule: user.matricule });
  }
});

//GET DEFAULT LIST ETUDIANTS WITH CURRENT CRENEAU AND USERNAME
app.get("/getEtds/:username", async (req, res) => {
  const { username } = req.params;
  console.log(username);

  const user = await User.findOne({ username: username.toString() });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const MatriculeProf = user.matricule;
  console.log(MatriculeProf);

  try {
    const IdCreneau = getIdCreneau();
    console.log(IdCreneau);
    const enseigne = await EnseigneModel.findOne({ IdCreneau, MatriculeProf });
    if (!enseigne) {
      return res.status(404).json({ message: "Enseigne not found" });
    }

    const { palier, specialite, section, groupe } = enseigne;
    console.log(palier, specialite, section, groupe);
    etudiants = null;
    if (groupe == null) {
      etudiants = await EtdModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
      });
    } else {
      etudiants = await EtdModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
        groupe: groupe,
      });
    }
    console.log(etudiants);
    res.json(etudiants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
//GET DEFAULT LIST ETUDIANTS WITH CURRENT CRENEAU AND USERNAME
app.get("/getEnseignants", async (req, res) => {
  try {
    Enseignants = await Prof.find();

    res.json(Enseignants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
//GET DEFAULT LIST ETUDIANTS WITH CURRENT CRENEAU AND USERNAME
app.get("/getEtudiants", async (req, res) => {
  const { palier, specialite, section, groupe, matricule } = req.query;
  console.log(req.query);
  let Etudiants = null;

  try {
    if (matricule) {
      Etudiants = await EtdModel.findOne({ MatriculeEtd: matricule });
    } else if (groupe !== undefined && groupe !== null && groupe !== "") {
      Etudiants = await EtdModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
        groupe: groupe,
      });
    } else {
      Etudiants = await EtdModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
      });
    }
    res.json(Etudiants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
//GET DEFAULT LIST ETUDIANTS WITH CURRENT CRENEAU AND USERNAME
app.get("/getEmploiDuTemps", async (req, res) => {
  const { palier, specialite, section, groupe } = req.query;
  console.log(req.query);
  let Edts = null;

  try {
    if (groupe !== undefined && groupe !== null && groupe !== "") {
      Edts = await EnseigneModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
        groupe: groupe,
      });
    } else {
      Edts = await EnseigneModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
      });
    }
    console.log(Edts);
    res.json(Edts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET LIST OF ATTENDANCE OF CURRENT CRENEAU
app.get("/getEtdsPresent", async (req, res) => {
  const today = new Date();
  today.setHours(1, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0);

  console.log(today);
  console.log(tomorrow);
  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10);
  console.log(number);

  try {
    const result = await PModel.aggregate([
      {
        $match: {
          date: { $gte: today, $lte: tomorrow },
          creneau: number,
        },
      },
      {
        $project: {
          matricule: 1,
          date: 1,
          creneau: 1,
        },
      },
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

//GET LIST ETUDIANTS FOR HISTORY OF ATTENDANCE
app.get("/historyEtds", async (req, res) => {
  const { palier, specialite, section, groupe, matricule } = req.query;
  console.log("Query Parameters:", req.query);

  let etudiants = null;
  try {
    if (matricule) {
      etudiants = await EtdModel.findOne({ MatriculeEtd: matricule });
    } else if (groupe !== undefined && groupe !== null && groupe !== "") {
      etudiants = await EtdModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
        groupe: groupe,
      });
    } else {
      etudiants = await EtdModel.find({
        palier: palier,
        specialite: specialite,
        section: section,
      });
    }
    console.log("Retrieved Etudiants:", etudiants);
    res.json(etudiants);
  } catch (error) {
    console.error("Error retrieving etudiants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//GET DATES OF ATTENDANCES
app.get("/getDatesByCreneau/:username", async (req, res) => {
  const { username } = req.params;
  console.log(username);

  const { palier, specialite, section, module, groupe } = req.query;

  try {
    const user = await User.findOne({ username: username.toString() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const MatriculeProf = user.matricule;
    console.log(MatriculeProf);

    const creneau = await EnseigneModel.aggregate([
      {
        $match: {
          MatriculeProf: MatriculeProf,
          section: section,
          module: module,
          palier: palier,
          specialite: specialite,
        },
      },
      {
        $project: {
          _id: 0,
          IdCreneau: 1,
        },
      },
    ]);

    const currentCreneau = creneau[0].IdCreneau;
    console.log(currentCreneau);
    const number = parseInt(currentCreneau, 10);

    const dates = await PModel.aggregate([
      {
        $match: { creneau: number },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d-%m-%Y", date: "$date" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
        },
      },
    ]);

    console.log(dates);
    res.json(dates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET HISTORY OF ATTENDANCE BY DATES
app.get("/getHistoryPresent/:date/:username", async (req, res) => {
  const { username } = req.params;
  console.log(username);

  const { date } = req.params;
  const { palier, specialite, section, module } = req.query;

  try {
    const user = await User.findOne({ username: username.toString() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const MatriculeProf = user.matricule;
    console.log(MatriculeProf);
    const creneau = await EnseigneModel.aggregate([
      {
        $match: {
          MatriculeProf: MatriculeProf,
          section: section,
          module: module,
          palier: palier,
          specialite: specialite,
        },
      },
      {
        $project: {
          _id: 0,
          IdCreneau: 1,
        },
      },
    ]);

    const currentCreneau = creneau[0].IdCreneau;
    console.log(currentCreneau);
    const number = parseInt(currentCreneau, 10);

    const result = await PModel.aggregate([
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$date",
            },
          },
        },
      },
      { $match: { formattedDate: date } },
      {
        $project: {
          _id: 0,
          matricule: 1,
          date: 1,
          creneau: 1,
        },
      },
      {
        $lookup: {
          from: "etudiants",
          localField: "matricule",
          foreignField: "MatriculeEtd",
          as: "etudiant",
        },
      },
      { $unwind: { path: "$etudiant" } },
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

//ADD PRESENCE OF AN ETUDIANT
app.post("/postEtdsPresent", (req, res) => {
  const data = req.body;
  const newEtd = new PModel(data);
  newEtd
    .save()
    .then(() => res.status(201).send("Student data added successfully"))
    .catch((err) =>
      res.status(500).send(`Error adding student data: ${err.message}`)
    );
});

//DELETE PRESENCE OF AN ETUDIANT
app.delete("/deleteEtd/:matricule", (req, res) => {
  const { matricule } = req.params;
  const today = new Date();
  today.setHours(1, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0);

  console.log(today);
  console.log(tomorrow);

  PModel.deleteOne({
    matricule: matricule,
    date: { $gte: today, $lte: tomorrow },
  })
    .then(() => res.status(204).send())
    .catch((err) =>
      res.status(500).send(`Error deleting student data: ${err.message}`)
    );
});

//ADD PRESENCE FROM HISTORY
app.post("/postEtdsPresentFromHistory", (req, res) => {
  const data = req.body;
  //console.log(data);
  const newEtd = new PresenceModel(data);
  newEtd
    .save()
    .then(() => res.status(201).send("Student data added successfully"))
    .catch((err) =>
      res.status(500).send(`Error adding student data: ${err.message}`)
    );
});

//DELETE PRESENCE FROM HISTORY
app.delete("/deleteEtdFromHistory/:matricule/:date", (req, res) => {
  const { matricule, date } = req.params;
  console.log(date);

  const [day, month, year] = date.split("-").map(Number);
  const today = new Date(year, month - 1, day);

  today.setHours(1, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0);

  console.log(today);
  console.log(tomorrow);

  PModel.deleteOne({
    matricule: matricule,
    date: { $gte: today, $lte: tomorrow },
  })
    .then(() => res.status(204).send())
    .catch((err) =>
      res.status(500).send(`Error deleting student data: ${err.message}`)
    );
});
app.put("/modifierEnseignant/:matricule", async (req, res) => {
  try {
    const oldMatricule = req.params.matricule;
    const { MatriculeProf, nom, prenom, username, password } = req.body;

    const existingProf = await Prof.findOne({ MatriculeProf: oldMatricule });
    if (!existingProf) {
      return res.status(404).json({ error: "Professor not found." });
    }

    if (MatriculeProf && MatriculeProf !== oldMatricule) {
      const existingMatricule = await Prof.findOne({ MatriculeProf });
      if (existingMatricule) {
        return res.status(400).json({ error: "Matricule already exists." });
      }
      existingProf.MatriculeProf = MatriculeProf;
    }

    if (username && username !== existingProf.username) {
      const existingUsername = await Prof.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: "Username already exists." });
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      existingProf.password = hashedPassword;
    }

    existingProf.nom = nom || existingProf.nom;
    existingProf.prenom = prenom || existingProf.prenom;
    existingProf.username = username || existingProf.username;

    await existingProf.save();

    res.status(200).json({ message: "Professor updated successfully" });
  } catch (error) {
    console.error("Error updating professor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/addProf", async (req, res) => {
  try {
    const { MatriculeProf, nom, prenom, username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUsername = await Prof.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const newProf = new Prof({
      MatriculeProf,
      nom,
      prenom,
      username,
      password: hashedPassword,
    });

    await newProf.save();

    res.status(201).json({ message: "Professor added successfully" });
  } catch (error) {
    console.error("Error adding professor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/removeProf/:MatriculeProf", async (req, res) => {
  try {
    const { MatriculeProf } = req.params;

    await Prof.deleteOne({ MatriculeProf });

    res.status(200).json({ message: "Professor removed successfully" });
  } catch (error) {
    console.error("Error removing professor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/addEtd", async (req, res) => {
  try {
    const {
      palier,
      specialite,
      section,
      MatriculeEtd,
      nom,
      prenom,
      etat,
      groupe,
    } = req.body;

    const newEtd = new EtdModel({
      palier,
      specialite,
      section,
      MatriculeEtd,
      nom,
      prenom,
      etat,
      groupe,
    });

    await newEtd.save();

    res.status(201).json({ message: "Etudiant added successfully" });
  } catch (error) {
    console.error("Error adding etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/removeEtd/:MatriculeEtd", async (req, res) => {
  try {
    const { MatriculeEtd } = req.params;

    await EtdModel.deleteOne({ MatriculeEtd });

    res.status(200).json({ message: "Etudiant removed successfully" });
  } catch (error) {
    console.error("Error removing etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/removeEdt/:palier/:specialite/:section", async (req, res) => {
  try {
    const { palier, specialite, section } = req.params;
    console.log(palier);

    await EnseigneModel.deleteMany({ palier, specialite, section });

    res.status(200).json({ message: "Emploi du temps removed successfully" });
  } catch (error) {
    console.error("Error removing edt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/modifierEtudiant/:MatriculeEtd", async (req, res) => {
  try {
    const { MatriculeEtd } = req.params;
    const updateData = req.body;

    const updatedEtudiant = await EtdModel.findOneAndUpdate(
      { MatriculeEtd },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEtudiant) {
      return res.status(404).json({ error: "Etudiant not found" });
    }

    res
      .status(200)
      .json({ message: "Etudiant updated successfully", updatedEtudiant });
  } catch (error) {
    console.error("Error updating etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/addEdt", async (req, res) => {
  try {
    const {
      palier,
      specialite,
      section,
      MatriculeProf,
      salle,
      module,
      IdCreneau,
      groupe,
    } = req.body;

    const newEnseigne = new EnseigneModel({
      palier,
      specialite,
      section,
      MatriculeProf,
      salle,
      module,
      IdCreneau,
      groupe,
    });

    await newEnseigne.save();

    res.status(201).json({ message: "Edt added successfully" });
  } catch (error) {
    console.error("Error adding etd:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/removeImages/:MatriculeEtd", async (req, res) => {
  try {
    const { MatriculeEtd } = req.params;

    await EmbeddingsModel.deleteMany({ MatriculeEtd });

    res.status(200).json({ message: "Embeddings removed successfully" });
  } catch (error) {
    console.error("Error Embeddings etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/removeCreneau/:MatriculeProf/:IdCreneau", async (req, res) => {
  try {
    const { MatriculeProf, IdCreneau } = req.params;

    await EnseigneModel.deleteMany({ MatriculeProf, IdCreneau });

    res.status(200).json({ message: "Creneau removed successfully" });
  } catch (error) {
    console.error("Error Creneau etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/modifierEdt/:MatriculeProf/:IdCreneau", async (req, res) => {
  try {
    const { MatriculeProf, IdCreneau } = req.params;
    const updateData = req.body;

    const updatedEdt = await EnseigneModel.findOneAndUpdate(
      { MatriculeProf, IdCreneau },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEdt) {
      return res.status(404).json({ error: "Edt not found" });
    }

    res.status(200).json({ message: "Edt updated successfully", updatedEdt });
  } catch (error) {
    console.error("Error updating Edt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/convertToEmbeddings", upload.array("images"), (req, res) => {
  var spawn = require("child_process").spawn;
  var processe = spawn("python", [
    process.env.EMBEDDING_SCRIPT_PATH,
    "C:/Users/TRETEC/Desktop/PFE/archive",
    process.env.DB_URL,
    process.env.RECOGNITION_MODEL_PATH,
    process.env.DETECTION_MODEL_PATH,
  ]);

  processe.stdout.on("data", function (data) {
    console.log(data.toString());
  });
  processe.stderr.on("data", function (data) {
    console.log(data.toString());
  });
});

app.get("/getEmbeddings/:IdCreneau/:MatriculeProf", (req, res) => {
  const { IdCreneau, MatriculeProf } = req.params;
  if (IdCreneau === "all" && MatriculeProf === "all") {
    EmbeddingsModel.find()
      .then((embeddings) => {
        const result = embeddings.reduce((acc, cur) => {
          acc[cur.MatriculeEtd] = cur.embedding;
          return acc;
        }, {});
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    EnseigneModel.findOne({ IdCreneau, MatriculeProf })
      .then((enseigne) => {
        if (!enseigne) {
          return res.status(404).json({ message: "Enseigne not found" });
        }

        const { palier, specialite, section, groupe } = enseigne;
        if (groupe == null) {
          etudiants = EtdModel.find({
            palier: palier,
            specialite,
            specialite,
            section: section,
          })
            .then((etudiants) => {
              const matricules = etudiants.map(
                (etudiant) => etudiant.MatriculeEtd
              );
              EmbeddingsModel.find({ MatriculeEtd: { $in: matricules } })
                .then((embeddings) => {
                  const result = embeddings.reduce((acc, cur) => {
                    acc[cur.MatriculeEtd] = cur.embedding;
                    return acc;
                  }, {});
                  res.json(result);
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).json({ message: "Internal server error" });
                });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: "Internal server error" });
            });
        } else {
          etudiants = EtdModel.find({
            palier: palier,
            specialite,
            specialite,
            section: section,
            groupe: groupe,
          })
            .then((etudiants) => {
              const matricules = etudiants.map(
                (etudiant) => etudiant.MatriculeEtd
              );
              EmbeddingsModel.find({ MatriculeEtd: { $in: matricules } })
                .then((embeddings) => {
                  //make the response a json object with the matricule as the key and the embeddings as the value
                  const result = embeddings.reduce((acc, cur) => {
                    acc[cur.MatriculeEtd] = cur.embedding;
                    return acc;
                  }, {});
                  res.json(result);
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).json({ message: "Internal server error" });
                });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ message: "Internal server error" });
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      });
  }
});

app.delete("/deleteEmbedding/:MatriculeEtd", async (req, res) => {
  const { MatriculeEtd } = req.params;

  try {
    // Find and delete the embedding for the given MatriculeEtd
    const result = await EmbeddingsModel.findOneAndDelete({ MatriculeEtd });

    if (result) {
      res.status(200).json({ message: "Embedding deleted successfully" });
    } else {
      res.status(404).json({ message: "Embedding not found" });
    }
  } catch (error) {
    console.error("Error deleting embedding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running");
});
