const axios = require("axios");
require('dotenv').config();

class UndefinedFunction extends Error {
  constructor(message) {
    super(message);
    this.name = "UndefinedFunction";
  }
}

class Intent {
  constructor({ intentName, transcript, regex, utterances }) {
    this.intentName = intentName;
    this.transcript = transcript
    this.intentDefinition = {
      regex,
      utterances
    }
  }

  transcriptMatches() {
    for (const utterance of this.intentDefinition.utterances) {
      if (this.transcript.includes(utterance)) {
        return true;
      }
    }
    return false;
  }

  execute() {
    throw new UndefinedFunction("The execute method has not been defined for this class.");
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
}

module.exports = { Intent };