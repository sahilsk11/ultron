const { Intent } = require("../intent.js");
const moment = require('moment-timezone');

class WorkoutProgressIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
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
      startDay = this.getDateToday();
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
    // const today = this.getDate(4);
    // today.setHours(0, 0, 0, 0);
    const muscleGroups = await this.getMuscleGroups();
    const muscleAggregators = this.constructMuscleAggregator(muscleGroups);
    console.log(startDay);
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
          _id: 0,
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
    let muscleStr = '';
    let val = Math.round(summary.weeklyProgress * 100);
    if (!!scannedMuscle) {
      muscleStr = scannedMuscle + " ";
      val = Math.round(summary[scannedMuscle + "Progress"] * 100);
    }
    if (isNaN(val)) {
      return `Sir, I don't see any workout data from ${ isToday ? "today." : "this week."}`;
    }
    let message = `You've completed ${val}% of your weekly ${muscleStr}goal`;
    if (isNaN(summary.avgIntensity)) {
      message += '.';
    } else {
      message += `, with an average intensity of ${Math.round(summary.avgIntensity * 100)}%.`;
    }
    return message
  }

  getDateToday() {
    return moment().tz('America/Los_Angeles').subtract(4, 'hours').startOf('day').utc()._d;
  }

  getPrevMonday() {
    let now = moment().tz('America/Los_Angeles').subtract(4, 'hours');
    if (now.day() == 0) {
      now = now.subtract(1, 'day').startOf('week').add(1, 'day');
    } else {
      now = now.startOf('week').add(1, 'day');
    }
    return now.utc()._d;
  }

  async scanForMuscle() {
    const muscles = await this.getMuscleGroups();
    for (let muscle of muscles) {
      if (this.transcript.includes(muscle.replace("-", " "))) {
        return muscle;
      }
    }
    return null;
  }
}


module.exports.IntentClass = WorkoutProgressIntent;