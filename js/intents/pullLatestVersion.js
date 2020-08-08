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
        let out = await this.getLatestCommitMessage().split("\n");
        console.log(out);
        message = "Updated to latest version with update notes: \"" + out[1] + "\". Restarting service in 3 seconds...";
      }
      resolve({ code: 200, message, intent: this.intentName });
    }));
    if (this.isProduction()) this.restartPm2();
    
    return response;
  }

  async getLatestCommitMessage() {
    return await new Promise(resolve => exec(command, (error, stdout, stderr) => resolve(stdout)));
  }

  async restartPm2() {
    console.log('here');
    setTimeout(async () => {
      const stopCommand = "pm2 stop endpoint;"
      await new Promise(resolve => exec(stopCommand, (error, stdout, stderr) => {
        resolve();
      }));
      const startCommand = "pm2 start endpoint.js;pwd;";
      await new Promise(resolve => exec(startCommand, (error, stdout, stderr) => {
        console.log(stdout);
        resolve();
      }));
    }, 3000);
  }
}

module.exports.IntentClass = PullLatestVersion;