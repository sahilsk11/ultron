/**
 * This is NOT A REAL INTENT and is used as a sample for what an intent will look like
 * 
 * Note that the pathname for intent.js is relative and will fail if not placed in the
 * intents/ folder.
 * 
 * 
 */

const { Intent } = require("../intent.js");

class SampleIntent extends Intent { // TO-DO change name
  constructor({ transcript }) {
    // TO-DO edit regex, utterances, and name
    super({
      transcript,
      regex: "",
      utterances: ["give me a sample intent"],
      intentName: "sampleIntent"
    });
  }

  async execute() {
    // TO-DO implmement
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = SampleIntent; //TO-DO change name