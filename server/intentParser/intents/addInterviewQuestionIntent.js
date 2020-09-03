const { Intent } = require("../intent.js");
const axios = require('axios');

class AddInterviewQuestionIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["leetcode", "hackerrank"],
      // I just completed a leetcode hard
      // add a leetcode hard to interview prep
      intentName: "addInterviewQuestionIntent"
    });
  }

  async execute() {
    let regex = /leetcode|hackerrank/;
    const platform = regex.exec(this.transcript)[0];
    regex = /([a-z]+)$/;
    const difficulty = regex.exec(this.transcript)[1];
    const code = await this.addQuestion({ platform, difficulty });

    let messages;
    if (code == 200) {
      messages = [
        "Entry added. Great job, sir.",
        "Excellent work, sir. Entry added.",
        "Very well, sir. Entry added."
      ]
    } else {
      messages = ["There was an error adding the entry."];
    }
    const message = this.getRandomPhrase(messages);
    return { code: 200, message, intent: this.intentName }
  }

  async addQuestion({ platform, difficulty }) {
    const apiKey = this.getApiKey("AIRTABLE_DREAM_API_KEY");
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }
    const data = {
      records: [
        {
          fields: {
            platform,
            difficulty,
            "date": new Date()
          }
        }
      ]
    }
    const url = "https://api.airtable.com/v0/appbHwGNyezWOx97Y/Prep";
    let response;
    try {
      response = await axios.post(url, data, config);
    } catch (err) {
      console.error(err.message)
    }

    return response.status;
  }
}

module.exports.IntentClass = AddInterviewQuestionIntent;