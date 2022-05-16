const express = require("express");
const { getTopics } = require("./controllers/controller")

const app = express();
app.use(express.json());

//GET

app.get("/api/topics", getTopics);

//ERROR HANDLING
app.use("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

module.exports = app;