const { Intent } = require("../intent.js");
const { exec } = require("child_process");
const { resolve } = require("path");

class PullLatestVersion extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["pull latest version", "pull new", "update", "pull the latest version"],
      intentName: "pullLatestVersion"
    });
  }

  async execute() {
    const command = "git pull; git log -1 --pretty=%B;"
    const response = await new Promise(resolve => exec(command, (error, stdout, stderr) => {
      let message = "";
      if (stdout.includes("Already up-to-date.")) {
        message = "Sir, I am already running the latest version."
      } else {
        let out = stdout.split("\n");
        message = "Updated to latest version with update notes: \"" + out[1] + "\"";
      }
      console.log("'" + out.split("\n") + "'");
      resolve({ code: 200, message, intent: this.intentName });
    }));
    return response;
  }
}

module.exports.IntentClass = PullLatestVersion;