import LoginAction from "./actions/auth/LoginAction";
import LogoutAction from "./actions/auth/LogoutAction";

import express from 'express';
import GetCurrentUserAction from "./actions/auth/GetCurrentUserAction";

const AuthController = express.Router();
AuthController.post('/login', LoginAction);
AuthController.post('/logout', LogoutAction);
AuthController.post('/getCurrentUser', GetCurrentUserAction);

export default AuthController;