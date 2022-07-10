const User = require('../models/user');

module.exports = {
    login(req, res) {
        const {username, password} = req.body;
        console.log(req.body);

        if (!(username || !password)) {
            return res.status(400).send({error: true, message: 'User name or password is missing!'})
        }

        const user = User.getUser(username, password);
        console.log(user)
      
        if (user) {
            this.accessToken = `${user.id}-${user.username}-${new Date().valueOf()}`;
            return res.status(200).send({error: false, message: 'Login sucessfull', data: {
                firstname: user.firstName,
                lastname: user.lastName,
                accessToken: this.accessToken
            }})
        }
        return res.status(400).send({error: true, message: 'Login unsucessfull please try again using vaild credential!'})
    }
}