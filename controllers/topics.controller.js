const {fetchTopics} = require("../models/topics.model.js")

exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((arrayOfTopicsObjs) => {
            res.status(200).send({topics: arrayOfTopicsObjs})
        }).catch((err) => {
            next(err)
        });
}