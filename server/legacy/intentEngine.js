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
const intentEngine = async ({ transcript }) => {
  const files = fs.readdirSync("./intents");
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
  if (clearIntent) {
    return await clearIntent.execute();
  }
  if (matchedIntents.length === 1) {
    return await matchedIntents[0].execute();
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
  correctTranscript,
  intentEngine,
}