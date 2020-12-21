const { Intent } = require("../intent.js");
const axios = require('axios');

class SendTextIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['initate text', 'text me', 'send me a text'],
      intentName: "sendTextIntent",
      dbHandler
    });
  }

  async execute() {
    console.log(this.getApiKey("MY_PHONE_NUMBER"))
    const smsResponse = await axios.post('https://textbelt.com/text', {
      phone: this.getApiKey("MY_PHONE_NUMBER"),
      message: "Hello from Ultron",
      key: this.getApiKey("TEXT_KEY"),
      replyWebhookUrl: 'https://www.ultron.sh/server/handleSmsReply?api_key=' + this.getApiKey("TEXT_AUTH")
    });
    
    let message = "Message sent.";
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = SendTextIntent;