const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");

var serviceAccount = require("./memcards.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
const newDeck = "users/ByEwGojiQUML6HqdntGx/decks";
const newCard = "users/ByEwGojiQUML6HqdntGx/decks/02b1oSWaOuImQ2de0flj/data";

const app = express();

async function getCard(docId) {
  let results = [];

  await db
    .collection(`users/ByEwGojiQUML6HqdntGx/decks/${docId}/data/`)
    .get()
    .then(snapshot =>
      snapshot.forEach(doc =>
        results.push({ deckId: docId, id: doc.id, ...doc.data() })
      )
    );

  return results;
}

app.get("/api", async (req, res) => {
  let results = [];
  const deckSnapshot = await db.collection(newDeck).get();
  const promises = [];
  deckSnapshot.forEach(doc => {
    const p = getCard(doc.id);
    promises.push(p);
    results.push({ id: doc.id, ...doc.data() });
  });

  const cardData = await Promise.all(promises);

  const dataModel = results.map((deck, index) => ({
    id: deck.id,
    name: deck.name,
    editable: deck.editable,
    data: cardData[index].filter(doc => deck.id === doc.deckId)
  }));

  res.send({ dataModel });
});

app.get("/api/photos", (req, res) => {
  console.log("hit photos route!");
});

exports.memcards = functions.https.onRequest(app);
