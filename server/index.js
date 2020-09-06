const express = require("express");
const app = express();
const { configureAuth } = require("./endpoint/middleware");
const controller = require("./endpoint/controllers");
const bodyParser = require("body-parser");
const logger = require("./endpoint/loggers");
const ms = require('mediaserver');
const fs = require('fs');

app.listen(8080, () => {
  console.log("Server running on port 8080");
})

//configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(configureAuth);

//define routes
app.get("/setIntent", async (req, res) => {
  const identity = req.identity;
  const transcript = req.query.transcript;
  let audioError;

  const actionResponse = await controller.executeAction(transcript);
  if (!!actionResponse.error) {
    res.json({ code: 400, message: "Sir, there was an error while executing the request." })
  } else {
    const cleanedMessage = actionResponse.message.replace(/"/g, '\\"');
    const audioResponse = await controller.generateAudio(cleanedMessage);
    audioError = audioResponse.error;
    res.json({ ...actionResponse, fileName: audioResponse.fileName });
  }
  logger.logInteraction({ transcript, identity, actionResponse, audioError });
});

app.get("/audioFile", async (req, res) => {
  const filename = req.query.fileName;
  let sent = false;
  let tries = 0;
  const attemptSend = async () => {
    while (!sent && tries++ < 50) {
      try {
        if (fs.existsSync("./out/audio/" + filename)) {
          sent = true;
          ms.pipe(req, res, "./out/audio/" + filename);
        }
      } catch (err) {
        console.error('audio error');
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

app.post("/handleSmsReply", async (req, res) => {
  // const number = req.body.fromNumber;
  const transcript = req.body.text;
  const identity = "text";
  let smsError;

  const actionResponse = await controller.executeAction(transcript);
  if (!actionResponse.error) {
    res.json({ success: true }); //non-descriptive message because it sends back to the SMS provider
    const message = actionResponse.message;
    const smsResponse = await controller.sendSms("+14088870718", message);
    smsError = smsResponse.error; //critical error - store stack trace
  } else {
    res.json({ success: false });
  }

  logger.logInteraction({ transcript, identity, actionResponse, smsError });
});