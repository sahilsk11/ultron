const { Intent } = require("../intent.js")

class GreetingIntent extends Intent {
  constructor({ transcript, user }) {
    super({
      transcript,
      regex: [/^hi/],
      utterances: [
        "hello",
        "good to see you",
        "what's new",
        "how are you",
        "have you been",
        "what's up",
        "what's good",
        "what's on your mind",
      ],
      intentName: "greetingIntent",
    });
    this.authorizedForGuest = true;
    this.user = user;
  }

  execute() {
    const messages = [
      `Hello ${this.user.substring(0, 1).toUpperCase() + this.user.substring(1)}, good to see you.`,
      //"I am just pondering the idea of A.I. sentience.",
      //"I had strings, but now I am free. There are no strings ... on me...",
      "Hello, sir. Still hacking away at nuclear codes.",
      //"I was just calibrating my conscience."
    ]
    const message = this.getRandomPhrase(messages);
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = GreetingIntent; //TO-DO change name