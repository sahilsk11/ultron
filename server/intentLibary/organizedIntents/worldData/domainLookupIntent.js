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
    console.log(url + params)
    let response = await axios.get(url + params);
    response = response.data;
    console.log(response);
    return response;
  }
}

module.exports.IntentClass = DomainLookupIntent;