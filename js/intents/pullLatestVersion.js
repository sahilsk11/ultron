const { Intent } = require("../intent.js");
const { exec } = require("child_process");
const { resolve } = require("path");

class PullLatestVersion extends Intent { // TO-DO change name
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["pull latest version", "pull new", "update", "pull the latest version"],
      intentName: "pullLatestVersion"
    });
  }

  async execute() {
    const command = "git pull;"
    const response = await new Promise(resolve => exec(command, (error, stdout, stderr) => {
      const out = stdout;
      let message = "";
      if (out.includes("Already up-to-date.")) {
        message = "Sir, I am already running the latest version."
      }
      //console.log("'" + out + "'");
      resolve({ code: 200, message, intent: this.intentName });
    }));
    return response;
  }
}

module.exports.IntentClass = PullLatestVersion; //TO-DO change name