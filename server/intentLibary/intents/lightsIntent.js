const { Intent } = require("../intent.js");
const axios = require('axios');
require('dotenv').config();

class LightsIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: [],
      utterances: [
        "lights", "light"
      ],
      intentName: "lightsIntent"
    });
  }


  async execute() {
    var currentHome = "berry"; // can be berry or bentley

    this.transcript = this.transcript.replace("turn ", "");
    const lightIndex = this.transcript.indexOf("light");
    const roomEndIndex = lightIndex - 1;
    const roomStartIndex = 0;
    const roomName = this.transcript.substring(roomStartIndex, roomEndIndex);

    // command should either be ON or OFF
    const commandStartIndex = this.indexOfNextSpace(lightIndex, this.transcript) + 1;
    const commandEndIndex = this.indexOfNextSpace(commandStartIndex, this.transcript);
    const commandName = this.transcript.substring(commandStartIndex, commandEndIndex);

    let responseCode;
    if (currentHome === "berry") {
      responseCode = await this.controlBerryLights({ roomName, commandName });
    } else {
      responseCode = await this.controlLights({ roomName, commandName });
    }
    let message;
    if (responseCode === 200) {
      message = "Turning " + roomName + " lights " + commandName;
    } else {
      message = "Could not turn " + roomName + " lights " + commandName;
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
    const url = "http://remote.kapurs.net:8123/api/services/light/turn_" + commandName;

    const response = await axios.post(url, data, config);
    return response.status;
  }

  async controlBerryLights({roomName, commandName}) {
    const apiKey = process.env.KNOX_KEY;
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }

    roomName = this.correctBerryRoomName(roomName);

    let requestBody = {
      "lightName": roomName.toUpperCase().replace(" ", "_"),
      "state": commandName.toUpperCase()
    }

    const response = await axios.post("http://localhost:8000/lights/toggleLight", requestBody, config);
    return response.status;
  }

  correctBerryRoomName(roomName) {
    roomName = roomName.replace("lights", "")
    roomName = roomName.replace(" room", "")
    roomName = roomName.trim()
    if (roomName.indexOf("bedroom") >= 0) {
      return "SAHIL_BEDROOM"
    }
    return roomName;
  }
}

module.exports.IntentClass = LightsIntent;