const { Intent } = require("../intent.js");
const { exec } = require("child_process");

class PullLatestVersion extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["pull latest version", "pull new", "pull the latest version", "download the", "git pull", "run update"],
      intentName: "pullLatestVersion"
    });
  }

  async execute() {
    const fetchOut = await this.runCommand("git remote update; git status -uno;");
    let message;
    let update = false;

    if (fetchOut.includes("Your branch is up-to-date")) {
      message = "Sir, I am already running the latest version."
    } else {
      message = "Updating to latest version. Restarting service in 3 seconds...";
      update = true;
    }

    const pull = async () => {
      await this.sleep(3000);
      console.log(this.runCommand("git pull;"));
    }
    
    if (update) pull();

    return { code: 200, message, intent: this.intentName, update };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runCommand(command) {
    return await new Promise(resolve => exec(command, (error, stdout, stderr) => resolve(stdout)));
  }
}

module.exports.IntentClass = PullLatestVersion;