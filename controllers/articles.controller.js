const {fetchArticleByID, addVoteToArticle, fetchAllArticles} = require("../models/articles.model")
const {fetchTopics} = require("../models/topics.model")

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

    const promisesArray = [fetchTopics(), fetchAllArticles(sort_by, order, topic)]

    Promise.all(promisesArray)
        .then((resolvedPromiseArray) => {
            const articles = resolvedPromiseArray[1]

            const listOfValidTopics = resolvedPromiseArray[0].map(topicsObject => topicsObject.slug)

            if(listOfValidTopics.includes(topic) || topic === undefined) {
                res.status(200).send({articles})
            } else {
                res.status(404).send({msg: 'No article with topic found'})
            }

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
