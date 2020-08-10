const { Intent } = require("../intent.js");
const axios = require("axios");

class TeslaControlIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: [
        "unlock car", "unlock the car", "unlock tesla",
        "honk",
        "flash lights", "flash car lights", "flash tesla lights",
        "where is the car", "where is tesla", "where is the tesla", "tesla location",
        "where's the car", "where's tesla", "where's the tesla",
        "range on the tesla", "range on the car", "battery level of tesla", "battery level of the car",
        "battery level of the tesla", "battery level on the car", "battery level on the tesla",
        "flash car light", "flash tesla light", "flash light",
        "lock the car", "lock the tesla", "lock car", "lock tesla",
        "unlock the car", "unlock the tesla", "unlock car", "unlock tesla"
      ],
      intentName: "teslaControlIntent"
    });
  }

  async execute() {
    let code;
    let message = '';
    if (this.transcript.includes("honk")) {
      const { queryResponseCode } = await this.runQuery("honk");
      code = queryResponseCode;
      message = "Honking now, sir.";
    } else if (this.transcript.includes("where") || this.transcript.includes("location")) {
      const { queryResponseCode, data } = await this.runQuery("drive state");
      code = queryResponseCode;
      message = "Tesla is " + data.substring(0, 1).toLowerCase() + data.substring(1);
    } else if (this.transcript.includes("battery") || this.transcript.includes("charge")) {
      const { queryResponseCode, data } = await this.runQuery("battery state");
      code = queryResponseCode;
      message = data;
    } else if (this.transcript.includes("flash")) {
      const { queryResponseCode } = await this.runQuery("flash");
      code = queryResponseCode;
      message = "Flashing lights now, sir.";
    } else if (this.transcript.includes("unlock")) {
      const { queryResponseCode } = await this.runQuery("unlock");
      code = queryResponseCode;
      message = "Unlocking the Tesla now, sir.";
    } else if (this.transcript.includes("lock")) {
      const { queryResponseCode } = await this.runQuery("lock");
      code = queryResponseCode;
      message = "Locking the Tesla now, sir.";
    }
    return { code: 200, message, intent: this.intentName }
  }

  async runQuery(command) {
    const token = this.getApiKey("TESLA_TOKEN");
    const host = "https://x1z8egdmi2.execute-api.us-east-1.amazonaws.com";
    const endpoint = "/prod/falcon";
    const params = "?command=" + command + "&token=" + token;
    const url = host + endpoint + params;

    const response = await axios.get(url);
    if (response.status === 200) {
      return { code: 200, data: response.data, message: "success" }
    } else {
      return { code: 400, data: response.data, message: "unknown error" };
    }
  }
}

module.exports.IntentClass = TeslaControlIntent;