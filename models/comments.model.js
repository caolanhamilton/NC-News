const db = require("../db/connection.js");

exports.fetchCommentsById = (articleID) => {
    return db
        .query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1', [articleID])
        .then((response) => {
            const commentsArray = response.rows
            return commentsArray
        })
}

exports.makeComment = (articleID, commentObj) => {
    return db
        .query(`INSERT INTO comments (author, article_id, body) VALUES ($1, $2, $3)
        RETURNING *`, [commentObj.username, articleID, commentObj.body])
        .then((response) => {
            return response.rows[0]
        })
}