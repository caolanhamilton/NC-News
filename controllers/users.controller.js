const {fetchUsernames} = require("../models/users.model.js")

exports.getUsernames = (req, res, next) => {
    fetchUsernames()
        .then((usernames) => {
            res.status(200).send({usernames})
        })
        .catch((err) => {
            next(err)
        })
}
