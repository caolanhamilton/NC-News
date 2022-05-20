const {fetchCommentsByArticleId, makeComment, removeComment, checkCommentExistsByCommentID} = require("../models/comments.model.js")
const {fetchArticleByID} = require("../models/articles.model")


exports.getCommentsById = (req, res, next) => {
    const articleID = req.params.article_id

    Promise.all([fetchCommentsByArticleId(articleID), fetchArticleByID(articleID)])
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

     Promise.all([fetchArticleByID(articleID),makeComment(articleID, commentObj)])
        .then((resolvedPromisesArray) => {
            const newComment = resolvedPromisesArray[1]
            res.status(201).send({newComment})
        })
        .catch((err) => {
            next(err)
        })
}

exports.deleteComment = (req, res, next) => {
    const commentID = req.params.comment_id
    Promise.all([checkCommentExistsByCommentID(commentID), removeComment(commentID)])
        .then(() => {
            res.status(204).send()
        })
        .catch((err) => {
            next(err)
        })
}