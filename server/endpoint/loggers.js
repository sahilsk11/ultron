function logInteraction(interactionProps) {
  const {
    transcript,
    identity,
    actionResponse,
    smsError,
    audioError,
  } = interactionProps;
  const errorInRequest = checkForErrors(interactionProps);
  if (errorInRequest) {
    logError(interactionProps);
  } else {
    //save to conversation history
  }
}

function checkForErrors(interactionProps) {
  const {
    actionResponse,
    smsError,
    audioError,
  } = interactionProps;
  return !(!smsError && !audioError && !actionResponse.error);
}

function logError(interactionProps) {
  console.error({ ...interactionProps, date: new Date() });
}

module.exports = {
  logInteraction
};