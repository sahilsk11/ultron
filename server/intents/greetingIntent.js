const { Intent } = require("../intent.js")

class GreetingIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "hello",
        "good evening",
        "morning",
        "rise and shine"
      ],
      intentName: "greetingIntent"
    });
  }

  execute() {
    const messages = [
      "Hello Sahil, good to see you.",
    ]
    const message = this.getRandomPhrase(messages);
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = GreetingIntent; //TO-DO change name