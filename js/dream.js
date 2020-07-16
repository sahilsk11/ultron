const axios = require('axios');
require('dotenv').config();

const addDailyWeightEntry = async ({ weight, bmi, bodyFat, muscleMass, waterMass, boneMass }) => {
  const apiKey = process.env.AIRTABLE_DREAM_API_KEY;
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
          "weight (lbs)": weight,
          "bmi": bmi,
          "body fat": bodyFat/100,
          "muscle mass": muscleMass/100,
          "bone mass": boneMass/100
        }
      }
    ]
  }
  const url = "https://api.airtable.com/v0/appL5UFlN4QSFyjSo/weight"
  const response = await axios.post(url, data, config);
  console.log(response.status)
}

module.exports = {
  addDailyWeightEntry
}