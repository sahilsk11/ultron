const { Intent } = require("../intent.js");
const axios = require('axios');

class AddWeightIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: [],
      utterances: ["add weight"],
      intentName: "addWeightIntent"
    });
  }

  async execute() {
    const apiKey = this.getApiKey("AIRTABLE_DREAM_API_KEY");
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }
    const { weight, bmi, bodyFat, muscleMass, boneMass } = this.extractMeasurements();

    const data = {
      records: [
        {
          fields: {
            "weight (lbs)": weight,
            "bmi": bmi,
            "body fat": bodyFat / 100,
            "muscle mass": muscleMass / 100,
            "bone mass": boneMass / 100,
            "date": new Date()
          }
        }
      ]
    }
    const url = "https://api.airtable.com/v0/appL5UFlN4QSFyjSo/weight";
    
    let response;
    try {
      response = await axios.post(url, data, config);
    } catch(err) {
      throw this.handleAxiosError(err, "POST", url);
    }
    const message = "Weight entry successfully added.";
    return { code: 200, message, intent: this.intentName }
  }

  extractMeasurements() {
    const cleanedTranscript = this.cleanTranscript();
    const splitScript = cleanedTranscript.split(" ");
    return this.attemptRangeRead(splitScript);
  }

  attemptRangeRead(splitScript) {
    const measurements = {
      weight: {
        fieldName: "weight (lbs)",
        min: 100,
        max: 200
      },
      bmi: {
        fieldName: "bmi",
        min: 15,
        max: 25
      },
      bodyFat: {
        fieldName: "body fat",
        min: 6.3,
        max: 20
      },
      muscleMass: {
        fieldName: "muscle mass",
        min: 45,
        max: 70,
      },
      boneMass: {
        fieldName: "bone mass",
        min: 3,
        max: 6
      }
    }
    const out = {}
    for (const word of splitScript) {
      if (!isNaN(word)) {
        const measurement = Number(word);
        for (const [key, value] of Object.entries(measurements)) {
          if (measurement >= value.min && measurement <= value.max) {
            out[key] = measurement;
          }
        }
      }
    }
    return out;
  }

  extract(regex, cleanedTranscript) {
    const matches = regex.exec(cleanedTranscript)
    if (matches === null) {
      return null;
    }
    return Number(matches[1]);
  }

  cleanTranscript() {
    const replacements = {
      " is ": " "
    }
    let cleanTranscript = this.transcript;
    for (const replacement in replacements) {
      cleanTranscript = cleanTranscript.split(replacement).join(replacements[replacement]);
    }
    return cleanTranscript;
  }
}

module.exports.IntentClass = AddWeightIntent;