const fs = require('fs');

const loadIntentClasses = () => {
  const files = fs.readdirSync("./intentLibary/intents");
  const loadedClasses = [];
  for (file of files) {
    if (file[0] !== "." && file !== "sampleIntent.js") {
      const className = require("./intentLibary/intents/" + file);
      loadedClasses.push(className);
    }
  }
  return loadedClasses;
}

const loadedClasses = loadIntentClasses();

/**
 * Finds and executes the matching intent
 *  
 * @param {transcript <str>: the corrected transcript}
 * 
 * @return body to send back to client; typically {code, message, intent}
 */
const matchIntent = async ({ transcript, dbHandler, user }) => {
  const matchedIntents = [];
  await Promise.all(loadedClasses.map(className => {
    if (file[0] !== "." && file !== "sampleIntent.js") {
      const intentObj = new className.IntentClass({ transcript, dbHandler, user });
      if (intentObj.transcriptMatches()) {
        matchedIntents.push(intentObj);
      }
    }
  }));
  return matchedIntents;
}

module.exports = {
  matchIntent
}