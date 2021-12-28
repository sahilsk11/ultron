const { Intent } = require("../intent.js");

class ShowSourceCodeIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['source code'],
      intentName: "showSourceCodeIntent",
      dbHandler
    });
    this.authorizedForGuest = true;
  }

  async execute() {
    let message = "Right away, sir.";
    return { code: 200, message, intent: this.intentName, url: "https://github.com/sahilsk11/ultron" }
  }
}

module.exports.IntentClass = ShowSourceCodeIntent;