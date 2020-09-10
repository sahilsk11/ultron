const { MongoClient } = require('mongodb');
require('dotenv').config();

class DBConnection {
  constructor(dbNames) {
    this.clients = {};
    const dbPassword = process.env["MONGO_DB_ULTRON_PASSWORD"];
    Promise.all(dbNames.map(async dbName => {
      const uri = `mongodb+srv://mac-dev:${dbPassword}@cluster0.i7jmt.mongodb.net/${dbName}?retryWrites=true&w=majority`;
      const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      client.connect();
      this.clients[dbName] = client;
    }));
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
      const collection = await getCollection("ultron", "errorProd");
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