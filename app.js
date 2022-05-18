const express = require("express");
const {getCommentsById} = require("./controllers/comments.controller.js")
const {getArticleByID, patchArticleVotes, getAllArticles} = require("./controllers/articles.controller.js")
const {getTopics} = require("./controllers/topics.controller.js")
const {getUsernames} = require("./controllers/users.controller.js")
const {handlePSQLErr, handleCustomErr, handleInternalServerErr} = require("./controllers/error.controllers")

const app = express();
app.use(express.json());

//GET
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsernames);
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id/comments", getCommentsById)

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