const { Intent } = require("../intent.js");
const axios = require('axios');

class AddWeightIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
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
    const { weight, bmi, bodyFat, muscleMass, boneMass, success, missingEntry } = this.extractMeasurements();

    let message;
    if (!success) {
      message = "Invalid weight entry - " + missingEntry + " data missing";
    } else {
      const data = {
        records: [
          {
            fields: {
              "weight (lbs)": weight,
              "bmi": bmi,
              "body fat": bodyFat / 100,
              "muscle mass": muscleMass / 100,
              "bone mass": boneMass / 100,
              "date1": new Date()
            }
          }
        ]
      }
      console.log(data);
      const url = "https://api.airtable.com/v0/appL5UFlN4QSFyjSo/weight"
      let response;
      try {
        response = await axios.post(url, data, config);
      } catch (err) {
        console.error(err.message)
      }

      if (response.status === 200) {
        message = "Weight entry successfully added.";
      } else {
        message = "There was an error while processing.";
      }
    }
    return { code: 200, message, intent: this.intentName }
  }

  extractMeasurements() {
    const cleanedTranscript = this.cleanTranscript();
    const regexValues = {
      weight: /weight[a-z]* (1[0-9]+\.*[0-9]*) lb/g,
      bmi: /bmi (1[0-9]+\.*[0-9])/g,
      muscleMass: /muscle mass ([0-9]+\.*[0-9]*)/g,
      boneMass: /bone mass ([0-9]+\.*[0-9]*)/g,
      bodyFat: /body fat ([0-9]+\.*[0-9]*)/g,
    }
    const values = {};
    let success = true;
    let missingEntry;
    for (const valueName in regexValues) {
      const value = this.extract(regexValues[valueName], cleanedTranscript);
      if (value === null) {
        success = false;
        missingEntry = valueName;
      }
      values[valueName] = value;
    }
    console.log(values);
    return { ...values, success, missingEntry };
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
    console.log(cleanTranscript);
    return cleanTranscript;
  }
}

module.exports.IntentClass = AddWeightIntent; //TO-DO change name