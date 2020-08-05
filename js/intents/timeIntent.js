const { Intent } = require("../intent.js");

class TimeIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["time", "sunset", "sunrise"],
      intentName: "timeIntent"
    });
    this.timeZoneOffset = -7;
  }

  async execute() {
    let now = new Date();
    now = this.utcToPst(now);
    console.log(now);
    console.log(now.getHours());

    const timeString = this.constructTimeString(now);
    const { sunrise, sunset } = await this.getDayInformation();
    const snarkyMessage = this.constructMessage(now, sunrise, sunset);
    let message = "It is " + timeString + snarkyMessage;
    return { code: 200, message, intent: this.intentName }
  }

  constructTimeString(now) {
    let hour = now.getHours();
    const pm = hour < 12 ? " A.M. " : " P.M. ";
    hour = hour % 12 === 0 ? 12 : hour % 12;
    const min = now.getMinutes();
    return hour + ":" + min + pm;
  }

  /**
   * Based on the current time, construct some snarky message
   * @param hour as 0-23 hr time
   */
  constructMessage(now, sunriseTime, sunsetTime) {
    const hour = now.getHours();
    if (hour < 4) {
      return "The night, or should I say day, is young, sir.";
    } else if (hour < 6) {
      return "Sir, I do insist you sleep soon. Sunrise is at " + this.constructTimeString(sunriseTime);
    } else if (hour < 11) {
      return "Good to see you up, sir.";
    } else if (hour < 5) {
      return "Have a pleasant afternoon, sir";
    } else if (hour < 8) {
      return "Have a pleasant evening, sir. Sunset is at " + this.constructMessage(sunsetTime);
    } else {
      return "";
    }
  }

  async getDayInformation() {
    const url = "https://api.sunrise-sunset.org/json?lat=37.293321&lng=-121.776083&formatted=0";
    const response = await this.httpRequest({ url, method: "GET" });
    let { sunrise, sunset, dayLength } = response.data.results;
    // sunrise = this.utcToPst(sunrise);
    // sunset = this.utcToPst(sunset);
    return { sunrise: new Date(sunrise), sunset: new Date(sunset) };
  }

  utcToPst(d) {
    d = new Date();
    console.log(d.getHours())
    d.setHours(d.getHours() + this.timeZoneOffset);
    console.log(d.getHours())
    return d;
  }
}

new TimeIntent({ transcript: "" }).execute();

module.exports.IntentClass = TimeIntent;