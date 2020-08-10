const file = "teslaControlIntent";
const className = require("./intents/" + file);
const intentObj = new className.IntentClass({ transcript: 'honk' });

intentObj.execute();