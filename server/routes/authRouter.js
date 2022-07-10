const { Router } = require('express');
const { login, logout } = require('../controllers/authController');

const authRouter = Router();

authRouter.post(`/login`, login);
authRouter.post(`/logout`, logout);


module.exports = authRouter;