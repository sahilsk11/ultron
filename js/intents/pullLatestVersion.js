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
    const command = "git pull;"
    const response = await new Promise(resolve => exec(command, async (error, stdout, stderr) => {
      let message = "";
      if (stdout.includes("Already up-to-date.")) {
        message = "Sir, I am already running the latest version."
      } else {
        let out = await this.getLatestCommitMessage();
        out = out.split("\n");
        message = "Updated to latest version with update notes: \"" + out[0] + "\". Restarting service in 3 seconds...";
      }
      resolve({ code: 200, message, intent: this.intentName });
    }));
    if (this.isProduction()) this.restartPm2();

    return response;
  }

  async getLatestCommitMessage() {
    return await new Promise(resolve => exec("git log -1 --pretty=%B;", (error, stdout, stderr) => resolve(stdout)));
  }

  async restartPm2() {
    setTimeout(async () => {
      const stopCommand = "pm2 stop endpoint; pm2 start endpoint.js";
      await new Promise(resolve => exec(stopCommand, (error, stdout, stderr) => {
        resolve();
      }));
      console.log('service resumed;')
    }, 3000);
  }
}

module.exports.IntentClass = PullLatestVersion;