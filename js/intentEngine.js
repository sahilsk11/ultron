const dream = require("./dream");
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
  console.log(transcript);
  for (const file of files) {
    if (file !== ".DS_Store") {
      const className = require("./intents/" + file);
      const intentObj = new className.IntentClass({ transcript });
      if (intentObj.transcriptMatches()) {
        return await intentObj.execute();
      }
    }
  }
  return { code: 400, message: "Unknown Intent" }
}

module.exports = {
  correctTranscript,
  intentEngine,
}