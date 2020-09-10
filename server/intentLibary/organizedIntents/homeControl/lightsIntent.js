const { Intent } = require("../intent.js");
const axios = require('axios');
require('dotenv').config();

class LightsIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "lights"
      ],
      intentName: "lightsIntent"
    });
  }

  async execute() {
    this.transcript = this.transcript.replace("turn ", "");
    const lightIndex = this.transcript.indexOf("light");
    const roomEndIndex = lightIndex - 1;
    const roomStartIndex = 0;
    const roomName = this.transcript.substring(roomStartIndex, roomEndIndex);

    const commandStartIndex = this.indexOfNextSpace(lightIndex, this.transcript) + 1;
    const commandEndIndex = this.indexOfNextSpace(commandStartIndex, this.transcript);
    const commandName = this.transcript.substring(commandStartIndex, commandEndIndex);

    const responseCode = await this.controlLights({ roomName, commandName });
    let message;
    if (responseCode === 200) {
      message = "Turning " + roomName + " lights " + commandName;
    } else {
      message =  "Could not turn " + roomName + " lights " + commandName;
    }
    return { code: 200, message, intent: this.intentName }
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
    console.log(data)
    const url = "http://remote.kapurs.net:8123/api/services/light/turn_" + commandName;
    console.log(url)
    const response = await axios.post(url, data, config);
    return response.status;
  }
}

module.exports.IntentClass = LightsIntent;