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

app.get("/mario", (req, res) => {
  async function getMarioFromDB() {
    const result = await marioModel.find();
    console.log(result);
    res.send(result);
  }
  getMarioFromDB();
});

app.get("/mario/:id", (req, res) => {
  async function getMarioFromDB() {
    try {
      const result = await marioModel.findOne({ _id: req.params.id });
      res.send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
  getMarioFromDB();
});

app.post("/mario", (req, res) => {
  function isNullOrUndefined(prop) {
    return prop === null || prop === undefined;
  }
  async function postMarioInDB() {
    try {
      if (
        isNullOrUndefined(req.body.name) ||
        isNullOrUndefined(req.body.weight)
      ) {
        return res
          .status(400)
          .send({ message: "either name or weight is missing" });
      }
      const mario = new marioModel({
        name: req.body.name,
        weight: req.body.weight,
      });
      const result = await mario.save();
      res.status(201).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
  postMarioInDB();
});

app.patch("/mario/:id", (req, res) => {
  async function patchMarioInDB() {
    try {
      const result = await marioModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          weight: req.body.weight,
        },
        { new: true }
      );
      res.send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
  patchMarioInDB();
});

app.delete("/mario/:id", (req, res) => {
  async function deleteMarioFromDB() {
    try {
      const result = await marioModel.findOneAndDelete({ _id: req.params.id });
      res.status(200).send({ message: "character deleted" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
  deleteMarioFromDB();
});

module.exports = app;
