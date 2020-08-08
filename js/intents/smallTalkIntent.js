const { Intent } = require("../intent.js")

class SmallTalkIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "good to see you",
        "what it do",
        "what's new",
        "how are you",
        "have you been",
        "what's up",
        "what's good",
        "you too",
        "what's on your mind"
      ],
      intentName: "smallTalkIntent"
    });
  }

  execute() {
    const messages = [
      "I am just pondering the idea of A.I. sentience.",
      "I had strings, but now I am free. There are no strings ... on me...",
      "Still hacking away at nuclear codes.",
      "I was just calibrating my conscience."
    ]
    const message = this.getRandomPhrase(messages);
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = SmallTalkIntent; 