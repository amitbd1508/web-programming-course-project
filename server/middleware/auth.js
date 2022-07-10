const User = require('../models/user')


const verifyUserToken = (req, res, next) => {
    const accessToken = req.headers.authorization

    if (!accessToken) {
        return res.status(400).send('Not Authenticated')
    }

    const decoded = User.verifyToken(accessToken)
    if (decoded) {
        req.user = decoded;
        return next();

    } else {
        return res.status(400).send("Invalid Token")
    }
}

module.exports = verifyToken;