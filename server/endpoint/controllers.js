const database = require("./models");
const { run } = require("../intentParser/intentParser");
const { exec } = require("child_process");
const axios = require('axios');

async function executeAction(transcript) {
  const mongoClient = await database.getClient();
  try {
    // this block may have errors from the intent that will be present when the function returns
    // however, critical errors should only be handled here (API call failed, service did not respond)
    // typical structure may include {code, intent, message}
    return await run({ transcript, mongoClient });
  } catch (error) {
    return { error };
  }
}

async function generateAudio(message) {
  message = message.replace(/"/g, '\\"');
  const fileName = generateFileName() + ".wav";
  const command = "./mimic --setf duration_stretch=0.9 -t \"" + message + "\" -o out/audio/" + fileName;
  let audioErr;
  return new Promise(resolve => {
    // TO-DO monitor the output of this and determine best way to handle
    exec(command, (err, stdout, stderr) => {
      console.log('AUDIO GEN ERR: ' + err);
      console.log('AUDIO GEN STDOUT: ' + stdout);
      console.log('AUDIO GEN STDERR: ' + stderr);
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
    const { success, quotaRemaining } = smsResponseData;
    if (success) {
      database.updateSmsQuota(quotaRemaining);
      return { error: null };
    } else {
      return { error: new Error(`Issue with sending SMS. Response from textbelt: ${JSON.stringify(smsResponseData)}`) };
    }
  } catch (err) {
    // This error does not return a stack trace. It only returns config. https://github.com/axios/axios/issues/1086
    let error;
    if (err.response) {
      // client received an error response (5xx, 4xx)
      error = new Error(`Client error in sendSms (controller.js) with POST to https://textbelt.com/text: ${err.toString()} (${err.code})`);
    } else if (err.request) {
      // client never received a response, or request never left
      error = new Error(`HTTP error in sendSms (controller.js) with POST to https://textbelt.com/text: ${err.toString()} (${err.code})`);
    } else {
      // anything else
      error = new Error(`Unknown request error in sendSms (controller.js) with POST to https://textbelt.com/text: ${err.toString()} (${err.code})`);
    }
    return { error };
  }
}

module.exports = {
  executeAction,
  sendSms,
  generateAudio
}