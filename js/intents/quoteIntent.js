const { Intent } = require("../intent.js")
const fs = require('fs');

class QuoteIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["me a quote"],
      intentName: "quoteIntent"
    });
  }

  execute() {
    let rawdata = fs.readFileSync('./out.json');
    let lines = JSON.parse(rawdata);
    const line = lines[Math.floor(Math.random() * lines.length)];
    //let q = '"Writing is the most scalable professional networking activity - stay home, don’t go to events/conferences, and just put ideas down. Building your network, your audience, and your ideas will be something you’ll want to do over your entire career. Think of your writing like a multi-decade project." - perell.com (Linus on Entrepreneurship, Business, Design, and Life )';
    let q = line.quote + " (" + line.category + ")";
    return { code: 200, message: q , intent: this.intentName };
  }
}

console.log(new QuoteIntent({ transcript: "" }).execute());

module.exports.IntentClass = QuoteIntent;