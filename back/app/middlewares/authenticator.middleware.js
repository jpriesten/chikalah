const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const response = require("../common/response.common");
const core = require("../common/core.common");

const auth = async (req, res, next) => {
  if (!core.isEmptyOrNull(req.header("Authorization"))) {
    try {
      const token = req.header("Authorization").replace("Bearer", "").trim();

      const decoded = jwt.verify(token, process.env.JWT_KEY);

      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) {
        throw new Error("Unauthorized access. Please login!");
      }
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      if (error.message === "connection timed out")
        response.errorResponse(res, 500, error.message, error.code);
      else
        response.errorResponse(
          res,
          401,
          "Unauthorized access. Please login!",
          error.code,
          error.message
        );
    }
  } else {
    response.errorResponse(res, 500, "Missing authorization code", 50000);
  }
};

module.exports = auth;
