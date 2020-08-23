/**
 * This is NOT A REAL INTENT and is used as a sample for what an intent will look like
 * 
 * Note that the pathname for intent.js is relative and will fail if not placed in the
 * intents/ folder.
 * 
 * 
 */

const { Intent } = require("../intent.js");

class InterviewPrepTracker extends Intent {
  constructor({ transcript }) {
    super({
      transcript,
      regex: "",
      utterances: ["leetcode stats", "hackerrank stats"],
      intentName: "interviewPrepTracker"
    });
  }

  async execute() {
    // const addQuestionsUtterances = ["solved ", "completed ", "did ", "finished "];
    // const overallProgressUtterances = ["how many", "stats"];
    // for 
    // let message;
    // message = `You've completed ${} easy questions, ${} mediums, and ${} hard.`
    // return { code: 200, message, intent: this.intentName }
  }

  async getInterviewQuestionStats() {
    return {easy, medium, hard};
  }
}

module.exports.IntentClass = InterviewPrepTracker;