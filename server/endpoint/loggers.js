const fs = require('fs');
const { serializeError, deserializeError } = require('serialize-error');
const database = require("./models");

/**
 * @param { identity, transcript, actionResponse, smsError, audioError } interactionProps 
 */
function logInteraction(interactionProps) {
  interactionProps = { ...interactionProps, date: new Date() }
  const errorInRequest = checkForErrors(interactionProps);
  if (errorInRequest) {
    logError(interactionProps);
  }
  saveConversation(interactionProps.identity, interactionProps);
}

function checkForErrors(interactionProps) {
  //consider checking for errors within actionResponse
  const {
    actionResponse,
    smsError,
    audioError,
  } = interactionProps;
  return !(!smsError && !audioError && !actionResponse.error);
}

function saveConversation(identity, log) {
  appendToFile(`conversations/${identity}.json`, log);
}

function logError(interactionProps) {
  interactionProps.actionResponse.error = serializeError(interactionProps.actionResponse.error);
  console.error(JSON.stringify(interactionProps));
  // appendToFile("error.json", interactionProps);
  database.addToErrorLog(interactionProps);
}

function appendToFile(filename, log) {
  const conversationFile = `out/${filename}`;
  try {
    conversationHistory = JSON.parse(fs.readFileSync(conversationFile, 'utf-8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      conversationHistory = [];
    } else {
      throw err;
    }
  }
  conversationHistory.push(log);
  fs.writeFileSync(conversationFile, JSON.stringify(conversationHistory));
}

module.exports = {
  logInteraction
};