import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import LoginValidator from "../../../components/validators/auth/LoginValidator";
import jwt from 'jsonwebtoken';
import User from "../../../models/user/User";
import jwtConfig from "../../../config/jwt.config";

export default async function (req: Request, res: Response) {
    const loginValidator = new LoginValidator(req.body);

    // if (!loginValidator.validate()) {
    //     return res.json(new ExecutionResult(false, { errors: loginValidator.errors }).asJson());
    // }

    // user is always defined after login validation is complete
    const user = (await User.findOne({ left: 'email', value: '=', right: loginValidator.loginData.email }))!;

    const token = jwt.sign({ userId: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.accessTokenLifetime });
    console.log(token);

    res.cookie('X-Access-Token', token, {
        // httpOnly: true,
        expires: new Date(Date.now() + (jwtConfig.accessTokenLifetime * 1000)),
        sameSite: 'lax',
        secure: false
    });
    res.send(new ExecutionResult(true).asJson());
}