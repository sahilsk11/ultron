const { Intent } = require("../intent.js");

class AboutSahilIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [
        /tell me about [a-z]+$/
      ],
      utterances: ['what can sahil do', 'about sahil'],
      intentName: "aboutSahilIntent",
      dbHandler
    });
    this.authorizedForGuest = true;

  }

  async execute() {
    let message = "Sahil is a 3rd year undergrad at Purdue University. He loves building and shipping side projects, and recently started live-coding on Twitch. Check out more at sahilkapur.com.";
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = AboutSahilIntent;