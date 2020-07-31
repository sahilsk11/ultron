const { Intent } = require("../intent.js")
const axios = require('axios');
require('dotenv').config();

class GithubCommitsIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "github commits",
        "git commit",
        "commits"
      ],
      intentName: "githubCommitsIntent"
    });
  }

  async execute() {
    const url = "http://localhost:5000/gitCommits"
    let response = await axios.get(url);
    response = response.data;
    const message = "You have " + response.commits + " GitHub commits in the past year."
    return { code: 200, message, intent: this.intentName, ...response }
  }
}

module.exports.IntentClass = GithubCommitsIntent;