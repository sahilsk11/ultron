const { Intent } = require("../intent.js");

class MakeRandomDecisionIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["should i"],
      intentName: "makeRandomDecisionIntent"
    });
  }

  async execute() {
    const bool = Math.floor(Math.random() * 2);
    let message = "Sir, I flipped a coin, and I believe the answer is ";
    if (bool == 0) {
      message += "no.";
    } else {
      message += "yes.";
    }
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = MakeRandomDecisionIntent;