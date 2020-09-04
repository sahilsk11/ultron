const fs = require('fs');

/**
 * Convert raw string input to corrected text based on known errors in STT
 * @param {transcript: str} 
 */
const correctTranscript = ({ transcript }) => {
  return transcript.toLowerCase();
}

/**
 * Finds and executes the matching intent
 *  
 * @param {transcript <str>: the corrected transcript}
 * 
 * @return body to send back to client; typically {code, message, intent}
 */
const run = async ({ transcript }) => {
  //var hrstart = process.hrtime()
  transcript = correctTranscript({ transcript });
  const files = fs.readdirSync("./intentParser/intents");
  const matchedIntents = [];
  let clearIntent = false;
  await Promise.all(files.map(file => {
    if (file !== ".DS_Store" && file !== "sampleIntent.js") {
      const className = require("./intents/" + file);
      const intentObj = new className.IntentClass({ transcript });
      if (intentObj.transcriptMatches()) {
        if (intentObj.intentName == "clearIntent") {
          clearIntent = intentObj;
        }
        matchedIntents.push(intentObj);
      }
    }
  }));
  //let hrend = process.hrtime(hrstart)
  //console.info('Execution time (intent matching): %ds %dms', hrend[0], hrend[1] / 1000000)
  if (clearIntent) {
    return await clearIntent.execute();
  }
  if (matchedIntents.length === 1) {
    //hrstart = process.hrtime()
    const r = await matchedIntents[0].execute();
    //hrend = process.hrtime(hrstart)
    // console.info('Execution time (execute): %ds %dms', hrend[0], hrend[1] / 1000000)
    return r;
  } else if (matchedIntents.length > 1) {
    const matchedIntentsStr = matchedIntentsToString(matchedIntents);
    return { code: 500, message: "Sir, I matched that request to multiple intents. " + matchedIntentsStr };
  } else {
    return { code: 400, message: "Unknown Intent" }
  }
}

const matchedIntentsToString = (matchedIntents) => {
  let message = "Did you mean ";
  for (let i = 0; i < matchedIntents.length; i++) {
    message += matchedIntents[i].intentName.split(/(?=[A-Z])/).join(" ").toLowerCase();

    if (i === matchedIntents.length - 2) {
      message += " or ";
    } else if (i === matchedIntents.length - 1) {
      message += "?";
    } else {
      message += ", ";
    }
  }
  return message;
}

module.exports = {
  run
}