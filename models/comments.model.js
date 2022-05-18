const db = require("../db/connection.js");

exports.fetchCommentsById = (articleID) => {
    return db
        .query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1', [articleID])
        .then((response) => {
            const commentsArray = response.rows
            return commentsArray
        })
}