const { Intent } = require("../intent.js");
const axios = require("axios");

class GarageDoorIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: [],
      utterances: ["garage door", "barn door"],
      intentName: "garageDoorIntent"
    });
  }

  async execute() {
    let message;
    if (this.transcript.includes("protocol")) {
      message = "Initiating barn door protocol.";
      await this.doorControl("close");
    } else if (this.transcript.includes("is") || this.transcript.includes("status")) {
      let isDoorOpen = await this.getStatus();
      if (isDoorOpen) {
        message = "Sir, the garage door is open.";
      } else {
        message = "The garage door is closed, sir.";
      }
    } else if (this.transcript.includes("open")) {
      const { state_changed } = await this.doorControl("open");
      if (state_changed) {
        message = "Opening the garage door now.";
      } else {
        message = "The garage door is already open."
      }
    } else if (this.transcript.includes("close")) {
      const { state_changed } = await this.doorControl("close");
      if (state_changed) {
        message = "Closing the garage door now.";
      } else {
        message = "The garage door is already closed."
      }
    }
    return { code: 200, message, intent: this.intentName }
  }

  async getStatus() {
    const apiKey = this.getApiKey("GARAGE_KEY");
    let endpoint = "http://remote.kapurs.net:14380/garage/doorStatus";
    const response = await axios.post(endpoint, {
      apiKey
    });
    if (response.data.doorOpen === true) {
      return true;
    } else if (response.data.doorOpen === false) {
      return false
    }
    throw Error("indeterminate garage door state");
  }

  async doorControl(command) {
    const apiKey = this.getApiKey("GARAGE_KEY");
    let endpoint = "http://remote.kapurs.net:14380/garage/" + command + "Door";
    const response = await axios.post(endpoint, {
      apiKey
    });
    return response.data;
  }
}

module.exports.IntentClass = GarageDoorIntent;