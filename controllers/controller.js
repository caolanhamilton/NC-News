const { response } = require("../app.js");
const {fetchTopics, fetchArticleByID, addVoteToArticle, fetchUsernames} = require("../models/model.js")

exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((arrayOfTopicsObjs) => {
            res.status(200).send({topics: arrayOfTopicsObjs})
        }).catch((err) => {
            next(err)
        });
}

exports.getArticleByID = (req, res, next) => {
    const articleID = req.params.article_id
    fetchArticleByID(articleID)
        .then((articleObj) => {
            console.log(articleObj)
            res.status(200).send({articleObj})
        })
        .catch((err)=> {
            console.log(err)
            next(err)
        });
}

exports.patchArticleVotes = (req, res, next) => {
    const articleID = req.params.article_id
    const votesToAmendBy = req.body.inc_votes
    addVoteToArticle(articleID, votesToAmendBy)
        .then((articleWithUpdatedVotes) => {
            res.status(200).send({articleWithUpdatedVotes})
        })
        .catch((err) => {
            next(err)
        })
}

exports.getUsernames = (req, res, next) => {
    fetchUsernames()
        .then((usernames) => {
            res.status(200).send({usernames})
        })
        .catch(() => {
            next(err)
        })
}