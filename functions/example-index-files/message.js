// The sample function retrieves the current server time,
// formats the time as specified in a URL query parameter,
// and sends the result in the HTTP response

const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.status(200);
  res.send("hello world");
});

// After the backend is started using the emulator or deploy
// a query string ?text=uppercaseme needs to be added to the end of the function's URL
// This should look something like:
// http://localhost:5001/MY_PROJECT/us-central1/addMessage?text=uppercaseme
// Optionally, you can change the message "uppercaseme" to a custom message.

// Take the text parameter passed to this HTTP endpoint and
// insert it into Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter that was specified in the URL
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
  .document("/messages/{documentId}")
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Firestore.
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log("Uppercasing", context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return snap.ref.set({ uppercase }, { merge: true });
  });

exports.createUser = functions.firestore
  .document("users/{userId}")
  .onCreate((event) => {
    // Get an object representing the document  // e.g. {'name': 'Marie', 'age': 66}
    var newValue = event.data.data();
    // access a particular field as you would any JS property
    var name = newValue.name; // perform desired operations ...
  });
