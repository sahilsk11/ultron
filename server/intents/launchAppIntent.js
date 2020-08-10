const { Intent } = require("../intent.js")

class LaunchAppIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "launch",
        "google"
      ],
      intentName: "launchAppIntent"
    });
  }

  execute() {
    let url;
    let app;
    let code = 200;
    let message = null;
    if (this.transcript.includes("google")) {
      let cleanedTranscript = this.transcript.replace("google", "");
      url = "https://google.com/search?q=" + cleanedTranscript;
      app = "Google";
    } else if (this.transcript.includes("git")) {
      const repoIndexStart = this.indexOfNextSpace(this.transcript.indexOf("git"), transcript) + 1;
      const repoEndIndex = this.indexOfNextSpace(repoIndexStart, this.transcript);
      const repoName = transcript.substring(repoIndexStart, repoEndIndex);
      url = "https://github.com/sahilsk11/" + repoName;
      app = "GitHub" ;
    } else if (this.transcript.includes("gym") || this.transcript.includes("workout") || this.transcript.includes("lift")) {
      url = "https://gym.sahilkapur.com";
      app = "Lyft";
    } else if (this.transcript.includes("robinhood") || this.transcript.includes("robin hood")) {
      url = "https://robinhood.com";
      app = "Robinhood";
    } else if (this.transcript.includes("twitter")) {
      url = "https://twitter.com";
      app = "Twitter";
    } else if (this.transcript.includes("youtube")) {
     url = "https://youtube.com"
     app = "Twitter";
    } else {
      code = 400;
      message = "Could not find app to launch";
    }
    if (message === null) {
      message = "Launching " + app + "...";
    }
    return { code, message, intent: this.intentName, url, app }
  }
}

module.exports.IntentClass = LaunchAppIntent;