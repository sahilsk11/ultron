const { Intent } = require("../intent.js");
const axios = require('axios');
require('dotenv').config();

class DomainLookupIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "domain lookup",
      ],
      intentName: "domainLookupIntent"
    });
    this.authorizedForGuest = true;
  }

  async execute() {
    let domain = this.transcript.substring((this.transcript.lastIndexOf("lookup") + "lookup".length + 1));
    domain = domain.split(" ").join("");
    let availability = await this.checkDomainAvailability(domain);

    let message;
    if (availability.DomainInfo.domainAvailability === "AVAILABLE") {
      message = "Domain " + domain + " is available.";
    } else {
      message = "Domain " + domain + " is not available.";
    }
    return { code: 200, message, intent: this.intentName }
  }

  async checkDomainAvailability(domainName) {
    const url = "https://domain-availability.whoisxmlapi.com/api/v1";
    const params = `?apiKey=${process.env.WHOIS_API_KEY}&domainName=${domainName}`;
    const logParams = `?apiKey=<KEY HIDDEN>&domainName=${domainName}`;
    try {
      let response = await axios.get(url + params);
      response = response.data;
      return response;
    } catch (err) {
      if (err.response) {
        // client received an error response (5xx, 4xx)
        throw new Error(`Client error with GET to ${url + logParams}. Originted in domainLookupIntent.`);
      } else if (err.request) {
        // client never received a response, or request never left
        throw new Error(`HTTP error with GET to ${url + logParams}. Originted in domainLookupIntent. Axios error: ${err.toString()} (${err.code})`);
      } else {
        // anything else
        throw new Error(`Unknown request error with GET to ${url + logParams}. Originted in domainLookupIntent. Axios error: ${err.toString()} (${err.code})`);
      }
    }
  }
}

module.exports.IntentClass = DomainLookupIntent;