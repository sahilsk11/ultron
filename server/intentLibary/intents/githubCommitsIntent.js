const { Intent } = require("../intent.js")
const axios = require('axios');
require('dotenv').config();

class GithubCommitsIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
			regex: [],
      utterances: [
        "github commits",
        "git commit",
        "commits"
      ],
      intentName: "githubCommitsIntent"
    });
  }

	replaceAll(str, matchStr, replaceStr) {
		return str.split(matchStr).join(replaceStr);
	}

	cleanStr(line) {
		let str = line.replace("contributions", "");
		str = this.replaceAll(str, " ", "")
		return this.replaceAll(str, "\t", "");
	}

	async getGithubCommits({username}) {
		const url = "https://github.com/"+username;
		const r = await axios.get(url);
		const text = r.data;
		const lines = text.split("\n");
	
		if (lines[966].toLowerCase().includes("contributions")) {
			return this.cleanStr(lines[966]);
		} else {
			let lineIndex = 0;
			for (; lineIndex < lines.length; lineIndex++) {
				if (lines[lineIndex].includes("in the last year")) {
					return this.cleanStr(lines[lineIndex-1]);
				}
			}
		}
	}

  async execute() {
		const username = "sahilsk11";
		const commits = await this.getGithubCommits({username});
    const message = "You have " + commits + " GitHub commits in the past year."
    return { code: 200, message, intent: this.intentName }
	}
}

module.exports.IntentClass = GithubCommitsIntent;
