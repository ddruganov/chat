import LoginAction from "./actions/auth/LoginAction";
import LogoutAction from "./actions/auth/LogoutAction";

import express from 'express';

const AuthController = express.Router();
AuthController.post('/login', LoginAction);
AuthController.get('/logout', LogoutAction);

export default AuthController;