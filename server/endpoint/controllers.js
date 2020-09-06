const { logInteraction } = require("./loggers");
const { run } = require("../intentParser/intentParser");
const { exec } = require("child_process");
const ms = require('mediaserver');
const fs = require('fs');
const axios = require('axios');


//functions for corresponding routes

async function setIntent(req, res) {
  const identity = req.identity;
  const transcript = req.query.transcript;
  let audioError;

  const actionResponse = await executeAction(transcript);
  if (!!actionResponse.error) {
    res.json({ code: 400, message: "Sir, there was an error while executing the request." })
  } else {
    const cleanedMessage = actionResponse.message.replace(/"/g, '\\"');
    const audioResponse = await generateAudio(cleanedMessage);
    audioError = audioResponse.error;
    res.json({ ...actionResponse, fileName: audioResponse.fileName });
  }
  logInteraction({ transcript, identity, actionResponse, audioError });
}

async function getAudioFile(req, res) {
  //To-do fix logging here
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
}


async function handleSmsReply(req, res) {
  // const number = req.body.fromNumber;
  const transcript = req.body.text;
  const identity = "text";
  let smsError;

  const actionResponse = await executeAction(transcript);
  if (!actionResponse.error) {
    res.json({ success: true }); //non-descriptive message because it sends back to the SMS provider
    const message = actionResponse.message;
    const smsResponse = await sendSms("+14088870718", message);
    smsError = smsResponse.error; //critical error - store stack trace
  } else {
    res.json({ success: false });
  }

  logInteraction({ transcript, identity, actionResponse, smsError });
}

// define controllers

async function executeAction(transcript) {
  try {
    // this block may have errors from the intent that will be present when the function returns
    // however, critical errors should only be handled here (API call failed, service did not respond)
    // typical structure may include {code, intent, message}
    return await run({ transcript });
  } catch (error) {
    console.error(error);
    return { error };
  }
}

async function generateAudio(message) {
  const fileName = generateFileName() + ".wav";
  const command = "./mimic --setf duration_stretch=0.9 -t \"" + message + "\" -o out/audio/" + fileName;
  return new Promise(resolve => {
    //var hrstart = process.hrtime()

    exec(command, (err, stdout, stderr) => {
      //let hrend = process.hrtime(hrstart)
      //console.info('Execution time (mimic): %ds %dms', hrend[0], hrend[1] / 1000000)

      let successfulAudio = false;
      let audioError;
      if (err) {
        audioError = err;
      } else if (stderr && !stderr.includes("If audio works ignore")) {
        audioError = stderr;
      } else {
        successfulAudio = true;
      }
      resolve({ fileName, audioError });
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

async function sendSms(number, message) {
  let smsResponseData;
  try {
    const smsResponse = await axios.post('https://textbelt.com/text', {
      phone: number,
      message,
      key: process.env.TEXT_KEY,
      replyWebhookUrl: 'https://api.sahilkapur.com/handleSmsReply'
    });
    smsResponseData = smsResponse.data
    const { success, quotaRemaining } = smsResponseData; //TO-DO store this somewhere
    if (success) {
      return { error: null };
    } else {
      return { error: new Error(`Issue with sending SMS. Response from textbelt: ${JSON.stringify(smsResponseData)}`) };
    }
  } catch (err) {
    // This error does not return a stack trace. It only returns config. https://github.com/axios/axios/issues/1086
    return { error: err };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  setIntent,
  getAudioFile,
  handleSmsReply
}