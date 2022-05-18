const {fetchCommentsById, makeComment} = require("../models/comments.model.js")
const {fetchArticleByID} = require("../models/articles.model")


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

exports.postComment = (req, res, next) => {
    const articleID = req.params.article_id
    const commentObj = req.body

    const promisesArray = [fetchArticleByID(articleID),makeComment(articleID, commentObj)]

     Promise.all(promisesArray)
        .then((resolvedPromisesArray) => {
            const newComment = resolvedPromisesArray[1]
            res.status(201).send({newComment})
        })
        .catch((err) => {
            next(err)
        })
}