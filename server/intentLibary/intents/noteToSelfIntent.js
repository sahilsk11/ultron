const { Intent } = require("../intent.js");

class NoteToSelfIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['take a note', 'remind me', 'note to self'],
      intentName: "noteToSelfIntent",
      dbHandler
    });
  }

  async execute() {
    const collection = await this.dbHandler.getCollection("ultron", "notes");
    const result = await collection.insertOne({
      transcript: this.transcript,
      date: new Date()
    });
    const message = "Note added, sir."
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = NoteToSelfIntent;