const { Intent } = require("../intent.js");

class SampleIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: "",
      utterances: [],
      intentName: "sampleIntent",
      dbHandler
    });
  }

  async execute() {
    let message = "";
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = SampleIntent;