const express = require("express");
const app = express();
const { exec } = require("child_process");
require('dotenv').config();

app.listen(8081, '0.0.0.0', () => {
  console.log("Server running on port 8081");
});

app.use((req, res, next) => {
  const apiKey = process.env.LAPTOP_KEY;
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.query.apiKey === apiKey) {
    next();
  } else {
    res.json({ code: 403, message: "Forbidden" })
  }
});

app.get("/sleep", async (req, res) => {
  res.json({ message: "Sleeping in 5 s" });
  await sleep(5000);
  exec("pmset sleepnow", (error, stdout, stderr) => { });
});

const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); }