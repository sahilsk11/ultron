const { Intent } = require("../intent.js");
const axios = require("axios");

class GarageDoorIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["garage door", "barn door"],
      intentName: "garageDoorIntent"
    });
  }

  async execute() {
    let message;
    if (this.transcript.includes("protocol")) {
      message = "Initiating barn door protocol.";
      this.makeRequest("close");
    } else if (this.transcript.includes("is") || this.transcript.includes("status")) {
      let response = await this.makeRequest("status");
      if (response.status) {
        message = "Sir, the garage door is open.";
      } else {
        message = "The garage door is closed, sir.";
      }
    } else if (this.transcript.includes("open")) {
      this.makeRequest("open");
      message = "Opening the garage door now.";
    } else if (this.transcript.includes("close")) {
      message = "Closing the garage door now.";
      this.makeRequest("close");
    }
    return { code: 200, message, intent: this.intentName }
  }

  async makeRequest(command) {
    const endpoint = "http://remote.kapurs.net:14380/GDS/status.py?command=" + command;
    const username = "admin";
    const password = this.getApiKey("HOME_PASSWORD");
    const response = await axios.get(endpoint, {
      auth: {
        username,
        password
      }
    });

    return response.data;
  }
}

module.exports.IntentClass = GarageDoorIntent;