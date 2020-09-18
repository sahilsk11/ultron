const { Intent } = require("../intent.js");

class ClearIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["clear", "stop", "shut up", "stop"],
      intentName: "clearIntent"
    });
    this.authorizedForGuest = true;
  }

  async execute() {
    return { code: 200, message: "", intent: this.intentName, action: "reset" }
  }
}

module.exports.IntentClass = ClearIntent;