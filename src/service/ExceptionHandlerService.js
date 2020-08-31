const exception = (err, req, res, next) => {
    console.error('ERROR:', err);
    res.status(500).send({
        error: err,
    });
};

module.exports = {
    exception,
};
