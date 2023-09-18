const errorHandlingMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    return res.status(err.status || 500).send(err.message);
}

module.exports = { errorHandlingMiddleware };