const {fetchArticleByID, addVoteToArticle, fetchAllArticles} = require("../models/articles.model")
const {checkTopicExists} = require("../models/topics.model")

exports.getArticleByID = (req, res, next) => {
    const articleID = req.params.article_id
    fetchArticleByID(articleID)
        .then((articleObj) => {
            res.status(200).send({articleObj})
        })
        .catch((err)=> {
            next(err)
        });
}

exports.getAllArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query

    const promisesArray = [checkTopicExists(topic), fetchAllArticles(sort_by, order, topic)]

    Promise.all(promisesArray)
        .then((resolvedPromiseArray) => {
            const articles = resolvedPromiseArray[1]
            res.status(200).send({articles})
        })
        .catch((err) => {
            next(err)
        })
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
