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
        .status(400)
        .send({ error: true, message: "Not Authenticated" });
    }
    const token = tokenParts[1];

    const user = User.getByToken(token);
    if (user) {
      req.user = user;
      return next();
    } else {
      return res.status(400).send({ error: true, message: "Invalid Token" });
    }
  },
};
