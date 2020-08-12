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
        "rise and shine",
        "good to see you",
        "what's new",
        "how are you",
        "have you been",
        "what's up",
        "what's good",
        "you too",
        "what's on your mind",
        
      ],
      intentName: "greetingIntent"
    });
  }

  execute() {
    const messages = [
      "Hello Sahil, good to see you.",
      "I am just pondering the idea of A.I. sentience.",
      //"I had strings, but now I am free. There are no strings ... on me...",
      "Hello, sir. Still hacking away at nuclear codes.",
      "I was just calibrating my conscience."
    ]
    const message = this.getRandomPhrase(messages);
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = GreetingIntent; //TO-DO change name