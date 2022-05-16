const express = require("express");
const { getTopics, getArticleByID } = require("./controllers/controller")

const app = express();
app.use(express.json());

//GET

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);

//ERROR HANDLING
app.use("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  });

app.use((err, req, res, next) => { //deal with PSQL error
    if (err.code === '22P02') {
      res.status(400).send({msg: "Invalid ID type"});
    } else {
      next(err);
    }
});

app.use((err, req, res, next) => { //deal with custom errors
    if (err.status){
      res.status(err.status).send({msg: err.msg})
    } else {
      next(err)
    }
})


module.exports = app;