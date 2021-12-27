const { Intent } = require("../intent.js");

class Goodnight extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['goodnight', 'heading up', 'downstairs lights off'],
      intentName: "goodnight",
      dbHandler
    });
  }

  async execute() {
    let message = "Goodnight, sir. Lighting the way up.";
    axios.post(
      "localhost:8000/goodnight",
      {}
    )
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = Goodnight;