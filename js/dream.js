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
          "body fat": bodyFat / 100,
          "muscle mass": muscleMass / 100,
          "bone mass": boneMass / 100
        }
      }
    ]
  }
  const url = "https://api.airtable.com/v0/appL5UFlN4QSFyjSo/weight"
  const response = await axios.post(url, data, config);
  console.log(response.status)
}

const getGitCommits = async () => {
  const url = "http://localhost:5000/gitCommits"
  let response = await axios.get(url);
  // {
  //   "code": 200,
  //   "commits": "527"
  // }
  // console.log({ ...response, message: "You have " + response.commits + " commits in the past year." });
  response = response.data;
  return { ...response, message: "You have " + response.commits + " commits in the past year." } 
}

const checkDomainAvailability = async (domainName) => {
  const url = "https://domain-availability.whoisxmlapi.com/api/v1";
  const params = `?apiKey=${process.env.WHOIS_API_KEY}&domainName=${domainName}`;
  console.log(url + params)
  let response = await axios.get(url + params);
  response = response.data;
  console.log(response);
  return response;
}

module.exports = {
  addDailyWeightEntry,
  getGitCommits,
  checkDomainAvailability
}