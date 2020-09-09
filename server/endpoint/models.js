const { MongoClient } = require('mongodb');
require('dotenv').config();

const dbPassword = process.env["MONGO_DB_ULTRON_PASSWORD"];
const dbName = "ultron";
const uri = `mongodb+srv://mac-dev:${dbPassword}@cluster0.i7jmt.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(); // TO-DO: find a better way to handle connection

function isConnected() {
  return !!client && !!client.topology && client.topology.isConnected()
}

async function getClient() {
  if (isConnected()) {
    return client;
  } else {
    // console.log("waiting for client");
    // await client.connect();
    // console.log("client connected");
    // return client;
    return null;
  }
}

async function getCollection(collection) {
  const dbClient = await getClient();
  return dbClient.db("ultron").collection(collection);
}

async function updateSmsQuota(remaining) {
  const result = await getCollection("metadata").updateOne({ name: "remainingSms" }, { $set: { value: remaining } });
  confirmSuccessfulRequest(result);
}

async function addToErrorLog(error) {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    const collection = await getCollection("errorProd");
    const result = await collection.insertOne(error);
    confirmSuccessfulRequest(result);
  }
}

async function confirmSuccessfulRequest(result) {
  // TO-DO: handle errors when operating on DB
}

module.exports = {
  getClient,
  updateSmsQuota,
  addToErrorLog
}