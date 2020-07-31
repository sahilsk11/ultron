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
    let rawdata = fs.readFileSync('out.json');
    let lines = JSON.parse(rawdata);
    const line = lines[Math.floor(Math.random() * lines.length)];
    console.log('done');
    return { code: 200, message: line.quote + " (" + line.category + ")", intent: this.intentName };
  }
}

module.exports.IntentClass = QuoteIntent;