const { Intent } = require("../intent.js")
// const { MongoClient } = require('mongodb');

class QuoteIntent extends Intent {
  constructor({ transcript, mongoClient }) {
    super({
      transcript,
      regex: "",
      utterances: ["give me a quote", "show me a quote"],
      intentName: "quoteIntent",
      mongoClient
    });
  }

  async execute() {
    const [quote, category] = await this.getQuoteFromDb();
    const message = this.constructMessage(quote, category);
    return { code: 200, message, intent: this.intentName };
  }

  async getQuoteFromDb() {
    const collection = await this.getMongoCollection("quotes");
    const result = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
    return [result[0].quote, result[0].category];
  }

  constructMessage(quote, category) {
    let message = quote;
    const lastChar = quote[quote.length-1];
    if (lastChar !== "." && lastChar !== "!" && lastChar !== "?") {
      message += ". "
    }
    message += " From " + category;
    return message;
  }
}

module.exports.IntentClass = QuoteIntent;