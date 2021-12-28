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
    const apiKey = process.env.KNOX_KEY;
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }
    let message = "Goodnight, sir. Lighting the way up.";
    await axios.post(
      "http://localhost:8000/scenes/goodnight",
      {}, config
    )
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = Goodnight;