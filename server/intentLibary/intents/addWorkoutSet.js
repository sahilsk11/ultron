const { Intent } = require("../intent.js");
const moment = require('moment-timezone');

class AddexerciseSet extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: "",
      utterances: ['add exercise', 'log set', 'add set', 'exercise set'],
      intentName: "addexerciseSet",
      dbHandler
    });
  }

  async execute() {
    const { reps, intensity, weight } = this.parseSet();
    let muscleGroups;
    const exercise = await this.scanForExercise();
    if (!exercise) {
      muscleGroups = [await this.scanForMatch(await this.getAllMuscleNames())];
    }
    const exerciseEntry = await this.addExerciseEntry({ exercise, reps, intensity, weight, muscleGroups });
    const workoutName = exercise || muscleGroups[0];
    let message = `${workoutName.substring(0, 1).toUpperCase() + workoutName.substring(1)} set added, sir.`
    return { code: 200, message, intent: this.intentName }
  }

  parseSet() {
    const metrics = [
      "reps",
      "intensity",
      "weight",
    ];
    const values = {};
    for (let metric of metrics) {
      if (metric == "intensity") {
        const iParse = this.parseIntensity();
        if (iParse !== null) {
          values["intensity"] = iParse;
          continue;
        }
      }
      const i = this.transcript.lastIndexOf(metric);
      if (i >= 0) {
        const valStartIndex = this.indexOfNextSpace(i, this.transcript) + 1;
        let valEndIndex = this.indexOfNextSpace(valStartIndex, this.transcript);
        if (valStartIndex < valEndIndex && !isNaN(this.transcript.substring(valStartIndex, valEndIndex))) {
          values[metric] = Number(this.transcript.substring(valStartIndex, valEndIndex));
          if (metric == "intensity") {
            values[metric] /= 100;
          }
        }
      }
    }
    return values;
  }

  parseIntensity() {
    const percentageIndex = this.transcript.lastIndexOf("%");
    if (percentageIndex > 2) {
      const intensity = this.transcript.substring(percentageIndex - 2, percentageIndex);
      if (!isNaN(intensity)) {
        return Number(intensity) / 100;
      }
    }
    return null;
  }

  async addExerciseEntry({ exercise, reps, intensity, weight, muscleGroups }) {
    if ((!muscleGroups || !muscleGroups[0]) && !exercise) {
      const err = new Error("Missing exercise name and muscle name");
      err.ultronMessage = "Sir, the exercise name and muscle name are missing.";
      throw err;
    }
    if (!muscleGroups) {
      muscleGroups = await this.getMuscleGroups(exercise);
    }
    const { weeklyProgress, muscleContributions } = await this.getProgressContributions(muscleGroups);
    const collection = await this.dbHandler.getCollection("gym", "exerciseHistory");
    const result = await collection.insertOne({
      exercise,
      reps,
      intensity,
      weight,
      muscleGroups,
      weeklyProgress,
      muscleContributions,
      date: this.getDate(4)
    });
    return result;
  }

  /**
   * Finds the muscles used in the particular exercise
   * 
   * @param exercise name of the exercise
   * 
   * @return an array with the muscles used in the exercise
   */
  async getMuscleGroups(exercise) {
    const collection = await this.dbHandler.getCollection("gym", "exerciseDefinitions");
    const result = await collection.findOne({ name: exercise });
    if (result == null) {
      const err = new Error(`Exercise ${exercise} was not found in excerciseDefinitions`);
      err.ultronMessage = `Sir, ${exercise} was not found in excerciseDefinitions.`;
      throw err;
    }
    return result.muscles;
  }

  /**
   * Calculates the progress of the set towards the weekly goal
   * 
   * @param muscleGroups the array of muscles used in the exercise
   */
  async getProgressContributions(muscleGroups) {
    const collection = await this.dbHandler.getCollection("gym", "weeklyMuscleGoals");
    let weeklyProgress = 0;
    const muscleContributions = {};
    const expressions = [];
    for (let muscle of muscleGroups) {
      expressions.push({ muscle });
    }
    const totalVolume = await this.getTotalMuscles();
    const result = await collection.find({ $or: expressions }).toArray();
    for (let muscleGoal of result) {
      weeklyProgress += (1 / muscleGoal.weeklySetGoal) / totalVolume;
      muscleContributions[muscleGoal.muscle] = (1 / muscleGoal.weeklySetGoal);
    }
    return { weeklyProgress, muscleContributions };
  }

  async getMuscleGoals(muscleGroups) {
    const collection = await this.dbHandler.getCollection("gym", "weeklyMuscleGoals");
    const result = await collection.findOne({ muscle: muscleGroups[0] });
    return result.weeklySetGoal;
  }

  getDate(offset) {
    let date = moment().tz('America/Los_Angeles');
    date.subtract(offset, 'hours');
    return date._d;
  }

  /**
   * Counts the number of defined muscle groups
   * 
   * Used to calculate the weighted average of a particular set
   */
  async getTotalMuscles() {
    const collection = await this.dbHandler.getCollection("gym", "weeklyMuscleGoals");
    return collection.countDocuments();
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
    return null;
  }

  /**
   * Generate a list with all defined muscle groups
   */
  async getAllMuscleNames() {
    const collection = await this.dbHandler.getCollection("gym", "weeklyMuscleGoals");
    const result = await collection.find().toArray();
    const muscles = [];
    for (let muscleEntry of result) {
      muscles.push(muscleEntry.muscle);
    }
    return muscles;
  }

  async scanForMatch(scanList) {
    for (let item of scanList) {
      if (this.transcript.includes(item.replace("-", " "))) {
        return item;
      }
    }
    return null;
  }
}

module.exports.IntentClass = AddexerciseSet;