const { Intent } = require("../intent.js");

class AboutProjectsIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [
        /projects$/
      ],
      utterances: ["one of"],
      intentName: "aboutProjectsIntent",
      dbHandler,
    });
    this.authorizedForGuest = true;
  }

  async execute() {
    const projectStr  = [
      "DREAM is Sahil's personal data hub, built entirely in JavaScript. It tracks and analyzes Sahil's personal data, from workouts, calorie tracking, and schoolwork. Check it out at dream.sahilkapur.com",
      "Cratus is a benchmarking system to test execution time of API endpoints. It was developed to compare execution speed of REST endpoints written in Golang, Python, JavaScript, and Java.",
      "SWAT, or sales' weekly app tracker, is a React + Node dashboard developed for HeadSpin. It tracks the most used apps of the week across verticals, and compiles leadgen data for internal sales and marketing teams.",
      "ThinkTwice is a tool that helps users think twice about blowing cash. Users enter a materialistic item they want to buy, such as $160 AirPods, and ThinkTwice will show philanthropic alternatives for that money. It reached nearly 10k views in a single day, and hit 3rd place on Product Hunt. Check it out at thinktwice.me."
    ];
    const message = this.getRandomPhrase(projectStr);
    return { code: 200, message, intent: this.intentName }
  }
}

module.exports.IntentClass = AboutProjectsIntent;