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
      const quote = this.getWorkoutQuote();
      message = quote + " Gym context active." ;
    } else {
      message = "Gym context deactivated.";
    }
    return { code: 200, message, intent: this.intentName }
  }

  getWorkoutQuote() {
    const quotes = [
      "Success isn’t always about ‘Greatness’, it’s about consistency.",
      "No Pain, No Gain. Shut up and Train.",
      "Train Insane or Remain the Same.",
      "The body achieves what the mind believes.",
      "Hustle for that Muscle."
    ];
    return this.getRandomPhrase(quotes);
  }
}

module.exports.IntentClass = GymContextIntent;