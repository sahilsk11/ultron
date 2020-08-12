const { Intent } = require("../intent.js");
const { exec } = require("child_process");

class PullLatestVersion extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["pull latest version", "pull new", "pull the latest version", "download the", "git pull", "run update", "download latest version", "run download"],
      intentName: "pullLatestVersion"
    });
  }

  async execute() {
    let externalRepo = false;
    let repoName;
    if (this.transcript.includes(" on ") || this.transcript.includes(" of ")) {
      const regex = /([a-z]+)$/;
      repoName = regex.exec(this.transcript)[1];
      await this.runCommand("cd ../../" + repoName);
      externalRepo = true;
    } else {
      await this.runCommand("cd ..");
    }
    const fetchOut = await this.runCommand("git remote update; git status -uno;");
    let message;
    let update = false;

    if (fetchOut.includes("Your branch is up-to-date")) {
      const persona = externalRepo ? repoName + " is" : "I am"
      message = `Sir, ${persona} already running the latest version.`
    } else {
      const persona = externalRepo ? repoName + " " : ""
      message = `Updating ${persona}to latest version. Restarting service in 3 seconds...`;
      update = true;
    }

    const pull = async () => {
      await this.sleep(3000);
      console.log(await this.runCommand("git pull; cd -;"));
    }

    if (update) pull();
    return { code: 200, message, intent: this.intentName, update };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async runCommand(command) {
    console.log("> " + command);
    return await new Promise(resolve => exec(command, (error, stdout, stderr) => resolve(stdout)));
  }
}

module.exports.IntentClass = PullLatestVersion;