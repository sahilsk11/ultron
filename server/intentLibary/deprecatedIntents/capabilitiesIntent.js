const { Intent } = require("../intent.js");

class CapabilitiesIntent extends Intent {
  constructor({ transcript, dbHandler, user }) {
    super({
      transcript,
      regex: [],
      utterances: ['what can you do', 'what do you do', 'tell me about yourself'],
      intentName: "capabilitiesIntent",
      dbHandler
    });
    this.user = user;
    this.authorizedForGuest = true;
  }

  async execute() {
    let message = "";
    if (this.user === "sahil") {
      message = "Sir, you already know what I can do."
    } else {
      message = `Hello ${this.user.substring(0, 1).toUpperCase() + this.user.substring(1)}! I can do a lot, from workout tracking to controlling Teslas. Unfortunately, you're a guest user, so you're limited to saying hello, flipping coins, and asking for quotes.`;
    }
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = CapabilitiesIntent;