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
    return await useContext({ transcript, dbHandler, user });
  }
  return matchedIntents;
}

const useContext = async ({ transcript, dbHandler, user }) => {
  const collection = await dbHandler.getCollection("ultron", "contexts");
  const result = await collection.find({ active: true }).toArray();
  const intents = [];
  for (let context of result) {
    intents.push(new loadedClasses[context.defaultIntent].IntentClass({ transcript, dbHandler, user }))
  }
  return intents;
}

module.exports = {
  matchIntent
}