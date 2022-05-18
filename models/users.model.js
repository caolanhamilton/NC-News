const db = require("../db/connection.js");

exports.fetchUsernames = () => {
    return db
        .query("SELECT username FROM users")
        .then((response) => {
            return response.rows
        })
}