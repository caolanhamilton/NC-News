const db = require("../db/connection.js");

exports.fetchTopics = () => {
    return db
        .query("SELECT * FROM topics")
        .then((response) => {
            return response.rows;
    })
}

exports.checkTopicExists = (topic) => {
    return db   
        .query(`SELECT * FROM topics WHERE slug = '${topic}'`)
        .then((response) => {
            if (response.rowCount === 0 && topic !== undefined) {
                return Promise.reject({ status: 404, msg: 'Topic not found'})
            }
        })
}