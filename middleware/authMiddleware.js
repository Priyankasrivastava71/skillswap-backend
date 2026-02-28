const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/responseHandler");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      return errorResponse(res, 401, "Not authorized");
    }
  } else {
    return errorResponse(res, 401, "No token provided");
  }
};

module.exports = protect;