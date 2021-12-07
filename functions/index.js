const functions = require("firebase-functions");
const express = require("express");
const { getFirestore } = require("firebase-admin/firestore");
const https = require("https");

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

const db = getFirestore();

// Adapt the options based on API
const options = {
  host: "api.somesite.io",
  path: "/some-path/",
  headers: {
    Authorization: "Basic admin:test",
  },
};

db.collection("alarms").onSnapshot((querySnapshot) => {
  querySnapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      https
        .get(options, (response) => {
          response.on("data", function (chunk) {
            console.log(JSON.parse(chunk));
            db.collection("/alarms")
              .doc(change.doc.id)
              .update({ alarm: JSON.parse(chunk).alarm });
          });
        })
        .end();
    }
  });
});

exports.api = functions.https.onRequest(app);
