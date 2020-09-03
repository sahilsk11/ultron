const { Intent } = require("../intent.js");
const axios = require('axios');

class CloseShopIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["close shop", "done for the day", "shut everything down", "shut down the study", "wrap up here"],
      intentName: "closeShopIntent"
    });
  }

  async execute() {
    const deathStarPromise = this.controlLights({ roomName: "death star", commandName: "off" });
    const studyPromise = this.controlLights({ roomName: "study", commandName: "off" });
    const responses = await Promise.all([deathStarPromise, studyPromise]);

    const deathStarResponse = responses[0];
    const studyResponse = responses[1];

    const responseCodes = {
      deathStarResponse,
      studyResponse
    }

    let message;
    const { code, errorMessage } = this.verifyResponses(responseCodes);

    if (code === 200) {
      const messages = [
        "See you later, sir.",
        "Very well sir.",
        "Powering the study down now."
      ];
      message = this.getRandomPhrase(messages);
    } else {
      message = "Sir, there was an error in the request.";
    }

    return { code, message, intent: this.intentName, errorMessage };
  }

  verifyResponses(responseCodes) {
    for (const endpointName in responseCodes) {
      if (responseCodes[endpointName] !== 200) {
        return responseCodes[endpointName];
      }
    }
    return { code: 200, message: "" };
  }

  async sleepLaptop() {
    const apiKey = this.getApiKey("LAPTOP_KEY");
    const url = "http://localhost:8081/sleep?apiKey=" + apiKey;
    return await axios.get(url);
  }

  async controlLights({ roomName, commandName }) {
    const apiKey = this.getApiKey("KAPUR_KEY");
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 1000
    }
    const entity_id = "light." + roomName.replace(" ", "_");
    const data = { entity_id }
    const url = "http://remote.kapurs.net:8123/api/services/light/turn_" + commandName;

    let code;
    let message;
    try {
      const response = await axios.post(url, data, config);
      if (response.status === 200 && response.data !== undefined && response.data.length !== 0) {
        code = 200;
      } else {
        code = 400;
        if (!response.data) message = "response from " + roomName + " lights endpoint is undefined";
        if (response.data.length === 0) message = "response from " + roomName + " lights endpoint is empty";
      }
    } catch (err) {
      console.error("\t" + err.message + " for url " + url);
      code = 500;
      message = err.message + " for " + roomName + " lights endpoint.";
    }
    return { code, errorMessage: message };
  }
}

module.exports.IntentClass = CloseShopIntent;