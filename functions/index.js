const functions = require("firebase-functions");
const express = require("express");

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

app.use(express.json());

// POST requests need to be made via e.g. postman or form
// Browser only makes GET requests
app.post("/", (req, res, next) => {
  if (!req.body.number) {
    res.status(400).send({ message: "Bad request" });
    return;
  }
  res.status(200).send({ number: req.body.number + 5 });
});

exports.api = functions.https.onRequest(app);
