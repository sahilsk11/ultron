/**
 * Convert raw string input to corrected text based on known errors in STT
 * @param {transcript: str} 
 */
const correctTranscript = ({ transcript }) => {
  return transcript;
}

/**
 * Convert corrected intent transcript into matched intents string
 * 
 * @param {transcript: str}
 * 
 * @return string name of the intent
 */
const intentParser = ({ transcript }) => {
  const intents = {
    "addWeight": {
      utterances: ["add weight", "how much i weigh"]
    }
  }
  for (const intent in Object.keys(intents)) {
    for (const utterance of intents[intent].utterances) {
      if (transcript.toLowerCase().includes(utterance)) {
        return intent;
      }
    }
  }
}

const intentRouter = ({ intent, transcript }) => {
  switch (intent) {
    case "addWeight": return addWeightIntent({ transcript });
  }
}

/**
 * Accept corrected data transcript and convert request into JSON
 * 
 * @param {transcript: str} 
 */
const addWeightIntent = ({ transcript }) => {
  let intentBody = {};
  transcript = transcript.toLowerCase();
  const metrics = ["weight", "bmi", "muscle mass", "bone mass", "body fat"];
  for (const metric of metrics) {
    const metricNameStartIndex = transcript.lastIndexOf(metric);
    if (metricNameStartIndex >= 0) {
      const metricValueStartIndex = metricNameStartIndex + metric.length + 1; //second char after metric name; could be out of bounds
      if (metricValueStartIndex < transcript.length) {
        const metricValueEndIndex = indexOfNextSpace(metricValueStartIndex, transcript);
        const metricValue = transcript.substring(metricValueStartIndex, metricValueEndIndex)
        intentBody[toCamelCase(metric)] = Number(metricValue);
      }
    }
  }
  return intentBody;
}


/* Helper functions */

/**
 * Finds the index of the next " ", or returns str.length if not found
 * @param  startIndex: int
 * @param  str: str
 */
const indexOfNextSpace = (startIndex, str) => {
  const substr = str.substring(startIndex);
  const spaceIndex = substr.indexOf(" ");
  if (spaceIndex < 0) return str.length;
  return startIndex + spaceIndex;
}

const toCamelCase = (str) => {
  str = str.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  return str.substr(0, 1).toLowerCase() + str.substr(1);
}

module.exports = {
  addWeightIntent
}