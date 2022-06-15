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


exports.fetchAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {

 
    if (!['author', 'title', 'article_id', 'topic', 'created_at', 'comment_count', 'votes'].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort by query' });
    }
  
    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }
   
    const queryValues = []

    let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comment_id) AS integer) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `
  
    if (topic) {
        queryString += `WHERE articles.topic = $1`
        queryValues.push(topic)
    }
  
   queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`

    return db
        .query(queryString, queryValues)
        .then((response) => {
            const articlesArray = response.rows
            return articlesArray
        })
 }