const speechEngine = require("./intentEngine");
const { exec } = require("child_process");
const ms = require('mediaserver');
const fs = require('fs');
require('dotenv').config();
const bodyParser = require("body-parser");


const express = require("express");
const app = express();

app.listen(8080, () => {
  console.log("Server running on port 8080");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
  } else {
    const allowedOrigins = ["https://ultron.sh", "https://www.ultron.sh", "https://ultron.sahilkapur.com"];
    if (allowedOrigins.indexOf(req.headers.origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
  }
  res.setHeader('Access-Control-Allow-Headers', '*');
  const incomingRequestApiKey = req.query.api_key;
  const identity = idenitifyRequest(incomingRequestApiKey);

  if (!identity && req.path !== "/audioFile" && req.path !== "/handleSmsReply") {
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

app.get("/setIntent", async (req, res) => {
  const identity = req.identity;
  const transcript = speechEngine.correctTranscript({ transcript: req.query.transcript, identity });

  let response;
  try {
    response = await speechEngine.intentEngine({ transcript, identity }); // {code, intent, message}
  } catch (err) {
    console.error(err);
    addToConversation({ transcript, identity }, identity);
    return;
  }

  const message = response.message.replace(/"/g, '\\"');
  const { audioFileName, successfulAudio, audioError } = await generateAudio(message);

  res.json({ ...response, fileName: audioFileName });

  const conversationSummary = {
    timeStamp: new Date(),
    transcript,
    intent: response.intent,
    message,
    successfulAudio,
    audioFileName,
    audioError,
    continueConversation: response.continueConversation,
    identity
  }
  addToConversation(conversationSummary, identity);
});

/**
 * Logs and stores the conversation with the history from the device
 * 
 * @param conversationSummary JSON object of conversation
 */
function addToConversation(conversationSummary, identity) {
  console.log(conversationSummary);
  let conversationHistory;
  const conversationFile = "conversations/" + identity + ".json";
  try {
    conversationHistory = JSON.parse(fs.readFileSync(conversationFile, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      conversationHistory = [];
    } else {
      throw err;
    }
  }
  conversationHistory.push(conversationSummary);
  fs.writeFileSync(conversationFile, JSON.stringify(conversationHistory));
}

function generateAudio(message) {
  const audioFileName = generateFileName() + ".wav";
  const command = "./mimic -t \"" + message + "\" -o audio/" + audioFileName;
  return new Promise(resolve => {
    exec(command, (err, stdout, stderr) => {
      let successfulAudio = false;
      let audioError;
      if (err) {
        audioError = err;
      } else if (stderr && !stderr.includes("If audio works ignore")) {
        audioError = stderr;
      } else {
        successfulAudio = true;
      }
      resolve({ audioFileName, successfulAudio, audioError });
    })
  });
}

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
    console.error("Could not send audio file " + filename);
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

app.get('/watchResponseScreen', async (req, res) => {
  if (req.identity !== "watch") {
    res.json({ code: 403, message: "Invalid credentials" });
    return;
  }
  const command = req.query.command;
  const conversationHistory = JSON.parse(fs.readFileSync("conversations/watch.json", 'utf-8'));
  const lastInteraction = conversationHistory[conversationHistory.length - 1];
  const className = require("./intents/" + lastInteraction.intent);
  const intentObj = new className.IntentClass({ transcript: '' });
  console.log("Matched intent to " + intentObj.intentName);
  let response;
  if (command === "singleTap") {
    response = await intentObj.watchSingleTap();
  } else if (command === "doubleTap") {
    response = await intentObj.watchDoubleTap();
  } else if (command === "longTap") {
    response = await intentObj.watchLongTap();
  } else if (command === "swipe") {
    response = await intentObj.watchSwipe();
  }
  res.json(response);
  const conversation = {
    timeStamp: new Date(),
    command,
    intent: response.intent,
  };
  addToConversation(conversation, "watch");
})

app.get('/watchResponseLongTap', (req, res) => {
  if (req.identity !== "watch") {
    res.json({ code: 403, message: "Invalid credentials" });
    return;
  }
})

app.get('/watchResponseDoubleTap', (req, res) => {
  if (req.identity !== "watch") {
    res.json({ code: 403, message: "Invalid credentials" });
    return;
  }
})

app.get('/watchResponseSwipe', (req, res) => {
  if (req.identity !== "watch") {
    res.json({ code: 403, message: "Invalid credentials" });
    return;
  }
})

app.post('/handleSmsReply', async (req, res) => {
  const body = req.body;
  console.log(body);
  const number = body.fromNumber;
  let message;
  if (number == '+14088870718') {
    let identity = "text";
    const transcript = speechEngine.correctTranscript({ transcript: body.text });

    let response;
    try {
      response = await speechEngine.intentEngine({ transcript, identity }); // {code, intent, message}
    } catch (err) {
      console.error(err);
      addToConversation({ transcript, identity }, identity);
      return;
    }
    message = response.message;
    const conversationSummary = {
      timeStamp: new Date(),
      transcript,
      intent: response.intent,
      message,
      continueConversation: response.continueConversation,
      identity
    }
    addToConversation(conversationSummary, identity);
  } else {
    message = "Unauthenticated device";
  }
  axios.post('https://textbelt.com/text', {
    phone: number,
    message,
    key: process.env.TEXT_KEY,
    replyWebhookUrl: 'https://api.sahilkapur.com/handleSmsReply'
  }).then(response => {
    console.log(response.data);
  });
})