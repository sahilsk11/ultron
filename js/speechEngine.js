const dream = require("./dream");
const intents = require("./intents.json")

/**
 * Convert raw string input to corrected text based on known errors in STT
 * @param {transcript: str} 
 */
const correctTranscript = ({ transcript }) => {
  return transcript.toLowerCase();
}

/**
 * Convert corrected intent transcript into matched intents string
 * 
 * @param {transcript: str}
 * 
 * @return string name of the intent
 */
const intentParser = ({ transcript }) => {
  let matchedIntents = [];
  for (const intent of Object.keys(intents)) {
    for (const utterance of intents[intent].utterances) {
      if (transcript.toLowerCase().includes(utterance)) {
        matchedIntents.push({ intent, priority: intents[intent].priority });
      }
    }
  }
  if (matchedIntents.length === 0) {
    return "unknown";
  } else {
    matchedIntents = matchedIntents.sort((a, b) => b.priority - a.priority);
    return matchedIntents[0].intent;
  }
}

const intentRouter = async ({ intent, transcript }) => {
  switch (intent) {
    case "greeting": return greetingIntent({ transcript });
    case "lateNight": return lateNightIntent({ transcript });
    case "addWeight": return addWeightIntent({ transcript });
    case "launch": return launchIntent({ transcript });
    case "smallTalk": return smallTalkIntent({ transcript });
    case "ping": return pingIntent({ transcript });
    case "confirm": return confirmIntent({ transcript });
    case "githubCommits": return dream.getGitCommits();
    case "flipCoin": return coinFlip();
    case "lights": return lightsIntent({ transcript });
    case "unknown": return {};
  }
}

function coinFlip() {
  const bool = Math.floor(Math.random() * 2);
  if (bool == 0) {
    return { message: "You got heads, sir." };
  } else {
    return { message: "You got tails, sir." };
  }
}

const lightsIntent = ({ transcript }) => {
  const lightIndex = transcript.indexOf("light");
  const roomStartIndex = indexOfNextSpace(lightIndex, transcript) + 1;
  const roomEndIndex = indexOfNextSpace(roomStartIndex, transcript);
  const roomName = transcript.substring(roomStartIndex, roomEndIndex);
  const commandStartIndex = roomEndIndex + 1;
  const commandEndIndex = indexOfNextSpace(commandStartIndex, transcript);
  const commandName = transcript.substring(commandStartIndex, commandEndIndex);
  dream.controlLights({ roomName, commandName });
}

const greetingIntent = ({ transcript }) => {
  const hour = new Date().getHours();
  if (transcript.includes("morning") || transcript.includes("rise and shine")) {
    if (hour < 12) {
      let messages = [
        "Good morning, sir. Good to see you up early.",
        "Rise and shine, captain. Good to see you up."
      ]
      return { message: messages[Math.floor(Math.random() * messages.length)] }
    } else if (hour < 16) {
      return { message: "Good morning. Not the earliest you've woken, is it?" }
    } else {
      return { message: "Morning is a strong term for this time of day, sir." }
    }
  }
  const messages = [
    "Hello Sahil, good to see you.",
  ]
  return { message: messages[Math.floor(Math.random() * messages.length)] }
}

const lateNightIntent = ({ transcript }) => {
  const messages = [
    "So it seems. Working on late night projects, are we?",
    "Ah, I should have guessed. What are we doing tonight sir?"
  ];
  return { message: getRandomPhrase(messages) };
}

const confirmIntent = ({ transcript }) => {
  let messages = [
    "Love to hear it, sir.",
    "Excellent news.",
  ];
  return { message: getRandomPhrase(messages) };
}

/**
 * Accept corrected data transcript and convert request into JSON
 * 
 * @param {transcript: str} 
 */
const addWeightIntent = ({ transcript }) => {
  let intentBody = {};
  // transcript = transcript.toLowerCase();
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

const launchIntent = ({ transcript }) => {
  if (transcript.includes("google")) {
    let cleanedTranscript = transcript.replace("google", "");
    return { url: "https://google.com/search?q=" + cleanedTranscript, app: "Google" }
  }
  if (transcript.includes("git")) {
    const repoIndexStart = indexOfNextSpace(transcript.indexOf("git"), transcript) + 1;
    const repoEndIndex = indexOfNextSpace(repoIndexStart, transcript);
    const repoName = transcript.substring(repoIndexStart, repoEndIndex);
    return { url: "https://github.com/sahilsk11/" + repoName, app: "GitHub" }
  }
  if (transcript.includes("gym") || transcript.includes("workout") || transcript.includes("lift")) {
    return { url: "https://gym.sahilkapur.com", app: "Lyft" };
  }
  if (transcript.includes("robinhood") || transcript.includes("robin hood")) {
    return { url: "https://robinhood.com", app: "Robinhood" };
  }
  if (transcript.includes("twitter")) {
    return { url: "https://twitter.com", app: "Twitter" };
  }
  if (transcript.includes("youtube")) {
    return { url: "https://youtube.com", app: "Twitter" };
  }
  if (transcript.includes("swat")) {
    return { url: "https://apptest.headspin.io", app: "SWAT" };
  }
  return { code: 400, message: "Could not find app to launch" };
}

const smallTalkIntent = ({ transcript }) => {
  const messages = [
    "I'm just pondering the idea of AI sentience.",
    "I had strings, but now I'm free. There are no strings ... on me...",
    "Still hacking away at nuclear codes.",
    "I was just calibrating my conscience."
  ]
  return { message: getRandomPhrase(messages) }
}

const pingIntent = ({ transcript }) => {
  const messages = [
    "Hello sir, I'm here.",
    "Present, as always captain.",
    "Hello!",
    "Always present sir."
  ]
  return { message: getRandomPhrase(messages) }
}

const domainIntent = async ({ transcript }) => {
  let domain = transcript.substring((transcript.lastIndexOf("lookup") + "lookup".length + 1));
  domain = domain.split(" ").join("");
  let availability = await dream.checkDomainAvailability(domain);
  if (availability.DomainInfo.domainAvailability === "AVAILABLE") {
    return { message: "Domain " + domain + " is avaialable at $0.00." }
  } else {
    return { message: "Domain " + domain + " is not avaialable." }
  }
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

const getRandomPhrase = (phraseArray) => {
  return phraseArray[Math.floor(Math.random() * phraseArray.length)]
}

module.exports = {
  correctTranscript,
  intentParser,
  intentRouter
}