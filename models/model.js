const db = require("../db/connection.js");
const app = require("../app.js");
const res = require("express/lib/response");
const { response } = require("../app.js");

exports.fetchTopics = () => {
    return db
        .query("SELECT * FROM topics")
        .then((response) => {
            return response.rows;
    })
}

exports.fetchArticleByID = (articleID) => {

    const commentCountPromise = db.query("SELECT * FROM comments WHERE article_id = $1", [articleID])

    const allArticlesByIDPromise = db.query("SELECT * FROM articles WHERE article_id = $1", [articleID])
        //article ID valid but there are no comments on article return 0 for comment count
        return Promise.all([commentCountPromise, allArticlesByIDPromise]).then((values) => {
            const numberOfComments = values[0].rowCount
            const articleObj = values[1].rows[0]
            if (articleObj === undefined) {
                return Promise.reject({status: 404, msg: "Resource not found with this ID"})
            }
            articleObj.comment_count = numberOfComments
            return articleObj
        })
}

exports.addVoteToArticle = (articleID, votesToAmendBy) => {
    if (votesToAmendBy === undefined) {
        return Promise.reject({status: 400, msg: "Missing required values in body"})
    }
    return db
        .query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [votesToAmendBy, articleID]).then((response) => {
           return response.rows[0]; 
        })  
}

exports.fetchUsernames = () => {
    return db
        .query("SELECT username FROM users")
        .then((response) => {
            return response.rows
        })
}