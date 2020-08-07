const { Intent } = require("../intent.js");
const axios = require('axios');

class CloseShopIntent extends Intent {
  constructor({ transcript }) {
    // TO-DO edit regex, utterances, and name
    super({
      transcript,
      regex: "",
      utterances: ["close shop", "done for the day", "shut everything down"],
      intentName: "closeShopIntent"
    });
  }

  async execute() {
    const deathStarResponse = await this.controlLights({ roomName: "death star", commandName: "off" });
    const studyResponse = await this.controlLights({ roomName: "study", commandName: "off" });
    //const laptopSleepResponse = await this.sleepLaptop();

    const messages = [
      "See you later, sir.",
      "Very well sir.",
      "Powering down now"
    ];
    
    const message = this.getRandomPhrase(messages);
    return { code: 200, message, intent: this.intentName }
  }

  async sleepLaptop() {
    const apiKey = process.env.LAPTOP_KEY;
    const url = "http://localhost:8081/sleep?apiKey=" + apiKey; 
    return await axios.get(url);
  }

  async controlLights({ roomName, commandName }) {
    const apiKey = process.env.KAPUR_KEY;
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }
    const entity_id = "light." + roomName.replace(" ", "_");
    const data = { entity_id }
    //console.log(data)
    const url = "http://remote.kapurs.net:8123/api/services/light/turn_" + commandName;
    //console.log(url)
    const response = await axios.post(url, data, config);
    return response.status;
  }
}

module.exports.IntentClass = CloseShopIntent;