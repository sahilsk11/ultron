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
    let startDay;
    let isToday = false;
    const scannedMuscle = await this.scanForMuscle();
    if (this.transcript.includes("current") || this.transcript.includes("today")) {
      const today = this.getDate()
      today.setHours(0, 0, 0, 0);
      startDay = today;
      isToday = true;
    } else {
      startDay = this.getPrevMonday();
    }
    const summary = await this.getSummary(startDay, scannedMuscle);
    const message = this.constructMessage(summary, isToday, scannedMuscle);
    return { code: 200, message, intent: this.intentName }
  }

  async getSummary(startDay, scannedMuscle) {
    const collection = await this.dbHandler.getCollection("gym", "exerciseHistory");
    const today = this.getDate(4);
    today.setHours(0, 0, 0, 0);
    const muscleGroups = await this.getMuscleGroups();
    const muscleAggregators = this.constructMuscleAggregator(muscleGroups);
    const matchSelector = {
      date: {
        $gte: startDay
      },
    }
    if (!!scannedMuscle) {
      matchSelector.muscleGroups = [scannedMuscle];
    }
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
    if (result.length == 0) return {};
    return result[0];
  }

  constructMuscleAggregator(muscleGroups) {
    const aggregators = {};
    for (let muscle of muscleGroups) {
      aggregators[muscle + "Progress"] = {
        $sum: "$muscleContributions." + muscle
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

  constructMessage(summary, isToday, scannedMuscle) {
    return `You've completed ${Math.round(summary[scannedMuscle + "Progress"] * 100)}% of your weekly ${scannedMuscle} goal, with an average intensity of ${Math.round(summary.avgIntensity * 100) }%.`;
  }

  getDate(offset) {
    let date = moment().tz('America/Los_Angeles');
    date.subtract(offset, 'hours');
    return date._d;
  }

  getPrevMonday() {
    var date = this.getDate(4);
    var day = date.getDay();
    date.setDate(date.getDate() - day + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  async scanForMuscle() {
    const muscles = await this.getMuscleGroups();
    for (let muscle of muscles) {
      if (this.transcript.includes(muscle)) {
        return muscle;
      }
    }
    return null;
  }
}


module.exports.IntentClass = WorkoutProgressIntent;