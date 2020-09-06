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
      database.updateSmsQuota(quotaRemaining);
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
  executeAction,
  sendSms,
  generateAudio
}