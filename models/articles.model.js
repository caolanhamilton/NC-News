const db = require("../db/connection.js");

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

exports.fetchAllArticles = () => {
    return db
        .query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`)
        .then((response) => {
            const articlesArray = response.rows
            articlesArray.forEach(article => {
                article.comment_count = Number(article.comment_count)
            })
            return articlesArray
        })
}