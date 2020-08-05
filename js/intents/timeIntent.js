const { Intent } = require("../intent.js");
const moment = require("moment");

class TimeIntent extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["time", "sunset", "sunrise"],
      intentName: "timeIntent"
    });
    this.timeOffset = -7; //check for timezone change
  }

  async execute() {
    const time = this.getCurrentTime(this.timeOffset);

    const timeString = this.constructTimeString(time);
    const { sunrise, sunset } = await this.getDayInformation();
    const snarkyMessage = this.constructMessage(time, sunrise, sunset);
    let message = "It is " + timeString + " " + snarkyMessage;
    return { code: 200, message, intent: this.intentName }
  }

  constructTimeString(time) {
    const hour = time.hour % 12 === 0 ? 12 : time.hour % 12;
    return hour + ":" + time.minutes + " " + time.timeOfDay;
  }

  /**
   * Based on the current time, construct some snarky message
   * @param hour as 0-23 hr time
   */
  constructMessage(time, sunriseTime, sunsetTime) {
    const { hour, unixTime} = time;
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

  getCurrentTime(offset) {
    const now = new moment().utc();
    return {
      hour: now.hours() + offset,
      minutes: now.minutes(),
      seconds: now.seconds(),
      timeOfDay: (now.hours() + offset) < 12 ? "A.M." : "P.M.",
      unixTimeStamp: now.valueOf()
    }
  }
}

new TimeIntent({ transcript: "" }).execute();

module.exports.IntentClass = TimeIntent;