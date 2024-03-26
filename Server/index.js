const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
  res.send("Welcome to my API"); // You can send any response you want here
});

app.get("/getHistoryPresent/:date", async (req, res) => {
  const { date } = req.params;
  console.log(date);
  //const date = "02-04-2024";

  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10);
  console.log(number);

  try {
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

app.get("/getDatesByCreneau", async (req, res) => {
  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10); // 10 specifies the decimal radix

  console.log(number);

  try {
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

app.get("/historyEtds", async (req, res) => {
  // Retrieve selected options from query parameters
  const { palier, specialite, section, groupe, matricule } = req.query;
  console.log("Query Parameters:", req.query); // Log query parameters

  let etudiants = null; // Initialize etudiants variable
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
    console.log("Retrieved Etudiants:", etudiants); // Log retrieved etudiants
    res.json(etudiants);
  } catch (error) {
    console.error("Error retrieving etudiants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(400).send("Invalid username or password.");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword)
    return res.status(400).send("Invalid username or password.");

  const token = jwt.sign({ username: user.username }, "secretKey");

  res.send({ token, role: user.role, matricule: user.matricule });
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, matricule, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      matricule,
      role,
    });

    const savedUser = await user.save();
    res.json({
      message: "User registered successfully",
      userId: savedUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addProf", async (req, res) => {
  try {
    // Extract data from request body
    const { MatriculeProf, nom, prenom } = req.body;

    // Create a new professor instance
    const newProf = new Prof({ MatriculeProf, nom, prenom });

    // Save the new professor to the database
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

    // Remove the professor from the database
    await Prof.deleteOne({ MatriculeProf });

    res.status(200).json({ message: "Professor removed successfully" });
  } catch (error) {
    console.error("Error removing professor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.delete("/removeEtd/:MatriculeEtd", async (req, res) => {
  try {
    const { MatriculeEtd } = req.params;

    // Remove the professor from the database
    await EtdModel.deleteOne({ MatriculeEtd });

    res.status(200).json({ message: "Etudiant removed successfully" });
  } catch (error) {
    console.error("Error removing etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/addEtd", async (req, res) => {
  try {
    // Extract data from request body
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

    // Create a new professor instance
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

    // Save the new professor to the database
    await newEtd.save();

    res.status(201).json({ message: "Etudiant added successfully" });
  } catch (error) {
    console.error("Error adding etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/postEtdsPresent", (req, res) => {
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

app.delete("/deleteEtdFromHistory/:matricule/:date", (req, res) => {
  const { matricule, date } = req.params;
  console.log(date);

  const [day, month, year] = date.split("-").map(Number);
  const today = new Date(year, month - 1, day);

  today.setHours(1, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 (midnight)

  const tomorrow = new Date(today); // Create a copy of the current date
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 (midnight)

  // Set the date component to tomorrow

  console.log(today); // Output: Date object representing tomorrow's date
  console.log(tomorrow); // Output: Date object representing tomorrow's date

  PModel.deleteOne({
    matricule: matricule,
    date: { $gte: today, $lte: tomorrow },
  })
    .then(() => res.status(204).send())
    .catch((err) =>
      res.status(500).send(`Error deleting student data: ${err.message}`)
    );
});
app.delete("/deleteEtd/:matricule", (req, res) => {
  const { matricule } = req.params;
  const today = new Date(); // Get the current date and time
  today.setHours(1, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 (midnight)

  const tomorrow = new Date(today); // Create a copy of the current date
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 (midnight)

  // Set the date component to tomorrow

  console.log(today); // Output: Date object representing tomorrow's date
  console.log(tomorrow); // Output: Date object representing tomorrow's date

  PModel.deleteOne({
    matricule: matricule,
    date: { $gte: today, $lte: tomorrow },
  })
    .then(() => res.status(204).send())
    .catch((err) =>
      res.status(500).send(`Error deleting student data: ${err.message}`)
    );
});

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
        //groupe: groupe,
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
app.get("/getEtdsPresent", async (req, res) => {
  const today = new Date(); // Get the current date and time
  today.setHours(1, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 (midnight)

  const tomorrow = new Date(today); // Create a copy of the current date
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 (midnight)

  // Set the date component to tomorrow

  console.log(today); // Output: Date object representing tomorrow's date
  console.log(tomorrow); // Output: Date object representing tomorrow's date
  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10); // 10 specifies the decimal radix

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

app.get("/getEmbeddings/:IdCreneau/:MatriculeProf", (req, res) => {
  const { IdCreneau, MatriculeProf } = req.params;
  //If idCreneau and MatriculeProf are equal to all return all the embeddings
  if (IdCreneau === "all" && MatriculeProf === "all") {
    EmbeddingsModel.find()
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
            //groupe: groupe,
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

//get embeddings of students jdida
/* app.get("/getEmbeddings/:idSalle", (req, res) => {
  //get the current crenau
  const idCrenau = getIdCreneau();
  const idSalle = req.params.idSalle;

  if (idCrenau == -1) {
    return res.status(404).json({ message: "Hors des heures de cours" });
  }

  if (idSalle == "all") {
    EmbeddingsModel.find()
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
  } else {
    EnseigneModel.findOne({ idCrenau, idSalle })
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
            //groupe: groupe,
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
}); */
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

app.listen(3001, () => {
  console.log("Server is running");
});
