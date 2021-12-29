const { Intent } = require("../intent.js");

class WelcomeHomeIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['daddys home', 'im home', "daddy's home", "i'm home"],
      intentName: "welcomeHomeIntent",
      dbHandler
    });
  }

  async execute() {
    const apiKey = process.env.KNOX_KEY;
    const config = {
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      }
    }
    await axios.post(
      "http://localhost:8000/scenes/downstairsLightsOn",
      {}, config
    )
    let message = "Welcome home, sir. Lighting up the casa."
    return { code: 200, message, intent: this.intentName }
  }

}

module.exports.IntentClass = WelcomeHomeIntent;