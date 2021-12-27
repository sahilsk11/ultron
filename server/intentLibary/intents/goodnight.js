const { Intent } = require("../intent.js");
const axios = require("axios");

class Goodnight extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['goodnight', 'heading up', 'downstairs lights off', 'good night'],
      intentName: "goodnight",
      dbHandler
    });
  }

  async execute() {
    let message = "Goodnight, sir. Lighting the way up.";
    await axios.post(
      "localhost:8000/goodnight",
      {}
    )
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = Goodnight;