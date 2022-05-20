const {fetchEndpoints} = require('../models/endpoint.model')
exports.getEndpoints = (req, res, next) => {
    fetchEndpoints()
        .then((response) => {
            res.status(200).send(response)
        })
        .catch((err) => {
            next(err)
        })
}