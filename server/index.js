const express = require("express");
const app = express();
const { configureAuth } = require("./middleware");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const logger = require("./loggers");
const ms = require('mediaserver');
const fs = require('fs');
const intentEngine = require("./intentMatcher");
const { DBConnection } = require("./dbHandler");
const axios = require('axios');

//configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(configureAuth);

//configure databases
const dbHandler = new DBConnection(["ultron", "gym"]);

// ensures DB clients are initialized before serving
async function main() {
  await dbHandler.initClients();
  app.listen(8080, () => {
    console.log("Server running on port 8080");
  })
}
main();

//define routes
// app.get("/setIntent", async (req, res) => {
//   const identity = req.identity;
//   const transcript = req.query.transcript;
//   let fileName, audioErr;

//   let { response, responseErr } = await executeAction(transcript);
//   if (req.body.generateAudio != false) {
//     ({ fileName, audioErr } = await generateAudio(response.message));
//     response = { ...response, fileName };
//   }
//   console.log(response);
//   res.json(response);
//   logger.logInteraction({ transcript, identity, response, responseErr, audioErr }, dbHandler);
// });

app.post("/", async (req, res) => {
  const transcript = req.body.transcript || req.query.transcript;
  const { device, user } = req.identity;
  let fileName, audioErr;
  let { response, responseErr } = await executeAction(transcript, user);
  if (req.body.generateAudio != "false") {
    ({ fileName, audioErr } = await generateAudio(response.message));
    response = { ...response, fileName };
  }
  res.json(response);
  logger.logInteraction({ transcript, device, response, responseErr, audioErr }, dbHandler);
});

app.get("/audioFile", async (req, res) => {
  const filename = req.query.fileName;
  if (!filename) return; //could send a more appropriate response
  if (!fs.existsSync("./out/audio/" + filename)) {
    console.error("Could not send audio file " + filename);
  } else {
    ms.pipe(req, res, "./out/audio/" + filename);
  }
});

app.post("/handleSmsReply", async (req, res) => {
  // const number = req.body.fromNumber;
  const number = "+14088870718";
  const transcript = req.body.text;
  const identity = "text";
  let smsErr;
  const { response, responseErr } = await executeAction(transcript);
  try {
    const smsResponse = await axios.post('https://textbelt.com/text', {
      phone: number,
      message: response.message,
      key: process.env.TEXT_KEY,
      replyWebhookUrl: 'https://www.ultron.sh/server/handleSmsReply'
    });
    smsResponseData = smsResponse.data
    const { success, quotaRemaining } = smsResponseData;
    updateSmsQuota(quotaRemaining);
    if (!success) smsErr = smsResponse.data; // Not sure what this will return
  } catch (err) {
    console.error(err);
    smsErr = err;
  }
  res.json({});
  logger.logInteraction({ transcript, identity, response, responseErr, smsErr });
});


// define helper functions

async function executeAction(transcript, user) {
  if (transcript == undefined) {
    const e = new Error("Undefined transcript");
    e.ultronMessage = "I did not find a transcript, sir."
    throw e;
  }
  transcript = transcript.toLowerCase().replace(/-/g, " ");
  let response;
  let responseErr;
  try {
    const matchedIntents = await intentEngine.matchIntent({ transcript, dbHandler, user });
    if (matchedIntents.length == 1) {
      if (user === "sameer" && matchedIntents[0].authorizedForGuest === undefined ) {
        response = { code: 404, message: "I'm sorry Sameer, but you're not authorized for that command." }
      } else {
        response = await matchedIntents[0].execute();
      }
    } else if (matchedIntents.length == 0) {
      response = { code: 400, message: "Unknown Intent" };
    } else {
      const matchedIntentStr = handleIntentClash(matchedIntents);
      response = { code: 500, message: "Sir, I matched that request to " + matchedIntentStr + "." }
    }
  } catch (err) {
    let message = "Sir, there was an error while executing the request.";
    if (!!err.ultronMessage) {
      message = err.ultronMessage;
    }
    response = { code: 400, message };
    responseErr = err;
  }
  return { response, responseErr };
}

function handleIntentClash(matchedIntents) {
  let matchedIntentStr = '';
  for (let i = 0; i < matchedIntents.length; i++) {
    const name = matchedIntents[i].intentName.split(/(?=[A-Z])/).join(" ").toLowerCase();
    matchedIntentStr += name;
    if (matchedIntents.length > 2 && i != matchedIntents.length - 1) {
      matchedIntentStr += ", "
    } else if (i != matchedIntents.length - 1) {
      matchedIntentStr += " and ";
    }
  }
  return matchedIntentStr;
}

async function generateAudio(message) {
  message = message.replace(/"/g, '\\"');
  const fileName = generateFileName() + ".wav";
  const command = "./mimic --setf duration_stretch=0.9 -t \"" + message + "\" -o out/audio/" + fileName;
  let audioErr;
  return new Promise(resolve => {
    // TO-DO monitor the output of this and determine best way to handle
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("Audio Error");
        console.error(err);
        audioErr = err;
        fileName = undefined;
      }
      resolve({ fileName, audioErr });
    })
  });
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

async function updateSmsQuota(remaining) {
  const collection = await dbHandler.getCollection("ultron", "metadata");
  const result = await collection.updateOne({ name: "remainingSms" }, { $set: { value: remaining, date: new Date() } });
}