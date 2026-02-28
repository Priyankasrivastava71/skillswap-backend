const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(res, 500, "Something went wrong"
  );
};

module.exports = errorHandler;