const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const marioModel = require("./models/marioChar");

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// your code goes here
// async function addMario() {
//   const mario = new marioModel({ name: "Luigi", weight: 60 });
//   const result = await mario.save();
// }
// addMario();

app.get("/mario", async (req, res) => {
  res.send(await marioModel.find());
});

app.get("/mario/:id", async (req, res) => {
  try {
    res.send(await marioModel.findById(req.params.id));
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

function isNullOrUndefined(prop) {
  return prop === null || prop === undefined;
}

app.post("/mario", async (req, res) => {
  const newMario = req.body;
  if (isNullOrUndefined(newMario.name) || isNullOrUndefined(newMario.weight)) {
    res.status(400).send({ message: "either name or weight is missing" });
  } else {
    const newMarioDocument = new marioModel(newMario);
    await newMarioDocument.save();
    res.status(201).send(newMarioDocument);
  }
});

app.patch("/mario/:id", async (req, res) => {
  const id = req.params.id;
  const newMario = req.body;
  try {
    const marioInDB = await marioModel.findById(id);
    if (
      isNullOrUndefined(newMario.name) &&
      isNullOrUndefined(newMario.weight)
    ) {
      res.status(400).send({ message: "Both Name And Weight Is Missing" });
    } else {
      if (!isNullOrUndefined(newMario.name)) {
        marioInDB.name = newMario.name;
      }
      if (!isNullOrUndefined(newMario.weight)) {
        marioInDB.weight = newMario.weight;
      }
      await marioInDB.save();
      res.send(marioInDB);
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

app.delete("/mario/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await marioModel.findById(id);
    await marioModel.deleteOne({ _id: id });
    res.send({ message: "character deleted" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = app;
