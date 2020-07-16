const dream = require("./dream");
const speechEngine = require("./speechEngine");

const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("hit")
  console.log(req.query);
  next();
});

app.get("/addDailyWeight", async (req, res) => {
  const transcript = req.query.transcript;
  console.log(req.params);
  if (!transcript) {
    res.json({ code: 422 });
    return;
  }
  const { weight, bmi, bodyFat, muscleMass, waterMass, boneMass } = speechEngine.addWeightIntent({ transcript });
  const response = await dream.addDailyWeightEntry({ weight, bmi, bodyFat, muscleMass, waterMass, boneMass });
  console.log({ weight, bmi, bodyFat, muscleMass, waterMass, boneMass })
  res.json({ code: 200 });
})