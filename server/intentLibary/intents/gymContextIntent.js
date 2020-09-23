const { Intent } = require("../intent.js");

class GymContextIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['start gym', 'start workout', 'activate gym context', 'enable gym context', 'end workout', 'deactivate gym context'],
      intentName: "gymContextIntent",
      dbHandler
    });
  }

  async execute() {
    let newContextState = !(this.transcript.includes('end') || this.transcript.includes('deactivate'));
    const collection = await this.dbHandler.getCollection("ultron", "contexts");
    const result = await collection.updateOne({ contextName: "gym" }, { $set: { active: newContextState } });
    let message;
    if (newContextState) {
      message = "Gym context active sir. Kick ass today.";
    } else {
      message = "Gym context deactivated.";
    }
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = GymContextIntent;