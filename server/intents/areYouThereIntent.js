const { Intent } = require("../intent.js")

class AreYouThereIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "hey dummy",
        "you there",
        "you listening",
        "you listening",
        "knock knock",
        "wake up"
      ],
      intentName: "areYouThereIntent"
    });
  }

  execute() {
    const messages = [
      "Hello sir, I'm here.",
      "Present, as always captain.",
      "Hello!",
      "Always present sir."
    ]
    return { code: 200, message: this.getRandomPhrase(messages), intent: this.intentName }
  }
}

module.exports.IntentClass = AreYouThereIntent;