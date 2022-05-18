const res = require("express/lib/response");
const {fetchTopics, fetchArticleByID, addVoteToArticle, fetchUsernames, fetchAllArticles, fetchCommentsById} = require("../models/model.js")

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

exports.getUsernames = (req, res, next) => {
    fetchUsernames()
        .then((usernames) => {
            res.status(200).send({usernames})
        })
        .catch((err) => {
            next(err)
        })
}

exports.getCommentsById = (req, res, next) => {
    const articleID = req.params.article_id

    const promisesArray = [fetchCommentsById(articleID), fetchArticleByID(articleID)]

    Promise.all(promisesArray)
        .then((resolvedPromisesArray) => {
            const comments = resolvedPromisesArray[0] 
            res.status(200).send({comments})
        })
        .catch((err) => {
            next(err)
        })
}