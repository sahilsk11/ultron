const fs = require('fs');
const { serializeError, deserializeError } = require('serialize-error');
// const database = require("./models");

/**
 * @param { identity, transcript, response, responseErr, smsError, audioError } interactionProps 
 */
function logInteraction(interactionProps, dbHandler) {
  interactionProps = { ...interactionProps, date: new Date() }
  const errorInRequest = containsError(interactionProps);
  if (errorInRequest) {
    logError(interactionProps, dbHandler);
  }
  saveConversation(interactionProps.identity, interactionProps, dbHandler);
}

function containsError(interactionProps) {
  const {
    responseErr,
    smsError,
    audioError,
  } = interactionProps;
  return !(!smsError && !audioError && !responseErr);
}

function saveConversation(identity, log) {
  appendToFile(`conversations/${identity.device}.json`, log);
}

function logError(interactionProps, dbHandler) {
  const {
    responseErr,
    smsError,
    audioError,
  } = interactionProps;
  if (!!responseErr) {
    console.error(responseErr);
  }
  interactionProps.responseErr = serializeError(interactionProps.responseErr);
  interactionProps.smsError = serializeError(interactionProps.smsError);
  console.error("\n\n")
  dbHandler.addToErrorLog(interactionProps);
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