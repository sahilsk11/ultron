const { Intent } = require("../intent.js");
const axios = require('axios');

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
    //const summaryEntry = await this.addToSummary({ workout, reps, intensity, weight, muscleGroup });
    let message = "hi";
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

  async addToAirtable({ workout, reps, intensity, weight, muscleGroup }) {
    const config = {
      headers: {
        'Authorization': 'Bearer ' + this.getApiKey("AIRTABLE_WORKOUT_API_KEY"),
        'Content-Type': 'application/json'
      }
    }
    const muscles = await this.getMuscleGroup(workout);
    let modifiedDate = new Date();
    modifiedDate.setHours(modifiedDate.getHours() - 4);
    let modifiedDateStr = modifiedDate.toLocaleDateString();
    const data = {
      records: [
        {
          fields: {
            reps,
            workout,
            intensity: Number(intensity / 100),
            weight,
            date: modifiedDateStr,
            muscles
          }
        }
      ]
    }
    let url = "https://api.airtable.com/v0/appSD8cnaTlpwJwba/exercises";
    let response;
    try {
      response = await axios.post(url, data, config);
      return response.data;
    } catch (err) {
      throw this.handleAxiosError(err, "POST", url);
    }
  }

  async getMuscleGroup(workout) {
    const config = {
      headers: {
        'Authorization': 'Bearer ' + this.getApiKey("AIRTABLE_WORKOUT_API_KEY"),
        'Content-Type': 'application/json'
      }
    }
    const url = `https://api.airtable.com/v0/appSD8cnaTlpwJwba/workouts?filterByFormula=(Name='${workout}')`;
    try {
      const response = await axios.get(url, config);
      return response.data.records[0].muscles;
    } catch (err) {
      console.error(err);
      throw this.handleAxiosError(err, "GET", url);
    }

  }

  async getSummaryId(recordId) {
    let modifiedDate = new Date();
    modifiedDate.setHours(modifiedDate.getHours() - 4);
    let modifiedDateStr = modifiedDate.toLocaleDateString();

    const config = {
      headers: {
        'Authorization': 'Bearer ' + this.getApiKey("AIRTABLE_WORKOUT_API_KEY"),
        'Content-Type': 'application/json'
      }
    }
    const url = `https://api.airtable.com/v0/appSD8cnaTlpwJwba/summary?filterByFormula=({date-string}='${modifiedDateStr}')`;
    let currentWorkouts;
    try {
      const response = await axios.get(url, config);
      workouts = response.data.records[0].get('Workouts');

      return response.data.records[0].muscles;
    } catch (err) {
      console.error(err);
      throw this.handleAxiosError(err, "GET", url);
    }
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
      date: new Date()
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
  /*
  async addToWeeklySummary(workoutEntry) {
    const summaryEntry = await this.getSummaryEntry();
    let intensityTotal = summaryEntry.avgIntensity * summaryEntry.exercises.length;
    intensityTotal += workoutEntry.intensity;
    const newIntensityAvg = (intensityTotal / summaryEntry.exercises.length + 1);
    let excersises = summaryEntry.excersises;
    excersises.push(workoutEntry)
  }

  async getWeeklySummaryEntry() {
    const weekNumber = 31;
    const year = 2020;
    const collection = await this.dbHandler.getCollection("gym", "weeklySummaries");
    const result = await collection.findOne({ week: weekNumber, year });
    if (result === null) {
      // create new entry
      return {
        week: weekNumber,
        year,
        avgIntensity: null,
        weeklyProgress: 0.0,
        progress: {},
      }
    }
    console.log(result);
    return result;
  }
*/

}

module.exports.IntentClass = AddWorkoutSet;