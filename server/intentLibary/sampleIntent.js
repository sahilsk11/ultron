const { Intent } = require("../intent.js");

class SampleIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['sample utterance'],
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