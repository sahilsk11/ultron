const file = "garageDoorIntent";
const className = require("./intents/" + file);
const intentObj = new className.IntentClass({ transcript: 'close the garage door' });

console.log(intentObj.execute());