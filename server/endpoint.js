const speechEngine = require("./intentEngine");
const { exec } = require("child_process");
const ms = require('mediaserver');
const fs = require('fs');
require('dotenv').config();

const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

app.use((req, res, next) => {
  const allowedOrigin = process.env.NODE_ENV === "production" ? "https://ultron.sahilkapur.com" : "http://localhost:3000";
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Headers', '*');
  const incomingRequestApiKey = req.query.api_key;
  const identity = idenitifyRequest(incomingRequestApiKey);

  if (!identity && req.path !== "/audioFile") {
    res.json({ code: 403, message: "Invalid credentials" });
  } else {
    req.identity = identity;
    next();
  }
});

/**
 * Determine the identity of the incoming request. Return the device,
 * or null/undefined if it is an unknown device
 * 
 * @param incomingApiKey  the api key from the incoming request
 */
function idenitifyRequest(incomingApiKey) {
  if (!incomingApiKey) return null;
  const keychain = JSON.parse(fs.readFileSync('keychain.json', 'utf-8'))
  return keychain[incomingApiKey];
}

/**
 * to-do
 * 
 * clean up logging, improve error handling, break up function
 */
app.get("/setIntent", async (req, res) => {
  console.log(new Date());
  console.log("\t" + req.identity);
  const identity = req.identity;
  const transcript = speechEngine.correctTranscript({ transcript: req.query.transcript, identity });
  console.log("\t" + transcript);
  const response = await speechEngine.intentEngine({ transcript, identity }); // {code, intent, message}
  const fileName = generateFileName() + ".wav";
  const message = response.message.replace(/"/g, '\\"');
  const command = "./mimic -t \"" + message + "\" -o audio/" + fileName;

  console.log("\t" + response.intent);
  console.log("\t" + message);
  console.log("\t" + fileName);
  exec(command, (error, stdout, stderr) => {
    res.json({ ...response, fileName });

    let successfulAudio = false;
    if (error) {
      console.error(`\terror: ${error.message}`);
    } else if (stderr && !stderr.includes("If audio works ignore")) {
      console.error(`\tstderr: '${stderr}'`);
    } else {
      console.log(`\tsucessfully generated audio`);
      successfulAudio = true;
    }
    const log = {
      timestamp: new Date(),
      transcript,
      intent: response.intent,
      message,
      successfulAudio,
      audioFileName: fileName,
      continueConversation: response.continueConversation
    }

    let conversation;
    const conversationFile = "conversations/" + identity + ".json";
    try {
      conversation = JSON.parse(fs.readFileSync(conversationFile, 'utf-8'));
    } catch (err) {
      if (err.code === 'ENOENT') {
        conversation = [];
      } else {
        throw err;
      }
    }
    conversation.push(log);
    fs.writeFileSync(conversationFile, JSON.stringify(conversation));
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
          console.log("\tfile " + filename + " sent");
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
