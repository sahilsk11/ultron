require('dotenv').config();
const fs = require('fs');

function configureAuth(req, res, next) {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
  } else {
    const allowedOrigins = ["https://ultron.sh", "https://www.ultron.sh", "https://ultron.sahilkapur.com"];
    if (allowedOrigins.indexOf(req.headers.origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
  }
  res.setHeader('Access-Control-Allow-Headers', '*');
  const incomingRequestApiKey = req.query.api_key;
  const identity = idenitifyRequest(incomingRequestApiKey);

  if (!identity && req.path !== "/audioFile" && req.path !== "/handleSmsReply") {
    res.json({ code: 403, message: "Invalid credentials" });
  } else {
    req.identity = identity;
    next();
  } 
}

/**
 * Determine the identity of the incoming request. Return the device,
 * or null/undefined if it is an unknown device
 * 
 * @param incomingApiKey  the api key from the incoming request
 */
function idenitifyRequest(incomingApiKey) {
  if (!incomingApiKey) return null;
  const keychain = JSON.parse(fs.readFileSync('keychain.json', 'utf-8'))
  return keychain[incomingApiKey];
}

module.exports = {
  configureAuth
};