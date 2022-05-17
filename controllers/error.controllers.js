exports.handlePSQLErr = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: "Invalid data type"});
      } else {
        next(err);
      }
  };

exports.handleCustomErr = (err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({msg: err.msg})
      } else {
        next(err)
      }
};

exports.handleInternalServerErr = (err, req, res, next) => {
    res.status(500).send({message: "Internal server error!"})
}