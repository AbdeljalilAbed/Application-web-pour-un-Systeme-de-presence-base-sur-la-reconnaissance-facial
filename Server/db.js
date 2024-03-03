const { MongoClient, ServerApiVersion } = require("mongodb");
const { UUID } = require("bson");
const { query } = require("express");
const { Query } = require("mongoose");

// Replace the placeholder with your Atlas connection string
const uri = "mongodb://localhost:27017";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

async function fetchdata(matricule) {
  try {
    const documents = new mongoose.Schema({
      MatriculeEtd: matricule,
      Date: new Date().toISOString().slice(0, 10), // Current date in YYYY-MM-DD format
    });

    const results = await presence.insertMany(documents);
    let ids = results.insertedIds;
    console.log(`${results.insertedCount} documents were inserted.`);
    for (let id of Object.values(ids)) {
      console.log(`Inserted a document with id ${id}`);
    }
    const query = {};
    const options = {
      projection: { _id: 1, MatriculeEtd: 0 },
    };

    // Execute query
    const cursor = await presence.find(query, options);
    // Print a message if no documents were found
    if ((await presence.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }
    // Print returned documents
    for await (const doc of cursor) {
      console.dir(doc);
    }
  } catch (e) {
    console.log(
      `A MongoBulkWriteException occurred, but there are successfully processed documents.`
    );
    let ids = e.result.result.insertedIds;
    for (let id of Object.values(ids)) {
      console.log(`Processed a document with id ${id._id}`);
    }
    console.log(`Number of documents inserted: ${e.result.result.nInserted}`);
  }
}
