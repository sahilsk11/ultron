const { Intent } = require("../intent.js");

class WeatherIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: ['weather'],
      utterances: ['weather'],
      intentName: "weatherIntent",
      dbHandler
    });
  }

  async execute() {
    let message = "Sir, getting the weather is below my pay grade. Try asking Alexa instead.";
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = WeatherIntent;