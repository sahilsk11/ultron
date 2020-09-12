const { MongoClient } = require('mongodb');
require('dotenv').config();

class DBConnection {
  constructor(dbNames) {
    this.clients = {};
    const dbPassword = process.env["MONGO_DB_ULTRON_PASSWORD"];
    for (let dbName of dbNames) {
      const uri = `mongodb+srv://mac-dev:${dbPassword}@cluster0.i7jmt.mongodb.net/${dbName}?retryWrites=true&w=majority`;
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      this.clients[dbName] = client;
    }
  }

  async initClients() {
    for (let dbName in this.clients) {
      await this.clients[dbName].connect();
    }
  }

  getClient(dbName) {
    return this.clients[dbName];
  }

  async getCollection(dbName, collectionName) {
    return await this.clients[dbName].db(dbName).collection(collectionName);
  }

  async addToErrorLog(error) {
    const isProd = process.env.NODE_ENV === "production";
    if (isProd) {
      const collection = await this.getCollection("ultron", "errorProd");
      const result = await collection.insertOne(error);
    }
  }

  async isConnected(dbName) {
    const client = this.clients[dbName];
    return !!client && !!client.topology && client.topology.isConnected()
  }
}

module.exports = {
  DBConnection
}