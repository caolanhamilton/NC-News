const db = require("../db/connection.js");

exports.fetchCommentsByArticleId = (articleID) => {
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

exports.checkCommentExistsByCommentID = (commentID) => {
    return db   
        .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentID])
        .then((response) => {
            if (response.rowCount === 0) {
                return Promise.reject({ status: 404, msg: 'Comment not found with this ID'})
            }
        })
}

exports.removeComment = (commentID) => {
    return db
        .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [commentID])
}