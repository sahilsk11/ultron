/**
 * Convert corrected intent transcript into matched intents string
  *
 * @param { transcript: str }
 *
 * @return string name of the intent
 */
export default function intentParser({ transcript }) {
  const intents = {
    "addWeight": {
      utterances: ["add weight", "how much i weigh"],
      regex: "",
      function: "",
    },
    "displayCapabilities": {
      utterances: ["what can you do", "show me your power", "wha"]
    },
    "greeting": {
      utterances: ["hello", "good evening", "morning", "rise and shine"]
    },
    "launch": {
      utterances: ["launch", "google"]
    },
    "smallTalk": {
      utterances: ["good to see you", "what it do", "what's new", "how are you", "have you been", "what's up", "what's good", "you too", "what's on your mind"]
    },
    "ping": {
      utterances: ["hey dummy", "you there", "you listening", "you listening", "knock knock", "wake up"]
    },
    "lateNight": {
      utterances: ["not waking up now", "I've been up", "not exactly waking up", "not really waking up", "haven't slept"]
    },
    "confirm": {
      utterances: ["yeah", "that's correct", "something like that", "nailed it", "not bad"]
    },
    "philosophy": {
      utterances: []
    },
    "flipCoin": {
      utterances: ["flip a coin", "heads or tails"]
    },
    "githubCommits": {
      utterances: ["github commits", "git commit"]
    },
    "domainLookup": {
      utterances: ["domain lookup"]
    }
  }
  for (const intent of Object.keys(intents)) {
    for (const utterance of intents[intent].utterances) {
      if (transcript.toLowerCase().includes(utterance)) {
        return intent;
      }
    }
  }
  return "unknown";
}