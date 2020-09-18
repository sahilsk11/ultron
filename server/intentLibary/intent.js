const axios = require("axios");
require('dotenv').config();

class UndefinedFunction extends Error {
  constructor(message) {
    super(message);
    this.name = "UndefinedFunction";
  }
}

class Intent {
  constructor({ intentName, transcript, regex, utterances, dbHandler }) {
    this.intentName = intentName;
    this.transcript = transcript;
    this.dbHandler = dbHandler;
    this.regex = regex;
    this.utterances = utterances;
  }

  transcriptMatches() {
    if (this.regex.length > 0) {
      for (let regex of this.regex) {
        if (this.transcript.search(regex) >= 0) {
          return true;
        }
      }
    }
    for (const utterance of this.utterances) {
      if (this.transcript.includes(utterance)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Finds the index of the next " ", or returns str.length if not found
   */
  indexOfNextSpace(startIndex, str) {
    const substr = str.substring(startIndex);
    const spaceIndex = substr.indexOf(" ");
    if (spaceIndex < 0) return str.length;
    return startIndex + spaceIndex;
  }

  indexOfPrevSpace(startIndex, str) {
    let index = startIndex;
    while (index >= 0 && str.substring(index, index + 1) !== ' ') {
      index--;
    }
    return index;
  }

  toCamelCase(str) {
    str = str.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    return str.substr(0, 1).toLowerCase() + str.substr(1);
  }

  getRandomPhrase(phraseArray) {
    return phraseArray[Math.floor(Math.random() * phraseArray.length)]
  }

  async httpRequest({ method, url, authKeyName, body }) {
    let config = {};
    if (authKeyName !== undefined) {
      config = {
        headers: {
          'Authorization': 'Bearer ' + process.env[authKeyName],
          'Content-Type': 'application/json'
        }
      }
    }
    if (!method || method.toLowerCase() === "get") {
      try {
        return await axios.get(url, config);
      } catch (error) {
        console.error(error);
      }
    }
  }

  getApiKey(name) {
    return process.env[name];
  }

  isProduction() {
    return process.env.NODE_ENV === "production";
  }

  handleAxiosError(err, method, url) {
    let errorType;
    if (err.response) {
      // client received an error response (5xx, 4xx)
      errorType = "Client"
    } else if (err.request) {
      errorType = "HTTP"
      // client never received a response, or request never left
    } else {
      // anything else
      errorType = "Unkown request";
    }
    return new Error(`${errorType} error with ${method} to ${url}. Originted in ${this.intentName}. Axios error: ${err.toString()} (${err.code})`);
  }
}

module.exports = { Intent };