const { MongoClient } = require('mongodb');
const fs = require('fs');

const dbPassword = process.env["MONGO_DB_ULTRON_PASSWORD"];
const dbName = "ultron";
const uri = `mongodb+srv://mac-dev:${dbPassword}@cluster0.i7jmt.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


let rawdata = fs.readFileSync('./mod-out.json');
let lines = JSON.parse(rawdata);

const parseOut = async () => {
  await Promise.all(lines.map(quoteObj => {
    quoteObj.src = "linusQuotes";
    quoteObj.category = quoteObj.category.replace(/\n/g, "");
  }));
  return lines;
}









const main = async () => {
  await client.connect();
  // let out = await parseOut();
  // fs.writeFileSync("./mod-out.json", JSON.stringify(out));
  const result = await client.db("ultron").collection("quotes").insertMany(lines, {
    ordered: false
  });
  await client.close();
}

const getRemainingSms = async () => {
  const result = await client.db("ultron").collection("metadata").findOne({ name: "remainingSms" });
  console.log(result);
}

const updateRemainingSms = async (newSms) => {
  const result = await client.db("ultron").collection("metadata").updateOne({ name: "remainingSms" }, { $set: { "value": newSms } });
  console.log(result);
}


main();
