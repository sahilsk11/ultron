const { Intent } = require("../intent.js");
const axios = require('axios');

class AddWorkoutSet extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ['add workout', 'log set', 'add set', 'workout set'],
      intentName: "addWorkoutSet"
    });
  }

  async execute() {
    const { workout, reps, intensity, weight, muscleGroup } = this.parseSet();
    const response = await this.addToAirtable({ workout, reps, intensity, weight, muscleGroup });
    let message;
    if (response.records && response.records[0].createdTime) {
      message = "Set added sir.";
    } else {
      message = "Sir, I believe there was an error in the request."
    }
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
          if (metric == "workout") {
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
    } catch(err) {
      console.error(err);
      throw this.handleAxiosError(err, "GET", url);
    }
    
  }

  async addToSummary() {
    
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
}

module.exports.IntentClass = AddWorkoutSet;