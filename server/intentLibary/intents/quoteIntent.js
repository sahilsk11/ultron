const { Intent } = require("../intent.js")

class QuoteIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: "",
      utterances: ["give me a quote", "show me a quote"],
      intentName: "quoteIntent",
      dbHandler,
    });
    this.authorizedForGuest = true;
  }

  async execute() {
    const [quote, category] = await this.getQuoteFromDb();
    const message = this.constructMessage(quote, category);
    return { code: 200, message, intent: this.intentName };
  }

  async getQuoteFromDb() {
    const collection = await this.dbHandler.getCollection("ultron", "quotes");
    const result = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
    return [result[0].quote.trim(), result[0].category];
  }

  constructMessage(quote, category) {
    let message = quote;
    const lastChar = quote[quote.length - 1];
    if (lastChar !== "." && lastChar !== "!" && lastChar !== "?") {
      message += ". "
    }
    message += " From " + category;
    return message;
  }
}

module.exports.IntentClass = QuoteIntent;