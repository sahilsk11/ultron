const { Intent } = require("../intent.js");
const axios = require('axios');

class WeightInsights extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["weight stats", "weight insights", "tell me about my weight", "how is my weight", "how's my weight"],
      intentName: "weightInsights"
    });
  }

  async execute() {
    const thirtyDayData = await this.getThirtyDayData();
    const cleanedData = this.cleanRecords(thirtyDayData);
    const calculations = this.parseData(cleanedData);
    const message = this.constructMessage(calculations);
    return { code: 200, message, intent: this.intentName }
  }

  async getThirtyDayData() {
    const apiKey = this.getApiKey("AIRTABLE_DREAM_API_KEY")
    let url = `https://api.airtable.com/v0/appL5UFlN4QSFyjSo/weight?view=30_day&sort%5B0%5D%5Bfield%5D=date&sort%5B0%5D%5Bdirection%5D=asc`;
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }
    const response = await axios.get(url, config);
    return response.data.records;
  }

  cleanRecords(thirtyDayData) {
    const cleanedData = [];
    //synchronous was actually faster here
    for (const record of thirtyDayData) {
      cleanedData.push([
        record.fields["date"],
        record.fields["weight (lbs)"],
        record.fields["muscle mass (lbs)"]
      ]);
    }
    return cleanedData;
  }

  parseData(cleanedData) {
    const runningAvg = [];
    let minWeight, minMuscle = 200;
    let maxWeight, maxMuscle = 0;
    for (let i = 0; i < cleanedData.length; i++) {
      // if (i >= 2) {
      //   runningAvg.push([
      //     listSum([cleanedData[i - 2][1], cleanedData[i - 1][1], cleanedData[i][1]]) / 3, //3-day moving avg for weight
      //     listSum([cleanedData[i - 2][2], cleanedData[i - 1][2], cleanedData[i][2]]) / 3 //3-day moving avg for muscle
      //   ]);
      minWeight = Math.min(minWeight, cleanedData[i][1]);
      maxWeight = Math.max(maxWeight, cleanedData[i][1]);
    }

    const todayWeight = cleanedData[cleanedData.length - 1][1];
    const netIncrease = todayWeight - minWeight;
    const netDecrease = todayWeight - maxWeight;
    return { todayWeight, netIncrease, netDecrease };
  }

  constructMessage({ todayWeight, netIncrease, netDecrease }) {
    const diffThreshold = 1;
    let message = `Your most recent weight entry was ${todayWeight} pounds, which is `;
    if (netIncrease > diffThreshold) {
      message += `up ${Math.round(netIncrease*10)/10} pounds from the thirty day max`
      if (netDecrease < -diffThreshold) {
        message += ", and ";
      } else {
        message += "."
      }
    }
    if (netDecrease < -diffThreshold) {
      message += `down ${Math.round(netDecrease * 10) / 10} pounds from the thirty day minimum.`
    } else {
      message += "largely unchanged over the past thirty days."
    }
    return message;
  }

  async listSum(list) {
    return await list.reduce((a, b) => a + b, 0);
  }
}

module.exports.IntentClass = WeightInsights;