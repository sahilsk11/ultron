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
      let message;
      if (out.length <= 1) {
        message = "Sir, I am already running the latest version."
      } else {
        message = "Updating to latest version. Restarting service in 3 seconds...";
      }
      resolve({ code: 200, message, intent: this.intentName });
      await this.sleep(3000);
      this.pullLatestVersion();
    }));
    return response;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async pullLatestVersion() {
    return await new Promise(resolve => exec("git pull;", (error, stdout, stderr) => resolve(stdout)));
  }

  async getLatestCommitMessage() {
    return await new Promise(resolve => exec("git log -1 --pretty=%B;", (error, stdout, stderr) => resolve(stdout)));
  }
}

module.exports.IntentClass = PullLatestVersion;