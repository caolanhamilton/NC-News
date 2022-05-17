
const express = require("express");
const { getTopics, getArticleByID, patchArticleVotes, getUsernames } = require("./controllers/controller")
const { handlePSQLErr, handleCustomErr, handleInternalServerErr, } = require("./controllers/error.controllers")

const app = express();
app.use(express.json());

//GET

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsernames);

//PATCH
app.patch("/api/articles/:article_id", patchArticleVotes)

//ERROR HANDLING
app.use("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use(handlePSQLErr);

app.use(handleCustomErr);

app.use(handleInternalServerErr);


module.exports = app;