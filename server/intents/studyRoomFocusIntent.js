const { Intent } = require("../intent.js");
const axios = require('axios');

class StudyRoomFocusIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["focus mode", "dim "],
      intentName: "studyRoomFocusIntent"
    });
  }

  async controlLights({ roomName, commandName, brightness }) {
    const apiKey = process.env.KAPUR_KEY;
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }
    if (!!brightness) {
      config.headers.brightness = brightness;
      config.headers.transition = 5; //does not do anything
    }
    const entity_id = "light." + roomName.replace(" ", "_");
    const data = { entity_id }
    console.log(data)
    const url = "http://remote.kapurs.net:8123/api/services/light/turn_" + commandName;
    console.log(url)
    const response = await axios.post(url, data, config);
    return response.status;
  }

  async execute() {
    const deathStarPromise = await this.controlLights({roomName: "death star", commandName: "off"});
    const studyRoomPromise = await this.controlLights({roomName: "study", commandName: "on", brightness: 50})
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = StudyRoomFocusIntent; //TO-DO change name