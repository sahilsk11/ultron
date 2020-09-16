const { Intent } = require("../intent.js");

class DeleteSetIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: "",
      utterances: ['delete set', 'delete last set', 'remove last set', 'remove recent set', 'delete the last set',],
      intentName: "deleteSetIntent",
      dbHandler
    });
  }

  async execute() {
    const collection = await this.dbHandler.getCollection("gym", "exerciseHistory");
    const result = await collection.findOneAndDelete(
      {},
      { sort: { date: -1 } }
    );
    const lastEntry = result.value;
    const name = lastEntry.exercise ? lastEntry.exercise : lastEntry.muscleGroups[0];
    const message = `Deleted ${name} set from ${lastEntry.localDate}.`;
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = DeleteSetIntent;