const { Intent } = require("../intent.js");
const { exec } = require("child_process");

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
    const command = "git fetch;"
    const response = await new Promise(resolve => exec(command, async (error, stdout, stderr) => {
      let out = stdout.split("\n");
      if (out.length <= 1) {
        message = "Sir, I am already running the latest version."
      } else {
        await this.pullLatestVersion();
        out = await this.getLatestCommitMessage();
        out = out.split("\n");
        message = "Updated to latest version with update notes: \"" + out[0] + "\". Restarting service in 3 seconds...";
      }
      
      resolve({ code: 200, message, intent: this.intentName });
    }));

    return response;
  }

  async pullLatestVersion() {
    return await new Promise(resolve => exec("git pull;", (error, stdout, stderr) => resolve(stdout)));
  }

  async getLatestCommitMessage() {
    return await new Promise(resolve => exec("git log -1 --pretty=%B;", (error, stdout, stderr) => resolve(stdout)));
  }
}

module.exports.IntentClass = PullLatestVersion;