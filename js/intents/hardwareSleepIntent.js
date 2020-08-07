const { Intent } = require("../intent.js");

class HardwareSleepIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["turn off mic", "go to sleep", "disable", "sleep mode"],
      intentName: "hardwareSleepIntent"
    });
  }

  async execute() {
    const message = "Turning off hardware.";
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = HardwareSleepIntent;