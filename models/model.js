const db = require("../db/connection.js");
const app = require("../app.js");

exports.fetchTopics = () => {
    return db
        .query("SELECT * FROM topics")
        .then((response) => {
            return response.rows;
    })
}

exports.fetchArticleByID = (articleID) => {
    return db
        .query("SELECT * FROM articles WHERE article_id = $1", [articleID])
        .then((response) => {
            if (response.rowCount === 0) {
                return Promise.reject({status: 404, msg: "Resource not found with this ID"})
            }
            return response.rows[0]
        });
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