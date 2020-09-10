const { Intent } = require("../intent.js");
const moment = require("moment");

class AddWorkoutSet extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: "",
      utterances: ['add workout', 'log set', 'add set', 'workout set'],
      intentName: "addWorkoutSet",
      dbHandler
    });
  }

  async execute() {
    const { workout, reps, intensity, weight, muscleGroup } = this.parseSet();
    const workoutEntry = await this.createWorkout({ workout, reps, intensity, weight, muscleGroup });
    let message = "Set added, sir.";
    return { code: 200, message, intent: this.intentName }
  }

  parseSet() {
    const metrics = [
      "workout",
      "muscle",
      "reps",
      "intensity",
      "weight",
    ];
    const values = {};
    for (let metric of metrics) {
      const i = this.transcript.lastIndexOf(metric);
      if (i >= 0) {
        const valStartIndex = this.indexOfNextSpace(i, this.transcript) + 1;
        let valEndIndex;
        if (metric === "workout") {
          const terminations = [
            "muscle",
            "reps",
            "intensity",
            "weight",
          ];
          let minIndex = this.transcript.length + 1;
          const remainder = this.transcript.substring(i + "workout".length);
          for (let termination of terminations) {
            if (remainder.indexOf(termination) >= 0) {
              minIndex = Math.min(minIndex, remainder.indexOf(termination) + i + "workout".length);
            }
          }
          valEndIndex = minIndex - 1;
          console.log(this.transcript.substring(valStartIndex, valEndIndex))
        } else {
          valEndIndex = this.indexOfNextSpace(valStartIndex, this.transcript);
        }
        if (valStartIndex < valEndIndex && (metric == "workout") || !isNaN(this.transcript.substring(valStartIndex, valEndIndex))) {
          if (metric == "workout" || metric == "set") {
            values[metric] = this.transcript.substring(valStartIndex, valEndIndex)
          } else {
            values[metric] = Number(this.transcript.substring(valStartIndex, valEndIndex));
          }
        }
      }
    }
    return values;
  }

  async createWorkout({ workout, reps, intensity, weight, muscleGroup }) {
    const muscleGroups = await this.getMuscleGroups(workout);
    const { weeklyProgress, muscleContributions } = await this.getProgressContributions(muscleGroups);
    const collection = await this.dbHandler.getCollection("gym", "exerciseHistory");
    const result = await collection.insertOne({
      workout,
      reps,
      intensity,
      weight,
      muscleGroups,
      weeklyProgress,
      muscleContributions,
      date: this.getDate(-4)
    });
    return result;
  }

  async getMuscleGroups(workout) {
    const collection = await this.dbHandler.getCollection("gym", "exerciseDefinitions");
    const result = await collection.findOne({ name: workout });
    return result.muscles;
  }

  async getProgressContributions(muscleGroups) {
    const collection = await this.dbHandler.getCollection("gym", "weeklyMuscleGoals");
    let weeklyProgress = 0;
    const muscleContributions = {};
    const expressions = [];
    for (let muscle of muscleGroups) {
      expressions.push({ muscle });
    }
    const result = await collection.find({ $or: expressions }).toArray();
    for (let muscleGoal of result) {
      weeklyProgress += (1 / muscleGoal.weeklySetGoal);
      muscleContributions[muscleGoal.muscle] = (1 / muscleGoal.weeklySetGoal);
    }
    return { weeklyProgress, muscleContributions };
  }

  async getMuscleGoals(muscleGroups) {
    const collection = await this.getMongoCollection("weeklyMuscleGoals");
    const result = await collection.findOne({ muscle: muscleGroups[0] });
    return result.weeklySetGoal;
  }
  
  getDate(offset) {
    const tzOffset = -8 + (moment().isDST() ? 0 : 1);
    let now = new Date();
    now.setHours(now.getHours() + tzOffset + offset);
    return now;
  }
}

module.exports.IntentClass = AddWorkoutSet;