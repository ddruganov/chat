import { Request, response, Response } from "express";
import ExecutionResult from "../../../components/ExecutionResult";
import jwtConfig from "../../../config/jwt.config";
import jwt from 'jsonwebtoken';
import User from "../../../models/user/User";
import { INVALID_AUTH } from "../../../config/codes";
import CurrentUserCollector from "../../../collectors/user/CurrentUserCollector";
import { DateTime } from "luxon";

export default async function (req: Request, res: Response) {
    const accessToken = req.cookies['X-Access-Token'];

    if (!accessToken) {
        return res.send(new ExecutionResult(false, {}, { code: INVALID_AUTH }).asJson());
    }

    const verifyRes: any = await new Promise((resolve, reject) => {
        jwt.verify(accessToken, jwtConfig.secret, (err: any, decoded: any) => err ? reject(undefined) : resolve(decoded));
    })

    if (verifyRes === undefined) {
        return res.send(new ExecutionResult(false, {}, { code: INVALID_AUTH }).asJson());
    }
    console.log(verifyRes);


    const now = DateTime.now().toMillis();
    const accessTokenExpirationTimestamp = verifyRes.exp * 1000;

    if (now > accessTokenExpirationTimestamp) {
        // check refresh token
        const refreshToken = req.cookies['X-Refresh-Token'];
        if (!refreshToken) {
            return res.send(new ExecutionResult(false, {}, { code: INVALID_AUTH }).asJson());
        }

        const refreshTokenVerify: any = await new Promise((resolve, reject) => {
            jwt.verify(refreshToken, jwtConfig.secret, (err: any, decoded: any) => err ? reject(err) : resolve(decoded));
        });

        const refreshTokenExpirationTimestamp = refreshTokenVerify.exp;
        if (now > refreshTokenExpirationTimestamp) {
            return res.send(new ExecutionResult(false, {}, { code: INVALID_AUTH }).asJson());
        }

        // generate new accessToken

        console.log(refreshTokenVerify);
    }

    const user = (await User.findOne<User>({ left: 'id', value: '=', right: 1 }))!;
    res.send(new ExecutionResult(true, new CurrentUserCollector().setUser(user).get()).asJson());
}