const { Intent } = require("../intent.js");
const dbHandler = require("../../dbHandler.js");

class TestIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: "",
      utterances: ['test intent'],
      intentName: "testIntent",
      dbHandler
    });
  }

  async execute() {
    let message = "";
    return { code: 200, message: message.toString(), intent: this.intentName }
  }
}

module.exports.IntentClass = TestIntent;