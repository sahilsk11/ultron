const { Intent } = require("../intent.js");
const axios = require('axios');


class TheaterScene extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['theater mode', 'theater scene'],
      intentName: "theaterScene",
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

    const response = await axios.post("http://localhost:8000/scenes/theaterScene", {}, config);

    let message = "Theater scene activated.";
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = TheaterScene;