const dream = require("./dream");
const speechEngine = require("./intentEngine");
const { exec } = require("child_process");
const ms = require('mediaserver');
const fs = require('fs')

const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
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
});

app.get("/setIntent", async (req, res) => {
  const transcript = speechEngine.correctTranscript({ transcript: req.query.transcript });
  const response = await speechEngine.intentEngine({ transcript }); // {code, intent, message}
  const fileName = generateFileName() + ".wav";
  const message = response.message.replace(/"/g, '\\"');
  console.log(message);
  const command = "./mimic -t \"" + message + "\" --setf duration_stretch=1.1 -o audio/" + fileName
  console.log(command);
  exec(command, (error, stdout, stderr) => {
    res.json({ ...response, fileName });
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`generated ${fileName} for ${response.intent}`);
  });
});

app.get('/audioFile', async function async(req, res) {
  const filename = req.query.fileName;
  let sent = false;
  let tries = 0;
  const attemptSend = async () => {
    while (!sent && tries++ < 50) {
      try {
        if (fs.existsSync("./audio/" + filename)) {
          sent = true;
          ms.pipe(req, res, "./audio/" + filename);
        }
      } catch (err) {
        console.error(err)
      }
      await sleep(100);
    }
  }
  await attemptSend();
  if (!sent) {
    console.error("Could not send audio file");
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateFileName() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRTUVWXYZ';
  let str = "";
  for (var i = 0; i < 10; i++) {
    const index = Math.floor(Math.random() * chars.length);
    str += chars.charAt(index);
  }
  return str;
}
