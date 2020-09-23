const fs = require('fs');

const loadIntentClasses = () => {
  const files = fs.readdirSync("./intentLibary/intents");
  const loadedClasses = {};
  for (file of files) {
    if (file[0] !== "." && file !== "sampleIntent.js") {
      const className = require("./intentLibary/intents/" + file);
      loadedClasses[file] = className;
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
  await Promise.all(Object.keys(loadedClasses).map(key => {
    const className = loadedClasses[key];
    if (file[0] !== "." && file !== "sampleIntent.js") {
      const intentObj = new className.IntentClass({ transcript, dbHandler, user });
      if (intentObj.transcriptMatches()) {
        matchedIntents.push(intentObj);
      }
    }
  }));
  if (matchedIntents.length == 0) {
    return useContext({ transcript, dbHandler, user });
  }
  return matchedIntents;
}

const useContext = ({ transcript, dbHandler, user }) => {
  return [new loadedClasses["addWorkoutSet.js"].IntentClass({transcript, dbHandler, user})];
}

module.exports = {
  matchIntent
}