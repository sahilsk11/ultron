const { MongoClient } = require('mongodb');
require('dotenv').config();

const dbPassword = process.env["MONGO_DB_ULTRON_PASSWORD"];
const dbName = "ultron";
const uri = `mongodb+srv://mac-dev:${dbPassword}@cluster0.i7jmt.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

function isConnected() {
  return !!client && !!client.topology && client.topology.isConnected()
}

async function getClient() {
  if (isConnected()) {
    return client;
  } else {
    return await client.connect();
  }
}

async function updateSmsQuota(remaining) {
  const dbClient = await getClient();
  const result = await dbClient.db("ultron").collection("metadata")
    .updateOne({ name: "remainingSms" }, { $set: { value: remaining } });
  //TO-DO log this entry
}

module.exports = {
  getClient,
  updateSmsQuota
}