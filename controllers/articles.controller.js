const {fetchArticleByID, addVoteToArticle, fetchAllArticles} = require("../models/articles.model")

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
    fetchAllArticles()
        .then((articles) => {
            res.status(200).send({articles})
        })
        .catch((err)=> {
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
