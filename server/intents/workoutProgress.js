const { Intent } = require("../intent.js");

class WorkoutProgressIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["workout progress", "workouts", "gym"],
      intentName: "workoutProgressIntent"
    });
  }

  async execute() {
    const records = await this.getThisWeeksData();
    let message;
    if (records === undefined || records.length === 0) {
      message = "I don't see any workout data for this week yet.";
    } else {
      const { progress, avgIntensity, totalDays } = await this.calculateWeeklyNumbers(records);
      message = this.constructMessage({ progress, avgIntensity, totalDays });
    }
    return { code: 200, message, intent: this.intentName }
  }

  constructMessage({ progress, avgIntensity, totalDays }) {
    return `You've completed ${progress}% of your weekly goal, with an average intensity of ${avgIntensity}% over ${totalDays} day${totalDays !== 1 ? 's' : ''}.`;
  }

  getWeekNumber() {
    Date.prototype.getWeek = function () {
      const onejan = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
    return new Date().getWeek();
  }

  async getThisWeeksData() {
    const authKeyName = "AIRTABLE_WORKOUT_API_KEY";
    const apiKey = this.getApiKey(authKeyName)
    console.log(apiKey);
    const weekNumber = this.getWeekNumber();
    const year = new Date().getFullYear();
    let url = `https://api.airtable.com/v0/appSD8cnaTlpwJwba/summary?filterByFormula=AND(YEAR({Date})=${year}, {Week}=${weekNumber})`;
    const response = await this.httpRequest({ method: "GET", authKeyName, url });
    return response.data.records; //returns a list of records
  }

  async calculateWeeklyNumbers(records) {
    let progress = 0;
    let totalIntensity = 0;
    let totalDays = 0;
    await records.map(record => {
      progress += record.fields.weeklyProgress;
      totalIntensity += record.fields.avgIntensity;
      totalDays++;
    });
    const avgIntensity = Math.round((totalIntensity / totalDays) * 100);
    progress = Math.round(progress * 100);

    return { progress, avgIntensity, totalDays };
  }
}

module.exports.IntentClass = WorkoutProgressIntent;