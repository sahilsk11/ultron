const { Intent } = require("../intent.js")

class FlipCoinIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: [],
      utterances: [
        "flip a coin",
        "heads or tails",
        "flip again"
      ],
      intentName: "flipCoinIntent"
    });
    this.authorizedForGuest = true;
  }

  execute() {
    const bool = Math.floor(Math.random() * 2);
    let message;
    if (bool == 0) {
      message = "You got heads, sir.";
    } else {
      message = "You got tails, sir.";
    }
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = FlipCoinIntent;