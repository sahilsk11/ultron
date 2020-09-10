const { Intent } = require("../intent.js");
const moment = require("moment");

class WorkoutProgressIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: "",
      utterances: ["workout progress", "workout stats"],
      intentName: "workoutProgressIntent",
      dbHandler
    });
  }

  async execute() {
    let matchSelector
    if (this.transcript.includes("current") || this.transcript.includes("today")) {
      const today = this.getDate(-4)
      today.setHours(0, 0, 0, 0);
      matchSelector = {
        date: {
          $gte: today
        }
      }
    } else {
      matchSelector = {
        week: 30
      }
    }
    const summary = await this.getSummary(matchSelector);
    console.log(summary);
    const message = this.constructMessage(summary);
    return { code: 200, message, intent: this.intentName }
  }

  async getSummary(matchSelector) {
    const collection = await this.dbHandler.getCollection("gym", "exerciseHistory");
    const today = this.getDate(-4);
    today.setHours(0, 0, 0, 0);
    const muscleGroups = await this.getMuscleGroups();
    const muscleAggregators = this.constructMuscleAggregator(muscleGroups);
    const result = await collection.aggregate([
      {
        $match: matchSelector
      }, {
        $group: {
          _id: today,
          weeklyProgress: {
            $sum: "$weeklyProgress"
          },
          avgIntensity: {
            $avg: "$intensity"
          },
          ...muscleAggregators
        }
      }
    ]).toArray();
    console.log(result);
    return result[0];
  }

  constructMuscleAggregator(muscleGroups) {
    const aggregators = {};
    for (let muscle of muscleGroups) {
      aggregators[muscle+"Progress"] = {
        $sum: "$muscleContributions."+muscle
      }
    }
    return aggregators;
  }

  async getMuscleGroups() {
    const collection = await this.dbHandler.getCollection("gym", "weeklyMuscleGoals");
    const result = await collection.find().toArray();
    const muscles = [];
    for (let muscleEntry of result) {
      muscles.push(muscleEntry.muscle);
    }
    return muscles;
  }

  constructMessage() {
    return "hi";
  }

  getDate(offset) {
    const tzOffset = -8 + (moment().isDST() ? 0 : 1);
    let now = new Date();
    now.setHours(now.getHours() + tzOffset + offset);
    return now;
  }
}


module.exports.IntentClass = WorkoutProgressIntent;