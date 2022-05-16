const res = require("express/lib/response")
const db = require("../db/connection.js")

exports.fetchTopics = () => {
    return db
        .query("SELECT * FROM topics").then((response) => {
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