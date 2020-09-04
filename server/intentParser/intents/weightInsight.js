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
    const calculations = await this.parseData(cleanedData);
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

  async parseData(cleanedData) {
    let minWeight = 200;
    let maxWeight = 0;
    await Promise.all(cleanedData.map(entry => {
      minWeight = Math.min(minWeight, entry[1]);
      maxWeight = Math.max(maxWeight, entry[1]);
    }));

    const todayWeight = cleanedData[cleanedData.length - 1][1];

    const netIncrease = todayWeight - minWeight;
    const netDecrease = todayWeight - maxWeight;

    return { todayWeight, netIncrease, netDecrease };
  }

  constructMessage({ todayWeight, netIncrease, netDecrease }) {
    const diffThreshold = 1;
    let isDiff = false;
    let message = `Your most recent weight is ${todayWeight} pounds, which is `;
    if (netIncrease > diffThreshold) {
      isDiff = true;
      message += `up ${Math.round(netIncrease*10)/10} pounds from the thirty day minimum`
      if (netDecrease < -diffThreshold) {
        message += ", and ";
      } else {
        message += "."
      }
    }
    if (netDecrease < -diffThreshold) {
      isDiff = true;
      message += `down ${Math.round(netDecrease * 10) / 10} pounds from the thirty day max.`
    }
    if (!isDiff) {
      message += "largely unchanged over the past thirty days."
    }
    return message;
  }
}

module.exports.IntentClass = WeightInsights;