const db = require("../db/connection.js");

exports.fetchTopics = () => {
    return db
        .query("SELECT * FROM topics")
        .then((response) => {
            return response.rows;
    })
}

exports.fetchArticleByID = (articleID) => {

    return db
        .query(`SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`, [articleID])
        .then((response) => {
            const articleObj = response.rows[0]
            if (articleObj === undefined) {
                return Promise.reject({status: 404, msg: "Resource not found with this ID"})
               }
            articleObj.comment_count = Number(articleObj.comment_count)
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