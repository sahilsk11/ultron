const { Intent } = require("../intent.js");

class HomieGreetingIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["say hi to", "say what's up to", "say what's good to", "holla at the homie", "to the homie"],
      intentName: "homieGreetingIntent"
    });
  }

  async execute() {
    const regex = /([a-z]+)$/;
    const name = regex.exec(this.transcript)[1];
    let messages = [
      "What is good, homie ",
    ]
    const message = this.getRandomPhrase(messages) + name;
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = HomieGreetingIntent;