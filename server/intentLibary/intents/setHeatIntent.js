const { Intent } = require("../intent.js");

class SetHeatIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [/set .* temperature/],
      utterances: ['turn the heater', 'set heat', 'set the heat', 'set the temperature', 'set temperature'],
      intentName: "setHeatIntent",
      dbHandler
    });
  }

  async execute() {
    thermostatRoomName = this.parseRoomName(this.transcript);
    if (thermostatName == "") {
      return { code: 400, message: "Could not identify thermostat name.", intent: this.intentName }
    }

    thermostatTargetTemperature = this.parseTemperature(this.transcript);
    if (thermostatTargetTemperature == "") {
      return { code: 400, message: "Could not identify thermostat temperature.", intent: this.intentName }
    } else if (isNaN(thermostatTargetTemperature)) {
      return { code: 400, message: "Could not parse thermostat temperature.", intent: this.intentName }
    } else if (thermostatTargetTemperature > 75 || thermostatTargetTemperature < 40) {
      return { code: 400, message: thermostatTargetTemperature + " degrees is not a valid thermostat temperature.", intent: this.intentName }
    }
    
    let message = "Setting " + thermostatRoomName + " to " + thermostatTargetTemperature + ".";
    return { code: 200, message, intent: this.intentName }
  }

  parseRoomName(transcript) {
    if (transcript.indexOf("bedroom") >= 0) {
      return "SAHIL_THERMOSTAT"
    }
    if (transcript.indexOf("downstairs") >= 0 || transcript.indexOf("living") >= 0) {
      return "LIVING_THERMOSTAT"
    }
    return ""
  }

  parseTemperature(transcript) {
    const regex = /[0-9]+/;
    const found = transcript.match(regex);
    if (found.length == 0) {
      return ""
    }
    return parseInt(found[0], 10)
  }

  async setTemperature(thermostatName, targetTemperature) {
    const apiKey = process.env.KNOX_KEY;
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }

    let requestBody = {
      thermostatName: thermostatName,
      targetTemperature: targetTemperature
    }

    return await axios.post("http://localhost:8000/climate/setHeat", requestBody, config);
  }
}

module.exports.IntentClass = SetHeatIntent;