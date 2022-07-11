const User = require("../models/user");

module.exports = {
  verifyUserToken(req, res, next) {
    const accessToken = req.headers.authorization;
    const tokenParts = accessToken.split(" ");

    if (
      !accessToken &&
      accessToken.includes("Bearer") &&
      tokenParts.length > 0
    ) {
      return res
        .status(401)
        .send({ error: true, errorCode: 401, message: "Not Authenticated! Please login." });
    }
    const token = tokenParts[1];

    const user = User.getByToken(token);
    if (user) {
      req.user = user;
      return next();
    } else {
      return res.status(401).send({ error: true, errorCode: 401, message: "Session invalid! Please login." });
    }
  },
};
