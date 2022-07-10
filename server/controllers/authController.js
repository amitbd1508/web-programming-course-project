const User = require('../models/user');

module.exports = {
    login: (req, res) => {
        const { username, password } = req.body;
        const user = User.getActiveUser(username, password);
        if(user) {
            res.status(200).json({ error: false, message: "Active session" });
        } else {
            
        }
    },

    logout: (req, res) => {
        console.log('logout');
    }
}