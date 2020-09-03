const express = require("express");
const app = express();
const { configureAuth } = require("./endpoint/middleware");
const controller = require("./endpoint/controllers");
const bodyParser = require("body-parser");

app.listen(8080, () => {
  console.log("Server running on port 8080");
})

//configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(configureAuth);

//define routes
app.get("/setIntent", controller.setIntent);
app.get("/audioFile", controller.getAudioFile);
app.post("/handleSmsReply", controller.handleSmsReply);