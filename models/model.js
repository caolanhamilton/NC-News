const res = require("express/lib/response")
const db = require("../db/connection.js")

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics").then((res) => {
        return res.rows;
    })
}