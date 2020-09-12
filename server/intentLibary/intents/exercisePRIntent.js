const { Intent } = require("../intent.js");

class ExercisePRIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: /pr$/,
      utterances: [' my pr '],
      intentName: "exercisePRIntent",
      dbHandler
    });
  }

  async execute() {
    const exerciseName = await this.scanForExercise();
    const pr = await this.findPr(exerciseName);
    const message = this.constructMessage(pr, exerciseName);
    return { code: 200, message, intent: this.intentName }
  }

  constructMessage(pr, exerciseName) {
    if (pr == null || (!pr.reps && !pr.weight)) {
      return `Sir, I couldn't find a P.R. on ${exerciseName}.`;
    }
    let message = `Your P.R. on ${exerciseName} is`;
    if (pr.reps) {
      message += ` ${pr.reps} reps`;
    }
    if (pr.weight) {
      if (pr.weight) message += ` at`;
      message += ` ${pr.weight} pounds`;
    }
    return message + ".";
  }

  async findPr(exerciseName) {
    const collection = await this.dbHandler.getCollection("gym", "exerciseHistory");
    const result = await collection.aggregate([
      {
        $match: {
          exercise: exerciseName
        }
      }, {
        $sort: {
          weight: -1,
          reps: -1
        },
      },
      {
        $limit: 1
      }
    ]).toArray();
    if (result.length < 1) {
      return null;
    }
    const pr = result[0];
    return pr;
  }

  /**
   * Generate a list with all known exercise names
   */
  async scanForExercise() {
    const collection = await this.dbHandler.getCollection("gym", "exerciseDefinitions");
    const result = await collection.find().toArray();
    for (let exercise of result) {
      for (let alias of exercise.aliases) {
        if (this.transcript.search(alias) >= 0) {
          return exercise.name;
        }
      }
    }
    const e = new Error("Exercise not found");
    e.ultronMessage = "I couldn't find a valid exercise name, sir.";
    throw e;
  }
}

module.exports.IntentClass = ExercisePRIntent;