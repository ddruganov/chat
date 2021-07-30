import { Request, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import LoginValidator from "../../../components/validators/auth/LoginValidator";
import jwt from 'jsonwebtoken';
import User from "../../../models/user/User";
import jwtConfig from "../../../config/jwt.config";
import DateHelper from "../../../components/helpers/DateHelper";

export default async function (req: Request, res: Response) {
    const loginValidator = new LoginValidator(req.body);

    // if (!loginValidator.validate()) {
    //     return res.json(new ExecutionResult(false, { errors: loginValidator.errors }).asJson());
    // }

    // user is always defined after login validation is complete
    const user = (await User.findOne({ left: 'email', value: '=', right: loginValidator.loginData.email }))!;


    const accessToken = jwt.sign({ userId: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.accessTokenLifetime });
    res.cookie('X-Access-Token', accessToken, {
        httpOnly: true,
        expires: new Date(DateHelper.nowAsDate().getTime() + jwtConfig.accessTokenLifetime),
        sameSite: 'lax',
        secure: false
    });

    const refreshToken = jwt.sign({ accessToken: accessToken }, jwtConfig.secret, { expiresIn: jwtConfig.refreshTokenLifetime });
    res.cookie('X-Refresh-Token', refreshToken, {
        httpOnly: true,
        expires: new Date(DateHelper.nowAsDate().getTime() + jwtConfig.refreshTokenLifetime),
        sameSite: 'lax',
        secure: false
    });

    res.send(new ExecutionResult(true).asJson());
}